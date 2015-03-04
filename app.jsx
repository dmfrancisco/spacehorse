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
  registerRoutingListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('click', this._onClick, false);
      window.addEventListener('popstate', this._onPopState, false);
    }
  },
  // Add a new route to this component, if it does not already exists
  // If `options.sensitive` is true, route will be case sensitive (default is true)
  // If `options.strict` is false, trailing slash is optional (default is false)
  initRoute(pattern, options = {}) {
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
  matchesRoute(pattern, url, params) {
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
  _onClick(e) {
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
  _onPopState() {
    this.onRouteChange(window.location.pathname);
  }
};

/*
 * Styling Mixin
 *
 * Simple mixin with utility methods for styling components.
 */
export var StylingMixin = {
  // This is the `m` method from "CSS in JS" (goo.gl/ZRKFcR). It simply merges an
  // arbitrary number of given objects. Useful for conditionals. Usage example:
  //    this.mergeStyles(
  //      styles.example,
  //      isActive && styles.active
  //    )
  mergeStyles(...args) {
    return Object.assign({}, ...args);
  }
};

/*
 * Card Component
 */
export var Card = React.createClass({
  style: {
    background: "white",
    boxSizing: "border-box",
    minHeight: 60,
    padding: 10,
    width: "100%"
  },
  render() {
    return (
      <div className="Card" style={this.style}>
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
  getDefaultProps() {
    return {
      cards: []
    };
  },
  styles: {
    header: {
      WebkitColumnBreakBefore: "always",
      fontWeight: "bold"
    },
    list: {
      listStyle: "none",
      padding: 0
    },
    listItem: {
      WebkitColumnBreakInside: "avoid",
      display: "block",
      marginBottom: 5
    }
  },
  render() {
    var cardNodes = this.props.cards.map((card, index) => {
      return (
        <li style={this.styles.listItem} key={index}>
          <Card>
            {card.name}
          </Card>
        </li>
      );
    });
    return (
      <div className="CardList">
        <div style={this.styles.header}>
          {this.props.name}
        </div>
        <ol className="CardList-cards" style={this.styles.list}>
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
    lists: React.PropTypes.array
  },
  getDefaultProps() {
    return {
      lists: []
    };
  },
  styles: {
    WebkitColumnGap: 20,
    WebkitColumnWidth: 260,
    boxSizing: "border-box",
    flex: 1,
    padding: 20
  },
  render() {
    var listNodes = this.props.lists.map(function(list) {
      return (
        <CardList {...list}/>
      );
    });
    return (
      <div className="Board" style={this.styles}>
        {listNodes}
      </div>
    );
  }
});

/*
 * Board Chooser Component
 */
export var BoardChooser = React.createClass({
  mixins: [StylingMixin],
  propTypes: {
    boards: React.PropTypes.array
  },
  getDefaultProps() {
    return {
      boards: []
    };
  },
  getInitialState() {
    return {
      active: false
    };
  },
  styles: {
    container: {
      display: "inline-block"
    },
    dropdown: {
      background: "white",
      display: "none",
      listStyle: "none",
      margin: 0,
      padding: 10,
      position: "absolute"
    },
    dropdownActive: {
      display: "block"
    }
  },
  handleToggleClick() {
    var newState = this.state.active ? false : true;
    this.setState({ active: newState });
  },
  render() {
    var boardNodes = this.props.boards.map(function(board, index) {
      var url = `/boards/${board.key}`;
      return (
        <li key={index}>
          <a href={url}>{board.name}</a>
        </li>
      );
    });
    return (
      <div className="BoardChooser" style={this.styles.container}>
        <button
          className="BoardChooser-toggle"
          onClick={this.handleToggleClick}>
          Choose Board
        </button>
        <ol className="BoardChooser-dropdown"
          style={this.mergeStyles(
            this.styles.dropdown,
            this.state.active && this.styles.dropdownActive
          )}>
          {boardNodes}
        </ol>
      </div>
    );
  }
});

/*
 * NavBar Component
 *
 * Displays the board name and allows switching between boards
 */
export var NavBar = React.createClass({
  propTypes: {
    boards: React.PropTypes.array,
    currentBoard: React.PropTypes.object.isRequired,
    height: React.PropTypes.string
  },
  getDefaultProps() {
    return {
      boards: [],
      height: "50px"
    };
  },
  styles: {
    container: {
      background: "white",
      boxSizing: "border-box",
      paddingLeft: 20
    },
    name: {
      fontWeight: "bold"
    }
  },
  componentWillMount() {
    this.styles.container.height = this.props.height;
    this.styles.name.lineHeight = this.props.height;
  },
  render() {
    return (
      <div className="NavBar" style={this.styles.container}>
        <span style={this.styles.name}>{this.props.currentBoard.name}</span>
        <BoardChooser boards={this.props.boards}/>
      </div>
    );
  }
});

/*
 * App Component
 *
 * Decides which components should be rendered by listening to changes in the url
 */
export var App = React.createClass({
  mixins: [RoutingMixin],
  propTypes: {
    startUrl: React.PropTypes.string
  },
  getDefaultProps() {
    return {
      startUrl: "/"
    };
  },
  getInitialState() {
    return {
      data: initialData,
      url: this.props.startUrl
    };
  },
  styles: {
    display: "flex",
    flexDirection: "column",
    height: "100vh"
  },
  componentDidMount() {
    this.registerRoutingListeners();
  },
  onRouteChange(path) {
    this.setState({
      data: this.state.data,
      url: path
    });
  },
  render() {
    var url = this.state.url, params = {};

    switch (true) {
      // Show a specific board
      case this.matchesRoute('/boards/:boardId', url, params):
        var board = this.state.data.find((el) => el.key == params.boardId);
        return (
          <div style={this.styles}>
            <NavBar boards={this.state.data} currentBoard={board}/>
            <Board {...board}/>
          </div>
        );
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
  style: {
      background: "gainsboro",
      fontFamily: "sans-serif",
      margin: 0
  },
  render() {
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>SpaceHorse</title>
        </head>
        <body style={this.style}>
          <App {...this.props}/>
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
