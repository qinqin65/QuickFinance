import * as topic from 'dojo/topic';
import * as lang from 'dojo/i18n!app/nls/langResource.js';
import * as xhr from 'xhr';
import Config from 'config';
import * as stateCode from 'stateCode';
import {user} from 'user';

class SelectStore {
    requestPath: string
    topicString: string
    private optionStore: Array<string>
    private isRequesting: boolean
    
    constructor(requestPath: string, topicString: string) {
        this.requestPath = requestPath;
        this.topicString = topicString;
        this.optionStore = [];
    }
    
    requestStore() {
        let option: any = {
            handleAs: 'json'
        };
        xhr.get(`${Config.requestHost}/${this.requestPath}`, option)
        .then((data)=>{
            if(data.state === stateCode.SUCCESS && dojo.isArray(data.selectStore)) {
                this.optionStore = data.selectStore;
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
    
    getStore():Array<string> {
        if(this.optionStore.length === 0 && !this.isRequesting) {
            this.requestStore();
        }
        return this.optionStore;
    }
}

export let currencySelectStore = new SelectStore('currencySelectStore', 'currencySelectStore');
export let accountTypeSelectStore = new SelectStore('accountTypeSelectStore', 'accountTypeSelectStore');