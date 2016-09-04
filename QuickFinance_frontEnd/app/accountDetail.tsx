import * as React from 'react';
import * as lang from 'dojo/i18n!app/nls/langResource.js';
import * as topic from 'dojo/topic';
import Config from 'config';
import * as stateCode from 'stateCode';
import * as xhr from 'xhr';
import {user} from 'user';
import {currencySelectStore, accountTypeSelectStore, accountInfoStore} from 'store';
import {Validete, validateType} from 'validate';

export enum accountToolSelect{income = stateCode.INCOME, outcome = stateCode.OUTCOME, handleButton = outcome + 1}
export enum accountPanel{accountTool, accounting}

export class AccountTool extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
  }
  
  render() {
      return (
        <div className="toolBox-container">
          <div className="accountTool-container" onClick={ ()=>topic.publish('accountTool/itemClicked', accountToolSelect.income) }><i className="fa fa-file-text-o" aria-hidden="true"></i><span className="accountTip">{ lang.income }</span></div>
          <div className="accountTool-container" onClick={ ()=>topic.publish('accountTool/itemClicked', accountToolSelect.outcome) }><i className="fa fa-file-text" aria-hidden="true"></i><span className="accountTip">{ lang.outcome }</span></div>
        </div>
      )
  }
}

export class Accounting extends React.Component<any, any> {
  private topicHandler: Array<any>
  validates: Validete;
  
  constructor(props, context) {
    super(props, context);
    this.state = {selectCurrencyValue: '', selectTypevalue: ''};
    this.topicHandler = [];
    this.validates = new Validete();
    this.topicHandler.push(topic.subscribe('selectStore/currencySelectStore', ()=>this.forceUpdate()));
    this.topicHandler.push(topic.subscribe('selectStore/accountTypeSelectStore', ()=>this.forceUpdate()));
  }
  
  selectHandler(event) {
    this.setState({selectValue: event.target.value});
  }
  
  componentDidMount() {
    this.validates.addValiItems('accountValue', validateType.needed);
    this.validates.addValiItems('accountDate', validateType.needed);
  }
  
  componentWillUnmount() {
    this.topicHandler.forEach((topicItem)=>topicItem.remove());
  }
  
  accounttinghandle() {
    if(!this.validates.validate()) {
      return;
    }
    let option: any = {
        handleAs: 'json',
        data: {
            value: this.refs.accountValue.value,
            currency: this.refs.accountingCurrency.value,
            accountType: this.refs.accountingType.value,
            date: this.refs.accountDate.value,
            remark: this.refs.accountRemark.value,
            type: this.props.accountType,
            accountBook: accountInfoStore.currentAccountBook,
            account: accountInfoStore.currentAccount
        }
    };
    xhr.post(`${Config.requestHost}/accounting`, option)
    .then((data)=>{
        if(data.state === stateCode.SUCCESS) {
          accountInfoStore.setStore(data);
          topic.publish('tipService/info', lang.saveSuccess);
          topic.publish('accountTool/itemClicked', accountToolSelect.handleButton);
          topic.publish('finance/financeDataChanged', null);
        } else if(data.state === stateCode.Error) {
          topic.publish('tipService/warning', data.info);
        } else if(data.state === stateCode.NOTLOGGIN) {
          topic.publish('tipService/warning', data.info);
          user.logout();
        } else {
          topic.publish('tipService/warning', lang.xhrDataError);
        }
    }, (error)=>{
        topic.publish('tipService/error', lang.xhrErr);
    });
  }
  
  cancelHandle() {
    topic.publish('accountTool/itemClicked', accountToolSelect.handleButton);
  }
  
  render() {
      return (
        <div>
          <div className="accounting-block">
            <div>
              <label htmlFor="number">{ lang.accountValue }</label>
              <input className="inputBox" ref='accountValue' type="number" id="accountValue" />
            </div>
          
            <div>
              <label htmlFor="accountingCurrency">{ lang.currency }</label>
              <select className="accounting-block-select" style={{ marginLeft: '2rem' }} ref="accountingCurrency" id="accountingCurrency" onChange={ (event: any)=>this.setState({selectCurrencyValue: event.target.value}) } value={ this.state.selectCurrencyValue }>
                {
                  currencySelectStore.getStore().map((accountingCurrency: any)=><option key={ accountingCurrency.code } value={ accountingCurrency.code }>{ accountingCurrency.name }</option>)
                }
              </select>
            </div>
          </div>
          
          <div className="accounting-block">
            <div>
              <label htmlFor="accountingType">{ lang.accountType }</label>
              <select className="accounting-block-select" ref="accountingType" id="accountingType" onChange={ (event: any)=>this.setState({selectTypevalue: event.target.value}) } value={ this.state.selectTypevalue }>
                {
                  accountTypeSelectStore.getStore().map((accountType)=><option key={ accountType } value={ accountType }>{ accountType }</option>)
                }
              </select>
            </div>

            <div>
              <label htmlFor="accountDate">{ lang.accountDate }</label>
              <input className="inputBox" ref='accountDate' id="accountDate" type="datetime-local" defaultValue={ new Date().toISOString().replace(/\..+/, '') }/>
            </div>
          </div>
          
          <div className="accounting-block">
            <div>
              <label className="accounting-lb-remark" htmlFor="accountRemark">{ lang.accountRemark }</label>
              <textarea className="accounting-txt-remark inputBox" ref='accountRemark' id="accountRemark"></textarea>
            </div>
          </div>
          
          <div className="accounting-button">
            <button className="bt-comfirm" style={{ marginRight: '1rem' }} onClick = { this.accounttinghandle.bind(this) }>{ lang.comfirm }</button>
            <button className="bt-cancel" style={{ marginLeft: '1rem' }} onClick = { this.cancelHandle.bind(this) }>{ lang.cancel }</button>
          </div>
        </div>
      )
  }
}