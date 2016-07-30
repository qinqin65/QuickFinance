import * as React from 'react';
import * as lang from 'dojo/i18n!app/nls/langResource.js';

export default class Finance extends React.Component<any, any> {
  
  constructor(props, context) {
    super(props, context);
  }
  
  render() {
      return (
        <div className="financeapp-panel-container">
          <ul className="financeapp-panel-ul">
            <li className="financeapp-panel-items-active">{ lang.account }</li>
            <li className="financeapp-panel-items">Reports</li>
            <li className="financeapp-panel-items">Analytics</li>
            <li className="financeapp-panel-items">Export</li>
          </ul>
        </div>
      );
  }
}