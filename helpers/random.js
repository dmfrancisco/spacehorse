/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import Crypto from 'crypto';

/*
 * Random
 *
 * Useful for generating unique identifiers on the client or server.
 */
let Random = {
  // Generate a random hexadecimal string (from: http://goo.gl/2vuSvL)
  id: function(len = 12) {
    return Crypto.randomBytes(Math.ceil(len/2))
      .toString('hex') // Convert to hexadecimal format
      .slice(0, len);  // Return required number of characters
  }
};

export default Random;
