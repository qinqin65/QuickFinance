import * as React from 'react';
import * as topic from 'dojo/topic';
import {MainShow} from 'mainShow';
import Login from 'login';

enum app{Login, mainPage};

const loginApp = (props?)=><div><MainShow /><Login /></div>

export class App extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
    this.state = {renderApp: app.Login};
    topic.subscribe('user/login', (user)=>this.setState({renderApp: app.mainPage}));
    topic.subscribe('user/logout', (user)=>this.setState({renderApp: app.Login}));
  }

  render() {
    return (
      <div>
        {
          this.state.renderApp == app.Login ? loginApp() : <div></div>
          
        }
        
      </div>
    );
  }
}