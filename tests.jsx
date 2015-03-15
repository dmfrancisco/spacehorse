/*jshint esnext:true, node:true */

// Import jsdom, a fake DOM implementation, and create fake global objects
import Jsdom from 'jsdom';
global.document = Jsdom.jsdom('<html><body></body></html>' || '');
global.window = document.defaultView;
global.navigator = { userAgent: 'node.js' };

// Import React and its testing add-ons
import React from 'react/addons';
var TestUtils = React.addons.TestUtils;

// Include polyfills and import the app's transpiled code
import 'babel/register';

import CardList from './components/card-list-component.jsx';
import Board from './components/board-component.jsx';
import Router from './components/router-component.jsx';

import assert from 'assert';


describe('CardList', function() {
  it("should render an empty list if there aren't any cards in the list", function() {
    var CardStore = { getAll() { return []; } };
    var instance = TestUtils.renderIntoDocument(<CardList currentList={{}} />);
    var list = TestUtils.findRenderedDOMComponentWithClass(instance, "CardList-cards");
    assert.equal(list.getDOMNode().textContent, "");
  });
});

describe('Board', function() {
  it("should render an empty board if there aren't any lists in the board", function() {
    var ListStore = { getAll() { return []; } };
    var instance = TestUtils.renderIntoDocument(<Board currentBoardKey="0" />);
    assert.equal(instance.getDOMNode().textContent, "");
  });
});

describe('Router', function() {
  it('should render "Page Not Found" if the URL prop is not passed', function() {
    var instance = TestUtils.renderIntoDocument(<Router />);
    var heading = TestUtils.findRenderedDOMComponentWithTag(instance, "h1");
    assert.equal(heading.getDOMNode().textContent, "Page not found");
  });
});
