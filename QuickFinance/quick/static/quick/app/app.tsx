import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Nav} from 'navBar';
import {App} from 'reactApp';
import {Footer} from 'footer';
import * as test from 'test/test';

export let renderApp = function () {
  ReactDOM.render(<Nav />, document.getElementById('mastheader'));
  ReactDOM.render(<App />, document.getElementById('content'));
  ReactDOM.render(<Footer />, document.getElementById('pageFooter'));
};

export let runTest = function() {
  test.runTest();
}