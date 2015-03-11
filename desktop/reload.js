/*jshint browserify:true */
'use strict';

var fs = require('fs');

fs.watch("../", function() {
  // Clear and delete node-webkit's global required modules cache
  // More info: http://stackoverflow.com/q/25143532
  for (var moduleName in global.require.cache) {
    // Only reload our own code, not third-party modules
    if (moduleName.indexOf("node_modules") == -1) {
      delete global.require.cache[moduleName];
    }
  }
  // Refresh the page
  window.location.reload();
});
