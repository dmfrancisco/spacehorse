/*jshint browserify:true, unused:true */
'use strict';

var fs = require('fs');
var manifest = require('./package');
var watchPath = "../";
var ignorePattern = /seeds/;

// If the app is running in development mode, reload the window on file changes
if (process.env.NODE_ENV === "development") {
  var watcher = fs.watch(watchPath, { recursive: true }, function(event, filepath) {
    // Return if the file's name or path matches the regex ignore pattern
    if (filepath.match(ignorePattern)) return;

    // Stop watching for changes
    watcher.close();

    // Clear and delete node-webkit's global required modules cache
    // More info: http://stackoverflow.com/q/25143532
    for (var moduleName in global.require.cache) {
      // Only reload our own code, not third-party modules
      if (moduleName.indexOf("node_modules") == -1) {
        delete global.require.cache[moduleName];
      }
    }

    // Save the current location in the localStorage. This may be
    // useful to redirect the developer to the same page she was
    window.localStorage.locationState = window.location.href;

    // Update the location to the app's main file. This is useful when
    // URLs don't map to entries in the filesystem (when using pushState)
    window.history.pushState(null, null, manifest.main);

    // Refresh the page
    window.location.reload();
  });
}
