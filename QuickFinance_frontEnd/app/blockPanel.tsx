import * as React from 'react';

export class BlockPanel extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
  }
  
  render() {
      return (
        <div className="financeapp-blockPanel-container">
            <div className="financeapp-blockPanel-heading">
                <h3 className="financeapp-blockPanel-title">{ this.props.title }</h3>
            </div>
            <div className="financeapp-blockPanel-body">
                { this.props.children }
            </div>
        </div>
      )
  }
}