/*jshint node:true */
'use strict';

// Start by registering a hook that makes calls to `require` run ES6 code
// This will be the only file where JSX and ES6 features are not supported
require('babel/register');

var React = require('react');
var server = require('express')();

// Require and wrap the React main component in a factory before calling it
// This is necessary because we'll do `SpaceHorse()` instead of <SpaceHorse />
var SpaceHorse = React.createFactory(require('./app.jsx').SpaceHorse);

// Serve the JavaScript code to the client
server.get('/app.js', function(req, res) {
  res.sendFile(process.cwd() + "/app.js");
});

// Serve polyfills to the client
server.get('/polyfill.js', function(req, res) {
  res.sendFile(process.cwd() + "/node_modules/babel/browser-polyfill.js");
});

// Render the app and send the markup for faster page loads and SEO
// On the client, React will preserve the markup and only attach event handlers
server.get('/*', function(req, res) {
  var component = new SpaceHorse({ startUrl: req.originalUrl });
  var markup = React.renderToString(component);
  res.send('<!DOCTYPE html>' + markup);
});

// Listen for connections
server.listen(process.env.PORT || 8000, function() {
  console.log('Server is listening...');
});
