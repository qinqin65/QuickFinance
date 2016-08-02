import * as React from 'react';
import {LeftPanel} from 'leftPanel';
import {AccountBook, Account} from 'accountInfo'

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