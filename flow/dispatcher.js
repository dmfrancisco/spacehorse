/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import Flux from 'flux';

/*
 * Dispatcher
 *
 * A singleton that operates as the central hub for application updates.
 * Can receive actions from both views and server.
 */
let Dispatcher = Object.assign(new Flux.Dispatcher(), {
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

export default Dispatcher;
