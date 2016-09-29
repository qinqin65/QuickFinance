import * as React from 'react';
import {LeftPanel} from 'leftPanel';
import {BlockPanel} from 'blockPanel';
import * as lang from 'dojo/i18n!app/nls/langResource.js';
import * as topic from 'dojo/topic';
import {accountInfoStore, currencySelectStore, financePreviewStore} from 'store';
import {Validete, validateType} from 'validate';
import Config from 'config';
import * as xhr from 'xhr';
import * as stateCode from 'stateCode';
import {user} from 'user';

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
  private currentAccountBook: any;
  private currentAccount: any;

  constructor(props, context) {
    super(props, context);
    this.state = {currentAccount: '', selectCurrencyValue: '', currencySelect: currencySelectStore.getStore()};
    this.addAccountBookvalidates = new Validete();
    this.addAccountvalidates = new Validete();
    this.topicHandler = [];
    this.topicHandler.push(topic.subscribe('selectStore/currencySelectStore', ()=>this.setState({currencySelect: currencySelectStore.getStore()})));
    this.topicHandler.push(topic.subscribe('financeapp/accountBookData', ()=>this.forceUpdate()));
  }

  componentDidMount() {
    this.addAccountBookvalidates.addValiItems('addAccountBookName', validateType.needed);
    this.addAccountvalidates.addValiItems('txtAddAccountName', validateType.needed);
  }

  componentWillUnmount() {
    this.topicHandler.forEach((topicItem)=>topicItem.remove());
  }

  accountBookChanged(event) {
    if(event) {
      accountInfoStore.currentAccountBook = event.target.value;
    }
    accountInfoStore.requestStore();
    financePreviewStore.setParam('', '', '', null, '', '');
    financePreviewStore.clearStore();
  }

  addAccountBook() {
    if(!this.addAccountBookvalidates.validate()) {
      return;
    }

    let option: any = {
        url: `${Config.requestHost}/addAccountBook`,
        handleAs: 'json',
        content: {
            accountBook: this.refs.addAccountBookName.value,
            remark: this.refs.addAccountBookRemark.value
        }
    };
    xhr.get(option)
    .then((data)=>{
        if(data.state === stateCode.SUCCESS) {
            topic.publish('tipService/info', lang.saveSuccess);
            this.accountBookChanged();
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
    })
  }

  addAccount() {
    if(!this.addAccountvalidates.validate()) {
      return;
    }

    let option: any = {
        url: `${Config.requestHost}/addAccount`,
        handleAs: 'json',
        content: {
            accountBook: accountInfoStore.currentAccountBook,
            account: this.refs.addAccountName.value,
            currency: this.refs.accountingCurrency.value,
            webUrl: this.refs.addAccountWebUrl.value,
            remark: this.refs.addAccountRemark.value
        }
    };
    xhr.get(option)
    .then((data)=>{
        if(data.state === stateCode.SUCCESS) {
            topic.publish('tipService/info', lang.saveSuccess);
            this.accountBookChanged();
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
    })
  }

  render() {
      return (
        <BlockPanel title={ lang.accountManager }>
          <div>
            <div>
              <select className="select" onChange={ this.accountBookChanged.bind(this) } value={ accountInfoStore.currentAccountBook }>
                {
                  accountInfoStore.getStore().map((accountBook: any)=>{
                    if(accountBook.name == accountInfoStore.currentAccountBook) {
                      this.currentAccountBook = accountBook;
                    }
                    return <option key={ accountBook.name } value={ accountBook.name }>{ accountBook.name }</option>
                  })
                }
              </select>
              { this.currentAccountBook ? <span>{ `${lang.remark}: ${this.currentAccountBook.remark}` }</span> : null }
            </div>

            <div>
              <input placeholder={ lang.accountBookName } className="inputBox" ref='addAccountBookName' type="text" id='addAccountBookName' />
              <input placeholder={ lang.remark } className="inputBox" ref='addAccountBookRemark' type="text" id='txtAddAccountBookRemark' />
              <button className="bt-comfirm" style={{ marginRight: '1rem' }} onClick = { this.addAccountBook.bind(this) }>{ lang.add }</button>
            </div>
          </div>

          <div>
            <div>
              <select className="select" onChange={ (event: any)=>this.setState({currentAccount: event.target.value}) } value={ this.state.currentAccount }>
                {
                  accountInfoStore.getAccountStore().slice(1).map((accountData: any)=>{
                    if(this.state.currentAccount == accountData.accountName) {
                      this.currentAccount = accountData;
                    }
                    return <option key={ accountData.accountName }>{ accountData.accountName }</option>
                  })
                }
              </select>
              { this.currentAccount ? <span>{ `${lang.currency}: ${this.currentAccount.currency.name} ${lang.webUrl}: ${this.currentAccount.webUrl} ${lang.remark}: ${this.currentAccount.remark}` }</span> : null }
            </div>

            <div>
              <input placeholder={ lang.accountName } className="inputBox" ref='addAccountName' type="text" id='txtAddAccountName' />
              <select className="accounting-block-select" style={{ marginLeft: '2rem' }} ref="accountingCurrency" id="accountingCurrency" onChange={ (event: any)=>this.setState({selectCurrencyValue: event.target.value}) } value={ this.state.selectCurrencyValue }>
                {
                  this.state.currencySelect.map((accountingCurrency: any)=><option key={ accountingCurrency.code } value={ accountingCurrency.code }>{ accountingCurrency.name }</option>)
                }
              </select>
              <input placeholder={ lang.webUrl } className="inputBox" ref='addAccountWebUrl' type="url" id='txtAddAccountWebUrl' />
              <input placeholder={ lang.remark } className="inputBox" ref='addAccountRemark' type="text" id='txtAddAccountRemark' />
              <button className="bt-comfirm" style={{ marginRight: '1rem' }} onClick = { this.addAccount.bind(this) }>{ lang.add }</button>
            </div>
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