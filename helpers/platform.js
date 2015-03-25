/*jshint esnext:true, browserify:true, unused:vars, -W018 */
'use strict';

// Detect platforms (from TiddlyWiki's source)
let Platform = {};
Platform.node = !!(typeof(process) === "object" && typeof(window) === "undefined");
Platform.nw   = !!(typeof(process) === "object" && global.window && global.window.nwDispatcher);
Platform.browser = !!(!Platform.nw && typeof(window) !== "undefined");

export default Platform;
