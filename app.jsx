/*jshint esnext:true, browserify:true, devel:true */
'use strict';

import React from 'react';
import Flux from 'flux';
import pathtoRegexp from 'path-to-regexp';
import crypto from 'crypto';
import { EventEmitter } from 'events';
import data from './seeds/data';
import Icon from './icons.jsx';

// Detect platforms (from TiddlyWiki's source)
let Platform = {};
Platform.node = typeof(process) === "object";
Platform.nw = Platform.node && global.window && global.window.nwDispatcher;
Platform.browser = !Platform.nw && typeof(window) !== "undefined";

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
      let keys = [];
      let regexp = pathtoRegexp(pattern, keys, options);
      this.routes[pattern] = { keys, regexp };
    }
  },
  // Checks if a given url matches an express-style path string
  // @param {Object} params — this is populated with data extracted from the url
  // @return {Boolean}
  matchesRoute(pattern, url, params) {
    this.initRoute(pattern);

    let keys = this.routes[pattern].keys;
    let regexp = this.routes[pattern].regexp;
    let m = regexp.exec(url);

    if (!m) return false;

    for (let i = 1, len = m.length; i < len; ++i) {
      let key = keys[i - 1];
      let val = m[i];
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
    let el = e.target;
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
  //      isOpen && styles.open
  //    )
  mergeStyles(...args) {
    return Object.assign({}, ...args);
  },
  /*
   * Convert a list of values in pixels to rems. For example:
   *    remCalc(16, 18, 32) # returns "1rem 1.125rem 2rem"
   * @param {Integer} remBase — The base body font size value in pixels
   * @param {Array} values — One or more values in pixels to be converted to rem
   * @return {String} Space delimited values that can be used in css styles
   */
  remCalc(...values) {
    let remBase = 16; // The base body font size value in pixels
    return values.map((value) => `${value/remBase}rem`).join(" ");
  }
};

/*
 * Interaction State Styling Mixin
 *
 * Simple mixin with utility methods for implementing CSS :active, :hover and
 * :focus pseudo-classes. Currently only supports :active.
 */
export var InteractionStylingMixin = {
  getInitialState() {
    return {
      _interactionStateActive: false
    };
  },
  // Sets up listeners for mouse down and up events. Usage example:
  //    <button {...this.trackInteractionStateActive()}
  //      style={this.mergeStyles(
  //        this.interactionStateIsActive() && styles.active
  //    )}> My Button </button>
  trackInteractionStateActive() {
    return {
      onMouseDown: this._onMouseDown,
      onMouseUp: this._onMouseUp,
      onMouseLeave: this._onMouseUp
    };
  },
  // Checks if the interaction state is currently active (the mouse is down).
  // @return {Boolean}
  interactionStateIsActive() {
    return this.state._interactionStateActive === true;
  },
  _onMouseDown(e) {
    this.setState({ _interactionStateActive: true });
  },
  _onMouseUp(e) {
    this.setState({ _interactionStateActive: false });
  }
};

/*
 * Random Mixin
 *
 * Useful for generating unique identifiers on the client or server.
 */
var RandomMixin = {
  // Generate a random hexadecimal string (from: http://goo.gl/2vuSvL)
  id: function(len = 12) {
    return crypto.randomBytes(Math.ceil(len/2))
      .toString('hex') // Convert to hexadecimal format
      .slice(0, len);  // Return required number of characters
  }
};

/*
 * Persistence
 *
 * Utility module to read and save data. This is currently a simple boilerplate.
 */
export var Persistence = {
  sync(crudMethod, body) {
    // Example implementation of server-side persistence via Ajax
    //
    // let methodMap = {
    //   'create': 'POST',
    //   'read':   'GET',
    //   'update': 'PUT',
    //   'delete': 'DELETE'
    // };
    // let method = methodMap[crudMethod];
    // return window.fetch(this.url, { method, body });
    //
    return new Promise(function(resolve, reject) {
      reject({ msg: "Not implemented" });
    });
  }
};

/*
 * Dispatcher
 *
 * A singleton that operates as the central hub for application updates.
 * Can receive actions from both views and server.
 */
export var Dispatcher = Object.assign(new Flux.Dispatcher(), {
  handleServerAction(action) {
    this.dispatch({
      source: 'server',
      action: action
    });
  },
  handleViewAction(action) {
    this.dispatch({
      source: 'view',
      action: action
    });
  }
});

/*
 * Board Store
 */
export var BoardStore = Object.assign({}, EventEmitter.prototype, Persistence, {
  getBoard(id) {
    return data.boards.find((el) => el.id == id);
  },
  getAll() {
    return data.boards;
  }
});

BoardStore.dispatchToken = Dispatcher.register(function(payload) {
  // Object with all supported actions by this store
  let actions = {
  };
  // If this action type is one of the supported, invoke it
  if (actions[payload.action.type]) actions[payload.action.type](payload);
});

/*
 * List Store
 */
export var ListStore = Object.assign({}, EventEmitter.prototype, Persistence, {
  getAll(boardId) {
    return data.lists.filter((el) => el.boardId == boardId);
  }
});

ListStore.dispatchToken = Dispatcher.register(function(payload) {
  // Object with all supported actions by this store
  let actions = {
  };
  // If this action type is one of the supported, invoke it
  if (actions[payload.action.type]) actions[payload.action.type](payload);
});

/*
 * Card Store
 */
export var CardStore = Object.assign({}, EventEmitter.prototype, Persistence, {
  getCard(id) {
    return data.cards.find((el) => el.id == id);
  },
  getAll(listId) {
    return data.cards.filter((el) => el.listId == listId);
  }
});

CardStore.dispatchToken = Dispatcher.register(function(payload) {
  // Object with all supported actions by this store
  let actions = {
    createCard(payload) {
      let card = payload.action.card;
      data.cards.push(card);

      CardStore.sync("create", card).then(function() {
        console.log("New card saved successfully");
      }).catch(function(e) {
        console.error(`Oops, there was an error saving card ${card.id}: ${e.msg}`);
      });

      CardStore.emit('change');
    }
  };
  // If this action type is one of the supported, invoke it
  if (actions[payload.action.type]) actions[payload.action.type](payload);
});

// This is a temporary method that loads the content of all existing cards
CardStore.fetchContents = function() {
  this.sync("read").then((response) => {
    response.forEach(function(data) {
      let card = CardStore.getCard(data.id);
      if (card) Object.assign(card, data);
    });

    this.emit('change');

    console.log("All cards read successfully");
  }).catch(function(e) {
    console.error(`Oops, there was an error reading cards: ${e.msg}`);
  });
};

/*
 * Card Actions
 */
var CardActions = {
  create: function({ listId, id, content }) {
    Dispatcher.handleViewAction({
      type: "createCard",
      card: {
        listId: listId,
        id: RandomMixin.id(),
        content: content
      }
    });
  }
};

/*
 * Icon Button Component
 */
export var IconButton = React.createClass({
  mixins: [StylingMixin, InteractionStylingMixin],
  propTypes: {
    icon: React.PropTypes.string,
    onClick: React.PropTypes.func,
    size: React.PropTypes.string
  },
  getDefaultProps() {
    return {
      icon: "menu",
      onClick() {}
    };
  },
  render() {
    // Mixin methods can't be used inside `getDefaultProps`
    let size = this.props.size || this.remCalc(24);

    let styles = {
      background: "none",
      border: "none",
      borderRadius: "50%",
      cursor: "pointer",
      lineHeight: 0,
      outline: "none",
      padding: this.remCalc(6),
      transition: "background 250ms"
    };
    let activeStyles = {
      background: "rgba(0,0,0,.1)",
      transition: "background 100ms"
    };
    return (
      <button
        {...this.trackInteractionStateActive()}
        style={this.mergeStyles(
          styles,
          this.interactionStateIsActive() && activeStyles
        )}
        onClick={this.props.onClick}>
        <Icon icon={this.props.icon} size={size}/>
      </button>
    );
  }
});

/*
 * Card Component
 */
export var Card = React.createClass({
  mixins: [StylingMixin],
  render() {
    let styles = {
      background: "white",
      boxSizing: "border-box",
      minHeight: this.remCalc(60),
      padding: this.remCalc(10),
      width: "100%"
    };
    return (
      <div className="Card" style={styles}>
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
  mixins: [StylingMixin],
  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired
  },
  getInitialState() {
    return this._getStateFromStore();
  },
  componentWillMount() {
    CardStore.addListener("change", this._onStoreChange);
  },
  componentWillUnmount() {
    CardStore.removeListener("change", this._onStoreChange);
  },
  handleSubmit(e) {
    e.preventDefault();

    let input = this.refs.cardContent.getDOMNode();
    let cardContent = input.value.trim();

    if (cardContent === "") return;
    input.value = '';

    CardActions.create({
      listId: this.props.id,
      content: cardContent
    });
  },
  render() {
    let styles = {
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
        marginBottom: this.remCalc(5)
      }
    };
    let cardNodes = this.state.cards.map((card, index) => {
      return (
        <li style={styles.listItem} key={index}>
          <Card>
            {card.content || "Loading..."}
          </Card>
        </li>
      );
    });
    return (
      <div className="CardList">
        <div style={styles.header}>
          {this.props.name}
        </div>
        <ol className="CardList-cards" style={styles.list}>
          {cardNodes}
        </ol>
        <form onSubmit={this.handleSubmit}>
          <input type="text" ref="cardContent" />
        </form>
      </div>
    );
  },
  _onStoreChange() {
    this.setState(this._getStateFromStore());
  },
  _getStateFromStore() {
    return {
      cards: CardStore.getAll(this.props.id)
    };
  }
});

/*
 * Board Component
 *
 * Currently, consists simply of a title and a list of lists of cards
 */
export var Board = React.createClass({
  mixins: [StylingMixin],
  propTypes: {
    id: React.PropTypes.string.isRequired
  },
  getInitialState() {
    return this._getStateFromStore();
  },
  componentWillMount() {
    ListStore.addListener("change", this._onStoreChange);
  },
  componentWillUnmount() {
    ListStore.removeListener("change", this._onStoreChange);
  },
  render() {
    let styles = {
      WebkitColumnGap: this.remCalc(20),
      WebkitColumnWidth: this.remCalc(260),
      boxSizing: "border-box",
      flex: 1,
      padding: this.remCalc(20)
    };
    let listNodes = this.state.lists.map(function(list, index) {
      return (
        <CardList key={index} id={list.id} name={list.name}/>
      );
    });
    return (
      <div className="Board" style={styles}>
        {listNodes}
      </div>
    );
  },
  _onStoreChange() {
    this.setState(this._getStateFromStore());
  },
  _getStateFromStore() {
    return {
      lists: ListStore.getAll(this.props.id)
    };
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
      open: false
    };
  },
  handleToggleClick() {
    let newState = this.state.open ? false : true;
    this.setState({ open: newState });
  },
  render() {
    let styles = {
      container: {
        display: "inline-block"
      },
      dropdown: {
        background: "white",
        display: "none",
        listStyle: "none",
        margin: 0,
        padding: this.remCalc(10),
        position: "absolute"
      },
      dropdownOpen: {
        display: "block"
      }
    };
    let boardNodes = this.props.boards.map(function(board, index) {
      let url = `/boards/${board.id}`;
      return (
        <li key={index}>
          <a href={url}>{board.name}</a>
        </li>
      );
    });
    return (
      <div className="BoardChooser" style={styles.container}>
        <IconButton icon="menu" onClick={this.handleToggleClick}/>
        <ol className="BoardChooser-dropdown"
          style={this.mergeStyles(
            styles.dropdown,
            this.state.open && styles.dropdownOpen
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
  mixins: [StylingMixin],
  propTypes: {
    boards: React.PropTypes.array,
    currentBoard: React.PropTypes.object.isRequired,
    height: React.PropTypes.string
  },
  getDefaultProps() {
    return {
      boards: []
    };
  },
  render() {
    // Mixin methods can't be used inside `getDefaultProps`
    let height = this.props.height || this.remCalc(54);

    let styles = {
      container: {
        alignItems: "center",
        background: "white",
        boxSizing: "border-box",
        display: "flex",
        height: height,
        padding: this.remCalc(20)
      },
      name: {
        display: "block",
        flex: 1,
        fontSize: this.remCalc(20),
        padding: this.remCalc(8)
      }
    };
    return (
      <div className="NavBar" style={styles.container}>
        <BoardChooser boards={this.props.boards}/>
        <span style={styles.name}>{this.props.currentBoard.name}</span>
      </div>
    );
  }
});

/*
 * Board Wrapper Component
 *
 * Contains the board and a top bar with some board related actions.
 * Acts as a Controller View from Flux by listening to changes in the store.
 */
export var BoardWrapper = React.createClass({
  propTypes: {
    currentBoardId: React.PropTypes.string.isRequired,
  },
  getInitialState() {
    return this._getStateFromStore();
  },
  componentWillMount() {
    BoardStore.addListener("change", this._onStoreChange);
  },
  componentWillUnmount() {
    BoardStore.removeListener("change", this._onStoreChange);
  },
  render() {
    let styles = {
      background: "gainsboro",
      display: "flex",
      flexDirection: "column",
      height: "100vh"
    };
    if (!this.state.currentBoard) {
      return <h2>Board not found</h2>;
    }
    return (
      <div style={styles}>
        <NavBar currentBoard={this.state.currentBoard} boards={this.state.boards}/>
        <Board id={this.state.currentBoard.id}/>
      </div>
    );
  },
  _onStoreChange() {
    this.setState(this._getStateFromStore());
  },
  _getStateFromStore() {
    return {
      currentBoard: BoardStore.getBoard(this.props.currentBoardId),
      boards: BoardStore.getAll()
    };
  }
});

/*
 * Router Component
 *
 * Decides which components should be rendered by listening to changes in the url
 */
export var Router = React.createClass({
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
      url: this.props.startUrl
    };
  },
  componentDidMount() {
    this.registerRoutingListeners();
  },
  onRouteChange(url) {
    this.setState({ url });
  },
  render() {
    let url = this.state.url, params = {};

    switch (true) {
      // Show a specific board
      case this.matchesRoute('/boards/:boardId', url, params):
        return (
          <BoardWrapper key={params.boardId} currentBoardId={params.boardId}/>
        );
      default:
        return <h1>Page not found</h1>;
    }
  }
});

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
export var SpaceHorse = React.createClass({
  render() {
    let styles = {
      fontFamily: "Lato, sans-serif",
      margin: 0
    };
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>SpaceHorse</title>
          <link rel="stylesheet"
            href="//fonts.googleapis.com/css?family=Lato:300,400,700,400italic,700italic"/>
        </head>
        <body style={styles}>
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
    React.render(<SpaceHorse startUrl={currentPath} />, document);
  };

  // For now, get all content for all existing cards
  CardStore.fetchContents();
}
