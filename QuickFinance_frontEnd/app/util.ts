import * as cookie from 'dojo/cookie';

export class Config {
    static requestHost: string = 'http://localhost:8000/quick';
}

export class Util {
    static getCSRF(): string {
        let csrf: string =  cookie('csrftoken');
        return csrf;
    }
}