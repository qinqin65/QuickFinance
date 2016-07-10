import * as dom from 'dojo/dom';
import * as on from 'dojo/on';
import Config from 'config';

export enum validateType{needed, email, phone, passwordLength, passwordEqual};

export class Validete {
    private validateItems: Array<any>;
    
    constructor() {
        this.validateItems = [];
    }
    
    addValiItems(item: string|Array<string>, type: validateType) {
        this.validateItems.push({item, type});
    }
    
    private refuseHandle(node) {
        if(node.classList.contains('needed')) {
            return;
        }
        node.classList.add('needed');
        on.once(node, 'click', ()=>node.classList.remove('needed'));
    }
    
    private neededvalidate(nodeId): boolean {
        let node: any = dom.byId(nodeId);
        if(node === null) {
            return true;
        } else if(node.value) {
            return true;
        } else {
            this.refuseHandle(node);
            return false;
        }
    }
    
    private emailValidate(nodeId): boolean {
        let node: any = dom.byId(nodeId);
        if(node === null || node.value == '') {
            return true;
        } else {
            let emailReg = new RegExp(/.+@.+\..+/);
            let result = emailReg.test(node.value);
            if(!result) {
                this.refuseHandle(node);
            }
            return result;
        } 
    }
    
    private passwordLengthValidate(nodeId) {
        let node: any = dom.byId(nodeId);
        if(node === null) {
            return true;
        } else {
            let result: boolean = true;
            if(node.value.length < Config.passwordMinLength) {
                result = false;
                this.refuseHandle(node);
            }
            return result;
        } 
    }
    
    private passwordEqualValidate(passwordNodeId, passwordAginNodeId) {
        let passwordNode: any = dom.byId(passwordNodeId);
        let passwordAginNode: any = dom.byId(passwordAginNodeId);
        if(passwordNode === null || passwordAginNode === null) {
            return true;
        } else {
            let result =  passwordNode.value === passwordAginNode.value;
            if(!result) {
                this.refuseHandle(passwordNode);
                this.refuseHandle(passwordAginNode);
            }
            return result;
        }
    }
    
    validate(): boolean {
        let isPassed: boolean = true;
        for(let i=0; i<this.validateItems.length; i++) {
            let itemObj = this.validateItems[i];
            let itemId: string = itemObj.item;
            let type: validateType = itemObj.type;
            switch(type) {
                case validateType.needed: {
                        let result = this.neededvalidate(itemId);
                        if(isPassed) {
                            isPassed = result
                        }
                    }
                    break;
                case validateType.email: {
                        let result = this.emailValidate(itemId);
                        if(isPassed) {
                            isPassed = result
                        }
                    }
                    break;
                case validateType.passwordLength: {
                        let result = this.passwordLengthValidate(itemId);
                        if(isPassed) {
                            isPassed = result
                        }
                    }
                    break;
                case validateType.passwordEqual: {
                        let result = dojo.isArray(itemId) ? this.passwordEqualValidate(itemId[0], itemId[1]) : true;
                        if(isPassed) {
                            isPassed = result
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        // this.validateItems.forEach((itemObj)=>{
            
        // });
        return isPassed;
    }
}