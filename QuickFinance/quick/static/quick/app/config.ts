import * as cookie from 'dojo/cookie';

export default class Config {
    static requestHost: string = 'http://localhost:8000/quick';
    static csrf: string = cookie('csrftoken');
    static passwordMinLength: number = 6;
}