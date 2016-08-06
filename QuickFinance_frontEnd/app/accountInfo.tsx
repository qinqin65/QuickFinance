import * as React from 'react';
import * as lang from 'dojo/i18n!app/nls/langResource.js';
import * as topic from 'dojo/topic';
import Config from 'config';
import * as stateCode from 'stateCode';
import * as xhr from 'xhr';
import {user} from 'user';
import {accountInfoStore} from 'store';

export class AccountBook extends React.Component<any, any> {
  private topicHandler: Array<any>
  
  constructor(props, context) {
    super(props, context);
    this.topicHandler = [];
    this.topicHandler.push(topic.subscribe('financeapp/accountBookData', ()=>this.forceUpdate()));
  }
  
  selectHandler(event) {
    accountInfoStore.accountBook = event.target.value;
    accountInfoStore.requestStore();
  }
  
  componentWillUnmount() {
    this.topicHandler.forEach((topicItem)=>topicItem.remove());
  }
  
  render() {
      return (
        <ul className="financeapp-panel-ul">
            <li className="financeapp-panel-items-active">{ lang.AccountBook }</li>
            <select className="financeapp-panel-item-select" onChange={ this.selectHandler.bind(this) } value={ accountInfoStore.currentAccountBook }>
              {
                accountInfoStore.getStore().map((accountBook)=><option key={ accountBook } value={ accountBook }>{ accountBook }</option>)
              }
            </select>
        </ul>
      )
  }
}

export class Account extends React.Component<any, any> {
  private topicHandler: Array<any>
  
  constructor(props, context) {
    super(props, context);
    this.state = {accountDatas: []};
    this.topicHandler = [];
    this.topicHandler.push(topic.subscribe('financeapp/accountBookData', this.updateAccountData.bind(this)));
  }
  
  updateAccountData(data) {
    this.setState({accountDatas: data.accounts});
  }
  
  componentWillUnmount() {
    this.topicHandler.forEach((topicItem)=>topicItem.remove());
  }
  
  render() {
      return (
        <ul className="financeapp-panel-ul">
          <li className="financeapp-panel-items-active">{ lang.account }</li>
          {
            this.state.accountDatas.map((accountData)=><li onClick={ ()=>accountInfoStore.currentAccount = accountData.accountName } key={ accountData.accountName } className="financeapp-panel-items"><span>{ accountData.accountName }</span><span style={{ float: 'right', lineHeight: '1.5rem' }}>{ accountData.symbol }{ accountData.accountTotal }</span></li>)
          }
        </ul>
      )
  }
}