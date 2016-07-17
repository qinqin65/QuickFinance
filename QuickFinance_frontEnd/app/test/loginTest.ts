import * as xhr from 'xhr';
import Config from 'config';
import * as stateCode from 'stateCode';
import * as login from '../login';
import * as chai from 'ref/js/chai';

export let describes = function() {
    describe.skip("MainLogin_btLoginHandle", function() {
        it("should receive correct data", function() {
            let option: any = {
                handleAs: 'json', 
                data: {
                'userName': 'testUserName',
                'password': 'testPassword'
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
    
    describe("MainLogin_btRegisterHandle", function() {
        it("user name should be identical", function() {
            let timeStamp = new Date().getTime();
            let option: any = {
                handleAs: 'json', 
                data: {
                'userName': `test${timeStamp}`,
                'email':'',
                'password': '123456'
                }
            };
            return xhr.post(`${Config.requestHost}/register`, option)
            .then((data)=>{
                chai.assert.equal(data.state, stateCode.SUCCESS);
                chai.assert.equal(option.data.userName, data.user.userName);
            }, (error)=>{
                throw error;
            });
        });
    });
}