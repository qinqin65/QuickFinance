import * as topic from 'dojo/topic';
import * as xhr from 'xhr';
import Config from 'config';
import * as stateCode from 'stateCode';
import * as lang from 'dojo/i18n!app/nls/langResource.js';

class User {
    public isLogin: boolean
    public userName: string
    private isLoginRequst: boolean

    constructor() {
        this.isLogin = false;
        this.isLoginRequst = false;
    }

    login(userName: string, password: string, isRemenmber: boolean) {
        if(this.isLoginRequst) {
            return;
        }

        let option: any = {
            handleAs: 'json',
            data: {
                userName,
                password,
                isRemenmber
            }
        };
        xhr.post(`${Config.requestHost}/login`, option)
        .then((data)=>{
            if(!data.state || data.state != stateCode.SUCCESS || !data.user) {
                topic.publish('login/error', data.info);
            } else {
                this.isLogin = true;
                this.userName = userName;
                topic.publish('user/login', this);
            }
        }, (error)=>{
            topic.publish('login/error', lang.xhrErr);
        })
        .then(()=>this.isLoginRequst = false);

        this.isLoginRequst = true;
    }

    remembermeLogin(userName: string) {
        this.isLogin = true;
        this.userName = userName;
    }

    logout() {
        let option: any = {
            url: `${Config.requestHost}/logout`,
            handleAs: 'json'
        };
        xhr.get(option)
        .then((data)=>{
            if(!data.state || data.state != stateCode.SUCCESS) {
                topic.publish('tipService/warning', data.info);
            } else {
                this.isLogin = false;
                this.userName = '';

                topic.publish('user/logout', this);
            }
        }, (error)=>{

        });
    }

    register(userName: string, email: string, password: string) {
        let option: any = {
            handleAs: 'json',
            data: {
                userName,
                email,
                password
            }
        };
        xhr.post(`${Config.requestHost}/register`, option)
        .then((data)=>{
            if(!data.state || data.state != stateCode.SUCCESS || !data.user) {
                topic.publish('login/error', data.info);
            } else {
                topic.publish('login/error', lang.xhrRegSuccess);
            }
        }, (error)=>{
            topic.publish('login/error', lang.xhrErr);
        });
    }
}

export let user = new User();