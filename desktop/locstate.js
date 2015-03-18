/*jshint browserify:true, devel:true, unused:true */
'use strict';

var gui = require('nw.gui');
var win = gui.Window.get();

/*
 * Location State
 *
 * Preserves the last location the user has navigated to before closing the app.
 * Uses the localStorage for persistence. Assumes the app's URLs may not map to
 * filesystem paths.
 */
var LocationState = {
  load: function() {
    var locationState = window.localStorage.locationState;

    if (locationState && window.location.href !== locationState) {
      // Changing `window.location` won't work since our URLs don't map to entries
      // in the filesystem (because we are using a client-side router with pushState).
      // Instead we use pushState and trigger a popState event.
      window.history.pushState(null, null, locationState); // Set the new location
      window.history.pushState(null, null, locationState); // Set for popping
      window.history.back();
    }
  },
  save: function() {
    window.localStorage.locationState = window.location.href;
  }
};

LocationState.load();

win.on('close', function () {
  try {
    LocationState.save();
  } catch(err) {
    console.log("locationStateError: " + err);
  }
  this.close(true);
});
