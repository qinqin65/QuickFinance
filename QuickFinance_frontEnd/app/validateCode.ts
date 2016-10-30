import * as dom from 'dojo/dom';
import * as on from 'dojo/on';
import * as topic from 'dojo/topic';
import * as xhr from 'xhr';
import Config from 'config';
import * as stateCode from 'stateCode';
import * as lang from 'dojo/i18n!app/nls/langResource.js';

export class ValidateCode {
    private appendDomId: string;
    private topicHandler: Array<any>

    constructor(appendDomId: string) {
        this.appendDomId = appendDomId;
        this.topicHandler = [];
        this.register();
    }

    destroy() {
        this.topicHandler.forEach((topicItem)=>topicItem.remove());
    }

    register() {
        let option: any = {
            url: `${Config.requestHost}/getCaptcha?t=${(new Date()).getTime()}`,
            handleAs: 'json'
        };
        xhr.get(option)
        .then((data)=>{
            if(!data.state || data.state != stateCode.SUCCESS) {
                topic.publish('tipService/warning', data.info);
            } else {
                let geeData = JSON.parse(data.responseStr);
                window.initGeetest({
                    gt: geeData.gt,
                    challenge: geeData.challenge,
                    product: "float",
                    offline: !geeData.success
                }, this.handlerPopup.bind(this));
            }
        }, (error)=>{

        });
    }

    handlerPopup(captchaObj: any) {
        captchaObj.appendTo(`#${this.appendDomId}`);
        this.topicHandler.push(topic.subscribe('validateCode/validate', function(callback) {
            let validate = captchaObj.getValidate();
            if (!validate) {
                topic.publish('tipService/warning', lang.validateWarning);
                return;
            }
            let option: any = {
                handleAs: 'json',
                data: {
                    geetest_challenge: validate.geetest_challenge,
                    geetest_validate: validate.geetest_validate,
                    geetest_seccode: validate.geetest_seccode
                }
            };
            xhr.post(`${Config.requestHost}/validateCapthca`, option)
            .then((data)=>{
                if(!data.state || data.state != stateCode.SUCCESS) {
                    topic.publish('tipService/warning', data.info);
                } else {
                    callback();
                }
            }, (error)=>{

            });
        }));
    }
}