/*jshint esnext:true, browserify:true, unused:true */
/*globals SpaceHorse*/
'use strict';

import React from 'react';
import Platform from './helpers/platform';
import CardStore from './flow/card-store';
import Router from './components/router-component.jsx';

/*
 * Main component
 *
 * The <!doctype> tag must be added afterwards since it is not valid JSX.
 *
 * For production apps, a better approach would be to remove this component, move the
 * JSX code to server.js and use a templating system or simply concatenate strings.
 * Also, <Router> should be rendered inside a root <div>. This is important because
 * 3rd-party libs and browser extensions frequently add elements to <body> & <head>.
 */
export var App = React.createClass({
  render() {
    let fonts = "Source+Sans+Pro:300,400,600,700,400italic,600italic,700italic|" +
      "Source+Code+Pro:400,600|Source+Serif+Pro:700,400";
    let globals = JSON.stringify(SpaceHorse);
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>SpaceHorse</title>
          <link rel="stylesheet" href="/assets/app.css"/>
          <link rel="stylesheet" href={`//fonts.googleapis.com/css?family=${fonts}`}/>
          <script dangerouslySetInnerHTML={{__html: `SpaceHorse = ${globals};` }} />
        </head>
        <body>
          <Router {...this.props}/>
          <script src="/polyfill.js"></script>
          <script src="/app.js"></script>
        </body>
      </html>
    );
  }
});

// If we are on the client, render the App component
// React will preserve the server-rendered markup and only attach event handlers
if (Platform.browser) {
  window.onload = function() {
    let currentPath = window.location.pathname;
    React.render(<App startUrl={currentPath} />, document);
  };

  // For now, get all content for all existing cards
  CardStore.fetchContents();
}
