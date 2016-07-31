import * as React from 'react';
import * as lang from 'dojo/i18n!app/nls/langResource.js';
import * as topic from 'dojo/topic';
import Config from 'config';
import * as stateCode from 'stateCode';
import * as xhr from 'xhr';

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
  }
  
  requestAccountBookData(accountBook?: string) {
    let option: any = {
        handleAs: 'json',
        data: {
            accountBook
        }
    };
    xhr.post(`${Config.requestHost}/requestAccountBookData`, option)
    .then((data)=>{
        if(!data.state || data.state != stateCode.SUCCESS || !data.user) {
            topic.publish('tipService/warnning', data.info);
        } else {
            topic.publish('financeapp/accountBookData', data.info);
        }
    }, (error)=>{
        topic.publish('login/error', lang.xhrErr);
    })
  }
  
  render() {
      return (
        <ul className="financeapp-panel-ul">
            <li className="financeapp-panel-items-active">{ lang.AccountBook }</li>
            <select className="financeapp-panel-item-select">
              <option>Mustard</option>
              <option>Ketchup</option>
              <option>Relish</option>
            </select>
        </ul>
      )
  }
}

class Account extends React.Component<any, any> {
  
  constructor(props, context) {
    super(props, context);
  }
  
  render() {
      return (
        <ul className="financeapp-panel-ul">
            <li className="financeapp-panel-items-active">{ lang.account }</li>
            <li className="financeapp-panel-items">Reports</li>
            <li className="financeapp-panel-items">Analytics</li>
            <li className="financeapp-panel-items">Export</li>
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