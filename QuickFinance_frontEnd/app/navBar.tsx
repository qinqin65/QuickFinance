import * as React from 'react';
import * as lang from 'dojo/i18n!app/nls/langResource.js';
import * as topic from 'dojo/topic';
import * as xhr from 'xhr';
import Config from 'config';
import * as stateCode from 'stateCode';
import {user} from 'user';

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

class User extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
  }
  
  quitHandler() {
    user.logout();
    return false;
  }
  
  render() {
    return (
      <li className = 'nav-item-user'>{ this.props.userName }
        <a href='#' onClick = {this.quitHandler}>,{ lang.quit }</a>
      </li>
    );
  }
}

export class Nav extends React.Component<any, any> {
  userName: string;
  
  constructor(props, context) {
    super(props, context);
    this.state = {select: select.home, isLogin: false};
    topic.subscribe('nav/itemClicked', (selectItem)=>this.setState({select: selectItem}));
    topic.subscribe('user/login', (user)=>{this.userName = user.userName;this.setState({isLogin: user.isLogin})});
    topic.subscribe('user/logout', (user)=>{this.userName = user.userName;this.setState({isLogin: user.isLogin})});
  }

  render() {
    return (
      <nav className = 'main-nav'>
        <ItemHome select = { this.state.select } />
        <ItemHelp select = { this.state.select } />
        {
          this.state.isLogin ? <User userName = { this.userName } /> : null
        }
      </nav>
    );
  }
}