// Import jsdom, a fake DOM implementation, and create fake global objects
import Jsdom from 'jsdom';
global.document = Jsdom.jsdom('<html><body></body></html>' || '');
global.window = document.defaultView;
global.navigator = { userAgent: 'node.js' };

// Import React and its testing add-ons
import React from 'react';
import ReactAddons from 'react/addons';
var TestUtils = React.addons.TestUtils;

// Include polyfills and import the app's transpiled code
import 'babel/register';
import * as App from './app.jsx';

import assert from 'assert';


describe('CardList', function() {
  it('should render an empty list if `cards` prop is not given', function() {
    var instance = TestUtils.renderIntoDocument(<App.CardList />);
    var list = TestUtils.findRenderedDOMComponentWithClass(instance, "CardList-cards");
    assert.equal(list.getDOMNode().textContent, "");
  });
});

describe('Board', function() {
  it('should render an empty board if `lists` prop is not given', function() {
    var instance = TestUtils.renderIntoDocument(<App.Board />);
    var list = TestUtils.findRenderedDOMComponentWithClass(instance, "Board-cardLists");
    assert.equal(list.getDOMNode().textContent, "");
  });
});

describe('Router', function() {
  it('should render "Page Not Found" if the URL prop is not passed', function() {
    var instance = TestUtils.renderIntoDocument(<App.Router />);
    var heading = TestUtils.findRenderedDOMComponentWithTag(instance, "h1");
    assert.equal(heading.getDOMNode().textContent, "Page not found");
  });
});
