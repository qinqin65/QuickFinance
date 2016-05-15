import * as React from 'react';
import * as lang from 'dojo/i18n!app/nls/langResource.js';
import * as topic from 'dojo/topic';

enum select{login, register};

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
    )}
}

class MainLogin extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
        <div className="main_login">
            <label htmlFor="inputUserName" className="sr-only">{ lang.userName }</label>
            <input type="text" id="inputUserName" className="form-control" required="" autofocus="" />
            <label htmlFor="inputPassword" className="sr-only">{ lang.password }</label>
            <input type="password" id="inputPassword" className="form-control" placeholder="Password" required="" />
            <div className="checkbox">
                <label>
                    <input type="checkbox" value="remember-me" />{ lang.rememberMe }
                </label>
            </div>
            <button className="btn-lg" type="submit">{ lang.login }</button>
        </div>
    )}
}

export default class Login extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
    this.state = {select: select.login};
    topic.subscribe('login/itemClicked', (selectItem)=>this.setState({select: selectItem}));
  }

  render() {
    return (
        <div className="login">
            <LoginHeader select = { this.state.select } />
            { this.state.select == select.login ? <MainLogin /> : <div /> }
        </div>
    )}
}