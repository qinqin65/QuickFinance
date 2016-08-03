import * as React from 'react';

export class LeftPanel extends React.Component<any, any> {
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