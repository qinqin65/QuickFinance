import * as React from 'react';
import * as lang from 'dojo/i18n!app/nls/langResource.js';
import * as topic from 'dojo/topic';
import Config from 'config';
import * as stateCode from 'stateCode';
import * as xhr from 'xhr';
import {user} from 'user';

export class AccountTool extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
  }
  
  render() {
      return (
          <div className="toolBox-container">
            <div className="accountTool-container"><i className="fa fa-file-text-o" aria-hidden="true"></i><span className="accountTip">{ lang.income }</span></div>
            <div className="accountTool-container"><i className="fa fa-file-text" aria-hidden="true"></i><span className="accountTip">{ lang.outcome }</span></div>
          </div>
      )
  }
}