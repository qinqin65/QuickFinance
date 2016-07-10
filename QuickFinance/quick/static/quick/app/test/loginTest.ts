import * as xhr from 'dojo/request/xhr';
import {Config, Util} from 'util';
import * as stateCode from 'stateCode';
import * as login from '../login';
import * as chai from 'ref/js/chai';

export let describes = function() {
    describe("MainLogin_btLoginHandle", function() {
        it("should receive correct data", function() {
            let option: any = {
                handleAs: 'json', 
                data: {
                'userName': 'testUserName',
                'password': 'testPassword',
                'csrfmiddlewaretoken': Util.getCSRF()
                }
            };
            return xhr.post(`${Config.requestHost}/login`, option)
            .then((data)=>{
                chai.assert.equal(data.state, stateCode.Error);
            }, (error)=>{
                throw error;
            });
        });
    });
}