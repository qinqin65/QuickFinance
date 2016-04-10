import * as React from 'react';
import * as lang from 'dojo/i18n!app/nls/langResource.js';
import * as topic from 'dojo/topic';


export enum select{home, help};

class ItemHome extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
  }
  
  render() {
    return (
      <li className = { this.props.select == select.home ? 'nav-item active' : 'nav-item' } onClick = { ()=>topic.publish('nav/itemClicked', select.home) }>{ lang.home }</li>
    );
  }
}

class ItemHelp extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
  }
  
  render() {
    return (
      <li className = { this.props.select == select.help ? 'nav-item active' : 'nav-item' } onClick = { ()=>topic.publish('nav/itemClicked', select.help) }>{ lang.help }</li>
    );
  }
}

export class Nav extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
    this.state = {select: select.home};
    topic.subscribe('nav/itemClicked', (selectItem)=>this.setState({select: selectItem}));
  }

  render() {
    return (
      <nav className = 'main-nav'>
        <ItemHome select = { this.state.select } />
        <ItemHelp select = { this.state.select } />
      </nav>
    );
  }
}