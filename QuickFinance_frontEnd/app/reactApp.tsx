import * as React from 'react';
import * as topic from 'dojo/topic';
import Login from 'login';
import Finance from 'financeApp';
import Setup from 'setup';
import {select} from 'navBar';
import * as lang from 'dojo/i18n!app/nls/langResource.js';

enum app{Login, mainPage, setup};
enum tipType{info, warning, error};

const loginApp = (props?)=><div><Login /></div>

class TipService extends React.Component<any, any> {
  private tipTIme: number
  private isTipping: boolean
  private tipType: tipType
  private tipContent: string
  private topicHandler: Array<any>
  
  constructor(props, context) {
    super(props, context);
    this.tipTIme = 2000;
    this.isTipping = false;
    this.tipType = tipType.warning;
    this.state = {showTip: false};
    this.topicHandler = [];
    
    this.topicHandler.push(topic.subscribe('tipService/info', (tip)=>{ this.tipType = tipType.info;this.showTip(tip); }));
    this.topicHandler.push(topic.subscribe('tipService/warning', (tip)=>{ this.tipType = tipType.warning;this.showTip(tip); }));
    this.topicHandler.push(topic.subscribe('tipService/error', (tip)=>{ this.tipType = tipType.error;this.showTip(tip); }));
  }
  
  showTip(tipContent: string) {
    if(this.isTipping) {
      return;
    }
    this.isTipping = true;
    this.tipContent = tipContent;
    this.setState({showTip: true})
  }
  
  hideTip() {
    this.isTipping = false;
    this.tipContent = '';
    this.setState({showTip: false})
  }

  componentDidUpdate() {
    if(!this.state.showTip || !this.isTipping) {
      return;
    }
    setTimeout(()=>{
      this.refs.tipService.style.opacity = 0;
      setTimeout(()=>{
        this.hideTip();
      }, this.tipTIme);
    }, this.tipTIme * 2);
  }
  
  componentWillUnmount() {
    this.topicHandler.forEach((topicItem)=>topicItem.remove());
  }

  render() {
    return (
      <div className={ this.state.showTip ? "tipServiceContainer" : "" }>
        {
          this.state.showTip ? (
            <div ref="tipService" className= 
              {
                this.tipType === tipType.info ?  "tipService-info" :
                this.tipType === tipType.warning ? "tipService-warning" : "tipService-error"
              }>
              <strong>
                { 
                  this.tipType === tipType.info ?  lang.tipInfo :
                  this.tipType === tipType.warning ? lang.tipWarning : lang.tipError 
                }</strong> { this.tipContent }
            </div>
          ) : null
        }
      </div>
    )
  }
}

export class App extends React.Component<any, any> {
  private topicHandler: Array<any>
  
  constructor(props, context) {
    super(props, context);
    this.state = {renderApp: this.props.isLoggedin ? app.mainPage : app.Login};
    this.topicHandler = [];
    
    this.topicHandler.push(topic.subscribe('user/login', (user)=>this.setState({renderApp: app.mainPage})));
    this.topicHandler.push(topic.subscribe('user/logout', (user)=>this.setState({renderApp: app.Login})));
    this.topicHandler.push(topic.subscribe('nav/itemClicked', (item)=>{
      if(item === select.setup) {
        this.setState({renderApp: app.setup});
      } else if(item === select.home) {
        this.setState({renderApp: app.mainPage});
      }
    }));
  }
  
  componentWillUnmount() {
    this.topicHandler.forEach((topicItem)=>topicItem.remove());
  }

  render() {
    return (
      <div>
        {
          this.state.renderApp == app.Login ? loginApp() : 
          this.state.renderApp == app.mainPage ? <Finance /> :
          this.state.renderApp == app.setup ? <Setup /> : null
        }
        <TipService />
      </div>
    );
  }
}