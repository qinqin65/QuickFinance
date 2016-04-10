import * as React from 'react';
import * as lang from 'dojo/i18n!app/nls/langResource.js';


export class Footer extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <p>{ lang.authorInfo }</p>
        <p>
            <a href="#">{ lang.backtoTop }</a>
        </p>
      </div>
    );
  }
}