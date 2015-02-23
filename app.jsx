import React from 'react';

// Application component
var App = React.createClass({
  render: function() {
    return (
      <h1>Hello, World!</h1>
    )
  }
});

// Main React component
// The <!doctype> tag must be added afterwards since it is not valid JSX
var SpaceHorse = React.createClass({
  render: function() {
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>SpaceHorse</title>
        </head>
        <body>
          <App />
          <script src="app.js"></script>
        </body>
      </html>
    )
  }
});

// If we are on the client, render the App component
// React will preserve the server-rendered markup and only attach event handlers
if (typeof window !== 'undefined') {
  window.onload = function() {
    React.render(<SpaceHorse />, document);
  }
}

// Export the main React component
export default SpaceHorse;
