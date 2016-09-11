import * as React from 'react';
import {LeftPanel} from 'leftPanel';
import {AccountBook, Account} from 'accountInfo';
import {BlockPanel} from 'blockPanel';
import {AccountTool, accountToolSelect, accountPanel, Accounting} from 'accountDetail';
import {FinancePreview, DatePick} from 'financePreview'
import * as lang from 'dojo/i18n!app/nls/langResource.js';
import * as topic from 'dojo/topic';

export default class Finance extends React.Component<any, any> {
  private topicHandler: Array<any>
  private accountToolData: any

  constructor(props, context) {
    super(props, context);
    this.state = {accountPanel: accountPanel.accountTool, accountToolPanelTitle: lang.accountToolTitle};
    this.accountToolData = {accountType: null};
    this.topicHandler = [];
    this.topicHandler.push(topic.subscribe('accountTool/itemClicked', (selectItem)=>{
      if(selectItem === accountToolSelect.income) {
        this.accountToolData.accountType = accountToolSelect.income;
        this.setState({
          accountPanel: accountPanel.accounting,
          accountToolPanelTitle: lang.income
        });
      } else if(selectItem === accountToolSelect.outcome) {
        this.accountToolData.accountType = accountToolSelect.outcome;
        this.setState({
          accountPanel: accountPanel.accounting,
          accountToolPanelTitle: lang.outcome
        });
      } else if(selectItem === accountToolSelect.handleButton) {
        this.setState({
          accountPanel: accountPanel.accountTool,
          accountToolPanelTitle: lang.accountToolTitle
        });
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
            <AccountBook />
            <Account />
          </LeftPanel>
          <div className='financeApp-MainContent-Container'>
            <BlockPanel title={ this.state.accountToolPanelTitle }>
              {
                this.state.accountPanel === accountPanel.accountTool ? <AccountTool /> :
                this.state.accountPanel === accountPanel.accounting ? <Accounting accountType={ this.accountToolData.accountType }/> : null
              }
            </BlockPanel>
            <BlockPanel title={ lang.financePreview }>
              <DatePick />
              <FinancePreview />
            </BlockPanel>
          </div>
        </div>
      );
  }
}