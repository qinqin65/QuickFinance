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
    accountInfoStore.currentAccountBook = event.target.value;
    accountInfoStore.requestStore();
  }

  componentWillUnmount() {
    this.topicHandler.forEach((topicItem)=>topicItem.remove());
  }

  render() {
      return (
        <ul className="financeapp-panel-ul">
            <li className="financeapp-panel-items-active">{ lang.AccountBook }</li>
            <select className="financeapp-panel-item-select select" onChange={ this.selectHandler.bind(this) } value={ accountInfoStore.currentAccountBook }>
              {
                accountInfoStore.getStore().map((accountBook)=><option key={ accountBook.name } value={ accountBook.name }>{ accountBook.name }</option>)
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
    this.state = {currentAccount: ''};
    this.topicHandler = [];
    this.topicHandler.push(topic.subscribe('financeapp/accountBookData', ()=>this.forceUpdate()));
  }

  componentWillUnmount() {
    this.topicHandler.forEach((topicItem)=>topicItem.remove());
  }

  render() {
      return (
        <ul className="financeapp-panel-ul">
          <li className="financeapp-panel-items-active">{ lang.account }</li>
          {
            accountInfoStore.getAccountStore().map(
              (accountData)=>
                <li onClick={ ()=>{
                      accountInfoStore.currentAccount = accountData.accountName;
                      this.setState({currentAccount: accountData.accountName});
                      topic.publish('finance/financeDataChanged', true);
                    }
                  }
                  key={ accountData.accountName }
                  className={ this.state.currentAccount == accountData.accountName ? "financeapp-panel-items financeapp-panel-items-selected" : "financeapp-panel-items" }>
                  <span>{ accountData.accountName }</span>
                  <span style={{ float: 'right', lineHeight: '1.5rem' }}>{ accountData.currency ? accountData.currency.symbol : '?' }{ accountData.accountTotal }</span>
                </li>
            )
          }
        </ul>
      )
  }
}