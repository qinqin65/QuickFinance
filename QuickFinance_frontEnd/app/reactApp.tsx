import * as React from 'react';
import {MainShow} from 'mainShow';
import Login from 'login';

export class App extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <MainShow />
        <Login />
      </div>
    );
  }
}