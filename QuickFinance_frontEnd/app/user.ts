import * as topic from 'dojo/topic';

class User {
    public isLogin: boolean
    public userName: string
    
    constructor() {
        this.isLogin = false;
    }
    
    login(userName: string) {
        this.isLogin = true;
        this.userName = userName;
        
        topic.publish('user/login', this);
    }
    
    logout() {
        this.isLogin = false;
        this.userName = '';
        
        topic.publish('user/logout', this);
    }
}

export let user = new User();