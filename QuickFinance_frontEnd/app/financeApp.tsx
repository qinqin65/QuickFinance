import * as React from 'react';
import * as lang from 'dojo/i18n!app/nls/langResource.js';
import * as topic from 'dojo/topic';
import Config from 'config';
import * as stateCode from 'stateCode';
import * as xhr from 'xhr';
import {user} from 'user';

class LeftPanel extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
  }
  
  render() {
      return (
        <div className="financeapp-panel-container">
          { this.props.children }
        </div>
      )
  }
}

class AccountBook extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
    this.state = {accountBooks: [], selectValue: ''};
    this.requestAccountBookData('');
  }
  
  requestAccountBookData(accountBook: string) {
    let option: any = {
        handleAs: 'json',
        data: {
            accountBook
        }
    };
    xhr.post(`${Config.requestHost}/requestAccountBookData`, option)
    .then((data)=>{
        if(data.state === stateCode.SUCCESS) {
          this.setState({accountBooks: data.accountBooks, selectValue: data.currentAccountBook});
          topic.publish('financeapp/accountBookData', data);
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
  
  selectHandler(event) {
    this.requestAccountBookData(event.target.value);
    //this.setState({selectValue: event.target.value});
  }
  
  render() {
      return (
        <ul className="financeapp-panel-ul">
            <li className="financeapp-panel-items-active">{ lang.AccountBook }</li>
            <select className="financeapp-panel-item-select" onChange={ this.selectHandler.bind(this) } value={ this.state.selectValue }>
              {
                this.state.accountBooks.map((accountBook)=><option key={ accountBook } value={ accountBook }>{ accountBook }</option>)
              }
            </select>
        </ul>
      )
  }
}

class Account extends React.Component<any, any> {
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
            this.state.accountDatas.map((accountData)=><li key={ accountData.accountName } className="financeapp-panel-items"><span>{ accountData.accountName }</span><span style={{ float: 'right', lineHeight: '1.5rem' }}>{ accountData.symbol }{ accountData.accountTotal }</span></li>)
          }
        </ul>
      )
  }
}

export default class Finance extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
  }
  
  render() {
      return (
        <div>
          <LeftPanel>
            <AccountBook />
            <Account />
          </LeftPanel>
        </div>
      );
  }
}