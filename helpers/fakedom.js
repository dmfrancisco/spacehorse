/*jshint esnext:true, browserify:true, unused:true */
'use strict';

// Import jsdom, a fake DOM implementation, and create fake global objects
import Jsdom from 'jsdom';

global.document = Jsdom.jsdom('<html><body></body></html>' || '');
global.window = document.defaultView;
global.navigator = { userAgent: 'nw' };
