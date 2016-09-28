import * as topic from 'dojo/topic';
import * as lang from 'dojo/i18n!app/nls/langResource.js';
import * as xhr from 'xhr';
import Config from 'config';
import * as stateCode from 'stateCode';
import {user} from 'user';
import {getCountDays} from 'util';

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
            url: `${Config.requestHost}/${this.requestPath}`,
            handleAs: 'json'
        };
        xhr.get(option)
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
    currentAccountBook: string
    currentAccount: string
    accountStore: Array<any>

    constructor() {
        super();
        this.currentAccountBook = '';
        this.currentAccount = '';
        this.accountStore = [];
    }

    requestStore() {
        let option: any = {
            url: `${Config.requestHost}/accountBookData`,
            handleAs: 'json',
            content: {
                accountBook: this.currentAccountBook
            }
        };
        xhr.get(option)
        .then((data)=>{
            if(data.state === stateCode.SUCCESS  && dojo.isArray(data.accountBooks) && dojo.isArray(data.accounts)) {
                this.store = data.accountBooks;
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

export enum AccountingType{income = stateCode.INCOME, outcome = stateCode.OUTCOME}

class FinancePreviewStore extends BaseStore {
    private year: string;
    private month: string;
    private day: string;
    private hour: string;
    private type: AccountingType;
    private accountBook: string;
    private account: string;

    constructor() {
        super();
    }

    getyear(): string {
        return this.year;
    }

    getMonth(): string {
        return this.month;
    }

    getDay(): string {
        return this.day;
    }

    getType(): AccountingType {
        return this.type;
    }

    isStoreEmpty() {
        return this.store.length === 0;
    }

    setParam(year: string, month: string, day: string, type: AccountingType, accountBook: string, account: string) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.type = type;
        this.accountBook = accountBook;
        this.account = account;
    }

    private initStore(length: number) {
        this.store = [];
        for(let i = 0; i < length; i++) {
            this.store[i] = 0;
        }
    }

    private dataHandler(data: Array<any>) {
        let getCursor = (date)=>{
            let curDate = new Date(date);
            return curDate.getMonth();
        }
        if(this.month == '0') {
            this.initStore(12);
        } else if(this.day == '0') {
            let days: number = getCountDays(`${this.year}/${this.month}/1`);
            this.initStore(days);
            getCursor = (date)=>{
                let curDate = new Date(date);
                return curDate.getDate() - 1;
            }
        } else {
            this.initStore(24);
            getCursor = (date)=>{
                let curDate = new Date(date);
                return curDate.getHours() - 1;
            }
        }
        for(let i = 0; i < data.length; i++) {
            let cursor = getCursor(data[i].date);
            this.store[cursor] += data[i].value;
        }
    }

    requestStore() {
        if(!this.year || !this.month || !this.day || !this.type) {
            return;
        }
        let option: any = {
            url: `${Config.requestHost}/financePreviewData`,
            handleAs: 'json',
            content: {
                year: this.year,
                month: this.month,
                day: this.day,
                type: this.type,
                accountBook: this.accountBook,
                account: this.account
            }
        };
        xhr.get(option)
        .then((data)=>{
            if(data.state === stateCode.SUCCESS  && dojo.isArray(data.financePreviewData)) {
                this.dataHandler(data.financePreviewData);
                topic.publish('finance/financeDataChanged', false);
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

    clearStore() {
        this.store = [];
    }
}

export let currencySelectStore = new SelectStore('currencySelectStore', 'currencySelectStore');
export let accountTypeSelectStore = new SelectStore('accountTypeSelectStore', 'accountTypeSelectStore');
export let accountInfoStore = new AccountInfoStore();
export let financePreviewStore = new FinancePreviewStore();