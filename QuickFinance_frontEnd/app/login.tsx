import * as React from 'react';
import * as lang from 'dojo/i18n!app/nls/langResource.js';
import * as topic from 'dojo/topic';
import {Validete, validateType} from 'validate'

enum select{login, register};
enum layerState{wait, loading};

class LoginHeader extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
        <div className="login_header">
            <a className = { this.props.select == select.login ? 'switch_btn_focus' : 'switch_btn' } hidefocus="true" href="javascript:void(0);" onClick = { ()=>topic.publish('login/itemClicked', select.login) }>{ lang.login }</a>
            <a className = { this.props.select == select.register ? 'switch_btn_focus' : 'switch_btn' } hidefocus="true" href="javascript:void(0);" onClick = { ()=>topic.publish('login/itemClicked', select.register) }>{ lang.register }</a>
            <div className="switch_bottom" id="switch_bottom" style={{left: '0px', width: '50%', marginLeft: this.props.select == select.login ? '0' : '50%', position: 'absolute'}}></div>
        </div>
    )
  }
}

class MainLogin extends React.Component<any, any> {
  validates: Validete;
  
  constructor(props, context) {
    super(props, context);
    this.validates = new Validete();
  }
  
  componentDidMount() {
    this.validates.addValiItems('lgInputUserName', validateType.needed);
    this.validates.addValiItems('lgInputPassword', validateType.needed);
  }
  
  btLoginHandle() {
    if(this.validates.validate()) {
      topic.publish('login/loginBtnClicked', true);
    }
    
  }

  render() {
    return (
      <div className="main_login">
        <label htmlFor="lgInputUserName" className="sr-only">{ lang.userName }</label>
        <input type="text" id="lgInputUserName" className="form-control" required autofocus />
        <label htmlFor="lgInputPassword" className="sr-only">{ lang.password }</label>
        <input type="password" id="lgInputPassword" className="form-control" placeholder="Password" required />
        <div className="checkbox">
            <label>
                <input type="checkbox" value="remember-me" />{ lang.rememberMe }
            </label>
        </div>
        <button className="btn-lg" type="submit" onClick = { this.btLoginHandle.bind(this) }>{ lang.login }</button>
      </div>
    )
  }
}

class Register extends React.Component<any, any> {
  validates: Validete;
  
  constructor(props, context) {
    super(props, context);
    this.validates = new Validete();
  }
  
  componentDidMount() {
    this.validates.addValiItems('regInputUserName', validateType.needed);
    this.validates.addValiItems('regInputPassword', validateType.needed);
    this.validates.addValiItems('regInputPasswordAgain', validateType.needed);
  }
  
  registerHandle() {
    if(this.validates.validate()) {
      topic.publish('login/registerBtnClicked', true);
    }
    
  }
  
  render() {
    return (
      <div className="main_login">
        <label htmlFor="regInputUserName" className="sr-only">{ lang.userName }</label>
        <input type="text" id="regInputUserName" className="form-control" required="" autofocus="" />
        <label htmlFor="regInputPassword" className="sr-only">{ lang.password }</label>
        <input type="password" id="regInputPassword" className="form-control" placeholder="Password" required="" />
        <label htmlFor="regInputPasswordAgain" className="sr-only">{ lang.passwordAgain }</label>
        <input type="password" id="regInputPasswordAgain" className="form-control" placeholder="Password" required="" />
        <button className="btn-lg" type="submit" onClick = { this.registerHandle.bind(this) }>{ lang.register }</button>
      </div>
    )
  }
}

export default class Login extends React.Component<any, any> {
  loadingLayer: any;
  
  constructor(props, context) {
    super(props, context);
    this.state = {select: select.login, isLoading: false};
    
    this.loadingLayer = (
      <div className="main_login">
        <i className="loading fa fa-refresh fa-spin"></i>
      </div>
    );
    
    topic.subscribe('login/itemClicked', (selectItem)=>this.setState({select: selectItem}));
    topic.subscribe('login/loginBtnClicked', (isLoading)=>this.setState({isLoading}));
    topic.subscribe('login/registerBtnClicked', (isLoading)=>this.setState({isLoading}));
  }

  render() {
    return (
        <div className="login">
            <LoginHeader select = { this.state.select } />
            { 
               this.state.isLoading ? this.loadingLayer :
               this.state.select == select.login ? <MainLogin /> : <Register /> 
             }
        </div>
    )}
}