/*jshint browserify:true, devel:true, unused:true */
'use strict';

var gui = require('nw.gui');

/*
 * Open absolute links with the default browser
 */
window.addEventListener('click', function(e) {
  // Ensure link
  var el = e.target;
  while (el && 'A' !== el.nodeName) el = el.parentNode;
  if (!el || 'A' !== el.nodeName || el.target) return;

  // Return if mailto in the href
  if (el.href && el.href.indexOf('mailto:') > -1) return;

  // Return if `href` has same origin
  if (el.href.indexOf("//" + window.location.hostname) !== -1) return;

  // Open URL with default browser
  e.preventDefault();
  gui.Shell.openExternal(el.href);
});
