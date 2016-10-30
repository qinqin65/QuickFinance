import * as Util from '../util';
import * as chai from 'ref/js/chai';
import * as xhr from 'xhr';
import Config from 'config';
import * as stateCode from 'stateCode';

export let describes = function() {
    describe("Setup_security", function() {
        it("should failed if not pass validation when changing password", function() {
            let timeStamp = new Date().getTime();
            let option: any = {
                handleAs: 'json',
                data: {
                    oldPassword: '123456',
                    newPassword: '654321'
                }
            };
            return xhr.post(`${Config.requestHost}/changingPassword`, option)
            .then((data)=>{
                chai.assert.equal(data.state, stateCode.Error);
            }, (error)=>{
                throw error;
            });
        });
    });
}