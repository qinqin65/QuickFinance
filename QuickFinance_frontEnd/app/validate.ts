import * as dom from 'dojo/dom';
import * as on from 'dojo/on';

export enum validateType{needed, email, phone};

export class Validete {
    private validateItems: Array<any>;
    
    constructor() {
        this.validateItems = [];
    }
    
    addValiItems(item: string, type: validateType) {
        this.validateItems.push({item, type});
    }
    
    private refuseHandle(node) {
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
                default:
                    break;
            }
        }
        // this.validateItems.forEach((itemObj)=>{
            
        // });
        return isPassed;
    }
}