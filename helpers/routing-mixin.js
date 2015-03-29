/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import pathtoRegexp from 'path-to-regexp';

/*
 * Routing Mixin
 *
 * Simple mixin for client-side routing (partially based on: http://git.io/x8Uh)
 * Components that include this mixin should implement an `onRouteChange` method
 * that is called after the url changes and receives the current path as param.
 * The `registerRoutingListeners` method can be called on `componentDidMount`.
 * The `matchesRoute` method can be used to decide which component to render.
 */
let RoutingMixin = {
  // Replaces <a> link behavior with pushState and listens to changes in the url
  registerRoutingListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('click', this._onClick);
      window.addEventListener('popstate', this._onPopState);
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

export default RoutingMixin;
