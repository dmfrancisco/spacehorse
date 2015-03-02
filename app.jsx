/*jshint esnext:true, browser:true */
'use strict';

import React from 'react';
import pathtoRegexp from 'path-to-regexp';
import initialData from './seeds';

/*
 * Routing Mixin
 *
 * Simple mixin for client-side routing (partially based on: http://git.io/x8Uh)
 * Components that include this mixin should implement an `onRouteChange` method
 * that is called after the url changes and receives the current path as param.
 * The `registerRoutingListeners` method can be called on `componentDidMount`.
 * The `matchesRoute` method can be used to decide which component to render.
 */
export var RoutingMixin = {
  // Replaces <a> link behavior with pushState and listens to changes in the url
  registerRoutingListeners: function() {
    if (typeof window !== 'undefined') {
      window.addEventListener('click', this._onClick, false);
      window.addEventListener('popstate', this._onPopState, false);
    }
  },
  // Add a new route to this component, if it does not already exists
  // If `options.sensitive` is true, route will be case sensitive (default is true)
  // If `options.strict` is false, trailing slash is optional (default is false)
  initRoute: function(pattern, options = {}) {
    this.routes = this.routes || {};

    if (!this.routes[pattern]) {
      var keys = [];
      this.routes[pattern] = {
        regexp: pathtoRegexp(pattern, keys, options),
        keys: keys
      };
    }
  },
  // Checks if a given url matches an express-style path string
  // @param {Object} params — this is populated with data extracted from the url
  // @return {Boolean}
  matchesRoute: function(pattern, url, params) {
    this.initRoute(pattern);

    var keys = this.routes[pattern].keys;
    var regexp = this.routes[pattern].regexp;
    var m = regexp.exec(url);

    if (!m) return false;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];
      var val = m[i];
      if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
        params[key.name] = val;
      }
    }
    return true;
  },
  // When a link (that points to somewhere inside the app) is clicked, prevents
  // default behavior, updates the url with `pushState` and calls `onRouteChange`
  _onClick: function(e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.defaultPrevented) return;

    // Ensure link
    var el = e.target;
    while (el && 'A' !== el.nodeName) el = el.parentNode;
    if (!el || 'A' !== el.nodeName || el.target) return;

    // Ignore if tag has "download" or rel="external" attributes
    if (el.download || el.rel === 'external') return;

    // Check for mailto: in the href
    if (el.href && el.href.indexOf('mailto:') > -1) return;

    // Check if `href` has same origin
    if (el.href.indexOf(`//${window.location.hostname}`) == -1) return;

    e.preventDefault();
    window.history.pushState(null, null, el.pathname);
    this.onRouteChange(el.pathname);
  },
  // If the url has changed somehow, call `onRouteChange`
  _onPopState: function() {
    this.onRouteChange(window.location.pathname);
  }
};

/*
 * Card Component
 */
export var Card = React.createClass({
  style: function() {
    return {
      background: "white",
      boxSizing: "border-box",
      minHeight: 60,
      padding: 10,
      width: "100%"
    };
  },
  render: function() {
    return (
      <div className="Card" style={this.style()}>
        {this.props.children}
      </div>
    );
  }
});

/*
 * CardList Component
 *
 * A simple ordered list of card components
 */
export var CardList = React.createClass({
  propTypes: {
    cards: React.PropTypes.array,
    name: React.PropTypes.string
  },
  getDefaultProps: function() {
    return {
      cards: []
    };
  },
  headerStyle: function() {
    return {
      WebkitColumnBreakBefore: "always",
      fontWeight: "bold"
    };
  },
  listStyle: function() {
    return {
      listStyle: "none",
      padding: 0
    };
  },
  listItemStyle: function() {
    return {
      WebkitColumnBreakInside: "avoid",
      display: "block",
      marginBottom: 5
    };
  },
  render: function() {
    var cardNodes = this.props.cards.map((card) => {
      return (
        <li style={this.listItemStyle()} key={card.key}>
          <Card>
            {card.name}
          </Card>
        </li>
      );
    });
    return (
      <div className="CardList">
        <div style={this.headerStyle()}>
          {this.props.name}
        </div>
        <ol className="CardList-cards" style={this.listStyle()}>
          {cardNodes}
        </ol>
      </div>
    );
  }
});

/*
 * Board Component
 *
 * Currently, consists simply of a title and a list of lists of cards
 */
export var Board = React.createClass({
  propTypes: {
    lists: React.PropTypes.array,
    name: React.PropTypes.string,
    topbarHeight: React.PropTypes.string
  },
  getDefaultProps: function() {
    return {
      lists: [],
      topbarHeight: "50px"
    };
  },
  headerStyle: function() {
    return {
      background: "white",
      boxSizing: "border-box",
      fontWeight: "bold",
      height: this.props.topbarHeight,
      lineHeight: this.props.topbarHeight,
      paddingLeft: 20
    };
  },
  contentStyle: function() {
    return {
      WebkitColumnGap: 20,
      WebkitColumnWidth: 260,
      boxSizing: "border-box",
      height: `calc(100vh - ${ this.props.topbarHeight })`,
      padding: 20
    };
  },
  render: function() {
    var listNodes = this.props.lists.map(function(list) {
      return (
        <CardList {...list}/>
      );
    });
    return (
      <div className="Board">
        <div style={this.headerStyle()}>
          {this.props.name}
        </div>
        <div className="Board-cardLists" style={this.contentStyle()}>
          {listNodes}
        </div>
      </div>
    );
  }
});

/*
 * Router Component
 */
export var Router = React.createClass({
  mixins: [RoutingMixin],
  propTypes: {
    startUrl: React.PropTypes.string
  },
  getDefaultProps: function() {
    return {
      startUrl: "/"
    };
  },
  getInitialState: function() {
    return {
      data: initialData,
      url: this.props.startUrl
    };
  },
  componentDidMount: function() {
    this.registerRoutingListeners();
  },
  onRouteChange: function(path) {
    this.setState({
      data: this.state.data,
      url: path
    });
  },
  render: function() {
    var url = this.state.url, params = {};

    switch (true) {
      // Show a specific board
      case this.matchesRoute('/boards/:boardId', url, params):
        var board = this.state.data.find((el) => el.key == params.boardId);
        return <Board {...board}/>;
      default:
        return <h1>Page not found</h1>;
    }
  }
});

/*
 * Main component
 *
 * The <!doctype> tag must be added afterwards since it is not valid JSX
 */
export var SpaceHorse = React.createClass({
  style: function () {
    return {
      background: "gainsboro",
      fontFamily: "sans-serif",
      margin: 0
    };
  },
  render: function() {
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>SpaceHorse</title>
        </head>
        <body style={this.style()}>
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
if (typeof window !== 'undefined') {
  window.onload = function() {
    var currentPath = window.location.pathname;
    React.render(<SpaceHorse startUrl={currentPath} />, document);
  };
}
