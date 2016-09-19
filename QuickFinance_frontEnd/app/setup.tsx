import * as React from 'react';
import {LeftPanel} from 'leftPanel';
import {BlockPanel} from 'blockPanel';
import * as lang from 'dojo/i18n!app/nls/langResource.js';
import * as topic from 'dojo/topic';

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

  constructor(props, context) {
    super(props, context);
  }

  render() {
      return (
        <BlockPanel title={ lang.accountManager }>
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