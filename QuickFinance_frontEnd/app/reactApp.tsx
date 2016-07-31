import * as React from 'react';
import * as topic from 'dojo/topic';
import {MainShow} from 'mainShow';
import Login from 'login';
import Finance from 'financeApp';
import * as lang from 'dojo/i18n!app/nls/langResource.js';

enum app{Login, mainPage};

const loginApp = (props?)=><div><MainShow /><Login /></div>

class TipService extends React.Component<any, any> {
  private tipTIme: number
  private isTipping: boolean
  private tipContent: string
  private topicHandler: Array<any>
  
  constructor(props, context) {
    super(props, context);
    this.tipTIme = 2000;
    this.isTipping = false;
    this.state = {showTip: false};
    this.topicHandler = [];
    
    this.topicHandler.push(topic.subscribe('tipService/warnning', this.showTip.bind(this)));
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
            <div ref="tipService" className="tipService">
              <strong>{ lang.warnnig }</strong> { this.tipContent }
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
    this.state = {renderApp: app.Login};
    this.topicHandler = [];
    
    this.topicHandler.push(topic.subscribe('user/login', (user)=>this.setState({renderApp: app.mainPage})));
    this.topicHandler.push(topic.subscribe('user/logout', (user)=>this.setState({renderApp: app.Login})));
  }
  
  componentWillUnmount() {
    this.topicHandler.forEach((topicItem)=>topicItem.remove());
  }

  render() {
    return (
      <div>
        {
          this.state.renderApp == app.Login ? loginApp() : <Finance />
        }
        <TipService />
      </div>
    );
  }
}