/*jshint esnext:true, browser:true */
'use strict';

import React from 'react';
import initialData from './seeds';

// Card component
var Card = React.createClass({
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
      <div style={this.style()}>{this.props.children}</div>
    );
  }
});

// CardList component
var CardList = React.createClass({
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
      <div>
        <div style={this.headerStyle()}>
          {this.props.name}
        </div>
        <ol style={this.listStyle()}>
          {cardNodes}
        </ol>
      </div>
    );
  }
});

// Board component
var Board = React.createClass({
  getDefaultProps: function() {
    return {
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
      <div>
        <div style={this.headerStyle()}>
          {this.props.name}
        </div>
        <div style={this.contentStyle()}>
          {listNodes}
        </div>
      </div>
    );
  }
});

// Application component
var App = React.createClass({
  getInitialState: function() {
    return initialData["3551dbaf6a52a"];
  },
  render: function() {
    return (
      <Board {...this.state}/>
    );
  }
});

// Main component
// The <!doctype> tag must be added afterwards since it is not valid JSX
var SpaceHorse = React.createClass({
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
          <App />
          <script src="app.js"></script>
        </body>
      </html>
    );
  }
});

// If we are on the client, render the App component
// React will preserve the server-rendered markup and only attach event handlers
if (typeof window !== 'undefined') {
  window.onload = function() {
    React.render(<SpaceHorse />, document);
  };
}

// Export the main React component
export default SpaceHorse;
