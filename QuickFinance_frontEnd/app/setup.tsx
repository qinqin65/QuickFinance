import * as React from 'react';
import {LeftPanel} from 'leftPanel';
import {BlockPanel} from 'blockPanel';
import * as lang from 'dojo/i18n!app/nls/langResource.js';
import * as topic from 'dojo/topic';
import {accountInfoStore} from 'store';
import {Validete, validateType} from 'validate';

enum setupItem{accountManager, security};

class AccountManager extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
  }

  render() {
      return (
        <ul className="financeapp-panel-ul">
            <li className="financeapp-panel-items-active">{ lang.applicationSetup }</li>
            <li className="financeapp-panel-items" onClick={ ()=>topic.publish('setup/itemSelected', setupItem.accountManager) }>{ lang.accountManager }</li>
        </ul>
      );
  }
}

class AccountManagerDetail extends React.Component<any, any> {
  private topicHandler: Array<any>
  private addAccountBookvalidates: Validete;
  private addAccountvalidates: Validete;

  constructor(props, context) {
    super(props, context);
    this.state = {currentAccountBook: '', currentAccount: ''};
    this.addAccountBookvalidates = new Validete();
    this.addAccountvalidates = new Validete();
  }

  componentDidMount() {
    this.addAccountBookvalidates.addValiItems('txtAddAccountBook', validateType.needed);
    this.addAccountvalidates.addValiItems('txtAddAccount', validateType.needed);
  }

  addAccountBook() {
    if(!this.addAccountBookvalidates.validate()) {
      return;
    }
  }

  addAccount() {
    if(!this.addAccountvalidates.validate()) {
      return;
    }
  }

  render() {
      return (
        <BlockPanel title={ lang.accountManager }>
          <div>
            <select className="select" onChange={ (event: any)=>this.setState({currentAccountBook: event.target.value}) } value={ this.state.currentAccountBook }>
              {
                accountInfoStore.getStore().map((accountBook)=><option key={ accountBook } value={ accountBook }>{ accountBook }</option>)
              }
            </select>
            <input className="inputBox" ref='addAccountBook' type="text" id='txtAddAccountBook' />
            <button className="bt-comfirm" style={{ marginRight: '1rem' }} onClick = { this.addAccountBook.bind(this) }>{ lang.add }</button>
          </div>

          <div>
            <select className="select" onChange={ (event: any)=>this.setState({currentAccount: event.target.value}) } value={ this.state.currentAccount }>
              {
                accountInfoStore.getAccountStore().slice(1).map((accountData)=><option key={ accountData.accountName } value={ accountData.accountName }>{ accountData.accountName }</option>)
              }
            </select>
            <input className="inputBox" ref='addAccountBook' type="text" id='txtAddAccount' />
            <button className="bt-comfirm" style={{ marginRight: '1rem' }} onClick = { this.addAccount.bind(this) }>{ lang.add }</button>
          </div>
        </BlockPanel>
      );
  }
}

class Security extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
  }

  render() {
      return (
          <ul className="financeapp-panel-ul">
            <li className="financeapp-panel-items-active">{ lang.security }</li>
            <li className="financeapp-panel-items" onClick={ ()=>topic.publish('setup/itemSelected', setupItem.security) }>{ lang.changePassword }</li>
        </ul>
      );
  }
}

class SecurityDetail extends React.Component<any, any> {
  private topicHandler: Array<any>

  constructor(props, context) {
    super(props, context);
  }

  render() {
      return (
        <BlockPanel title={ lang.changePassword }>
        </BlockPanel>
      );
  }
}

export default class Setup extends React.Component<any, any> {
  private topicHandler: Array<any>

  constructor(props, context) {
    super(props, context);
    this.state = {currentPage: setupItem.accountManager};
    this.topicHandler = [];
    this.topicHandler.push(topic.subscribe('setup/itemSelected', (selectItem)=>{
        if(selectItem === setupItem.accountManager) {
            this.setState({currentPage: setupItem.accountManager});
        } else if(selectItem === setupItem.security) {
            this.setState({currentPage: setupItem.security});
        }
    }));
  }

  componentWillUnmount() {
    this.topicHandler.forEach((topicItem)=>topicItem.remove());
  }

  render() {
      return (
        <div>
          <LeftPanel>
            <AccountManager />
            <Security />
          </LeftPanel>
          <div className='financeApp-MainContent-Container'>
            {
                this.state.currentPage === setupItem.accountManager ? <AccountManagerDetail /> :
                this.state.currentPage === setupItem.security ? <SecurityDetail /> : null
            }
          </div>
        </div>
      );
  }
}