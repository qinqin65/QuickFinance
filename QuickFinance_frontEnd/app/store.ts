import * as topic from 'dojo/topic';
import * as lang from 'dojo/i18n!app/nls/langResource.js';
import * as xhr from 'xhr';
import Config from 'config';
import * as stateCode from 'stateCode';
import {user} from 'user';

abstract class BaseStore {
    protected store: Array<any>
    protected isRequesting: boolean
    
    constructor() {
        this.store = [];
        this.isRequesting = false;
    }
    
    abstract requestStore()
    
    getStore():Array<string> {
        if(this.store.length === 0 && !this.isRequesting) {
            this.requestStore();
        }
        return this.store;
    }
}

class SelectStore extends BaseStore {
    requestPath: string
    topicString: string
    
    constructor(requestPath: string, topicString: string) {
        super();
        this.requestPath = requestPath;
        this.topicString = topicString;
    }
    
    requestStore() {
        let option: any = {
            handleAs: 'json'
        };
        xhr.get(`${Config.requestHost}/${this.requestPath}`, option)
        .then((data)=>{
            if(data.state === stateCode.SUCCESS && dojo.isArray(data.selectStore)) {
                this.store = data.selectStore;
                topic.publish(`selectStore/${this.topicString}`, this);
            } else if(data.state === stateCode.Error) {
                topic.publish('tipService/warning', data.info);
            } else if(data.state === stateCode.NOTLOGGIN) {
                topic.publish('tipService/warning', data.info);
                user.logout();
            } else {
                topic.publish('tipService/warning', lang.xhrDataError);
            }
        }, (error)=>{
        
        })
        .then(()=>this.isRequesting = false);
        
        this.isRequesting = true;
    }
}

class AccountInfoStore extends BaseStore {
    accountBook: string
    currentAccountBook: string
    currentAccount: string
    accountStore: Array<any>
    
    constructor() {
        super();
        this.accountBook = '';
        this.currentAccountBook = '';
        this.currentAccount = '';
        this.accountStore = [];
    }
    
    requestStore() {
        let option: any = {
            handleAs: 'json',
            data: {
                accountBook: this.accountBook
            }
        };
        xhr.post(`${Config.requestHost}/requestAccountBookData`, option)
        .then((data)=>{
            if(data.state === stateCode.SUCCESS  && dojo.isArray(data.accountBooks) && dojo.isArray(data.accounts)) {
                this.store = data.accountBooks;
                this.currentAccountBook = data.currentAccountBook;
                this.accountStore = data.accounts;
                topic.publish('financeapp/accountBookData', this);
            } else if(data.state === stateCode.Error) {
                topic.publish('tipService/warning', data.info);
            } else if(data.state === stateCode.NOTLOGGIN) {
                topic.publish('tipService/warning', data.info);
                user.logout();
            } else {
                topic.publish('tipService/warning', lang.xhrDataError);
            }
        }, (error)=>{
            topic.publish('tipService/error', lang.xhrErr);
        })
        .then(()=>this.isRequesting = false);
        
        this.isRequesting = true;
    }
    
    getAccountStore():Array<any> {
        if(this.accountStore.length === 0 && !this.isRequesting) {
            this.requestStore();
        }
        return this.accountStore;
    }
    
    setStore(data) {
        if(dojo.isArray(data.accountBooks) && dojo.isArray(data.accounts)) {
            this.store = data.accountBooks;
            this.accountStore = data.accounts;
            topic.publish('financeapp/accountBookData', this);
        }
    }
}

export let currencySelectStore = new SelectStore('currencySelectStore', 'currencySelectStore');
export let accountTypeSelectStore = new SelectStore('accountTypeSelectStore', 'accountTypeSelectStore');
export let accountInfoStore = new AccountInfoStore();