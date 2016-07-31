import * as React from 'react';
import * as lang from 'dojo/i18n!app/nls/langResource.js';
import * as topic from 'dojo/topic';
import * as cookie from 'dojo/cookie';
import {Validete, validateType} from 'validate';
import {user} from 'user';

enum select{login, register};
enum layerState{error, loading, showContent};

class LoginHeader extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
        <div className="login_header">
            <a className = { this.props.select == select.login ? 'switch_btn_focus' : 'switch_btn' } href="javascript:void(0);" onClick = { ()=>topic.publish('login/itemClicked', select.login) }>{ lang.login }</a>
            <a className = { this.props.select == select.register ? 'switch_btn_focus' : 'switch_btn' } href="javascript:void(0);" onClick = { ()=>topic.publish('login/itemClicked', select.register) }>{ lang.register }</a>
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
    this.validates.addValiItems('regInputPassword', validateType.passwordLength);
  }
  
  btLoginHandle() {
    if(this.validates.validate()) {
      user.login(this.refs.lgInputUserName.value, this.refs.lgInputPassword.value, this.refs.lgchkRememberme.checked);
      topic.publish('login/loginBtnClicked', null);
    }
  }

  render() {
    return (
      <div className="main_login">
        <label htmlFor="lgInputUserName" className="sr-only">{ lang.userName }</label>
        <input ref='lgInputUserName' type="text" id="lgInputUserName" className="form-control"  placeholder={ lang.userName } required />
        
        <label htmlFor="lgInputPassword" className="sr-only">{ lang.password }</label>
        <input ref='lgInputPassword' type="password" id="lgInputPassword" className="form-control" placeholder={ lang.password } required />
        
        <div className="checkbox">
            <label>
                <input ref="lgchkRememberme" type="checkbox" value="remember-me" />{ lang.rememberMe }
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
    this.validates.addValiItems('regInputEmail', validateType.email);
    
    this.validates.addValiItems('regInputPassword', validateType.needed);
    this.validates.addValiItems('regInputPasswordAgain', validateType.needed);
    this.validates.addValiItems('regInputPassword', validateType.passwordLength);
    this.validates.addValiItems(['regInputPassword', 'regInputPasswordAgain'], validateType.passwordEqual);
    
  }
  
  registerHandle() {
    if(this.validates.validate()) {
      user.register(this.refs.regInputUserName.value, this.refs.regInputEmail.value, this.refs.regInputPassword.value);
      topic.publish('login/registerBtnClicked', null);
    }
  }
  
  render() {
    return (
      <div className="main_login">
        <label htmlFor="regInputUserName" className="sr-only">{ lang.userName }</label>
        <input ref="regInputUserName" type="text" id="regInputUserName" className="form-control" placeholder={ lang.userName } required="" />
        
        <label htmlFor="regInputEmail" className="sr-only">{ lang.email }</label>
        <input ref="regInputEmail" type="email" id="regInputEmail" className="form-control" placeholder={ lang.email } required="" />
        
        <label htmlFor="regInputPassword" className="sr-only">{ lang.password }</label>
        <input ref="regInputPassword" type="password" id="regInputPassword" className="form-control" placeholder={ lang.password } required="" />
        
        <label htmlFor="regInputPasswordAgain" className="sr-only">{ lang.passwordAgain }</label>
        <input type="password" id="regInputPasswordAgain" className="form-control" placeholder={ lang.password } required="" />
        
        <button className="btn-lg" type="submit" onClick = { this.registerHandle.bind(this) }>{ lang.register }</button>
      </div>
    )
  }
}

class Error extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
  }
  
  render() {
    return (
      <div className="main_login">
        <span className="login_err">{ `${lang.tip}${this.props.errorMsg}` }</span>
        <span className="login_back" onClick={ ()=>topic.publish('login/backToContent', null)} >{ lang.backToLogin }</span>
      </div>
    );
  }
}

export default class Login extends React.Component<any, any> {
  loadingLayer: any;
  errorMsg: string;
  
  constructor(props, context) {
    super(props, context);
    
    this.tryRemembermeLogin();
    
    this.state = {select: select.login, layerState: layerState.showContent};
    this.errorMsg = '';
    
    this.loadingLayer = (
      <div className="main_login">
        <i className="loading fa fa-refresh fa-spin"></i>
      </div>
    );
    
    topic.subscribe('login/itemClicked', (selectItem)=>this.setState({select: selectItem}));
    topic.subscribe('login/loginBtnClicked', ()=>this.setState({layerState: layerState.loading}));
    topic.subscribe('login/registerBtnClicked', ()=>this.setState({layerState: layerState.loading}));
    topic.subscribe('login/error', (err)=>{this.errorMsg = err;this.setState({layerState: layerState.error});});
    topic.subscribe('login/backToContent', ()=>this.setState({layerState: layerState.showContent}));
  }
  
  tryRemembermeLogin() {
    let userName = cookie('userName');
    let userPw = cookie('userPw');
    if(userName && userPw) {
        user.login(userName, userPw);
    }
  }

  render() {
    return (
        <div className="login">
            <LoginHeader select = { this.state.select } />
            { 
               this.state.layerState == layerState.error ? <Error errorMsg={ this.errorMsg } /> :
               this.state.layerState == layerState.loading ? this.loadingLayer :
               this.state.select == select.login ? <MainLogin /> : <Register /> 
             }
        </div>
    )}
}