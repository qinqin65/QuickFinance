import * as React from 'react';
import {LeftPanel} from 'leftPanel';
import {AccountBook, Account} from 'accountInfo';
import {BlockPanel} from 'blockPanel';
import {AccountTool} from 'accountDetail';
import * as lang from 'dojo/i18n!app/nls/langResource.js';

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
          <div className='financeApp-MainContent-Container'>
            <BlockPanel title={ lang.accountToolTitle }>
              <AccountTool />
            </BlockPanel>
          </div>
        </div>
      );
  }
}