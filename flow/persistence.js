/*jshint esnext:true, browserify:true, unused:vars */
'use strict';

/*
 * Persistence
 *
 * Utility module to read and save data. This is currently a simple boilerplate.
 */
let Persistence = {
  sync(crudMethod, body) {
    // Example implementation of server-side persistence via Ajax
    //
    // let methodMap = {
    //   'create': 'POST',
    //   'read':   'GET',
    //   'update': 'PUT',
    //   'delete': 'DELETE'
    // };
    // let method = methodMap[crudMethod];
    // return window.fetch(this.url, { method, body });
    //
    return new Promise(function(resolve, reject) {
      reject({ msg: "Not implemented" });
    });
  }
};

export default Persistence;
