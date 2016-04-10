import * as React from 'react';
import {MainShow} from 'mainShow';

export class App extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <MainShow />
    );
  }
}