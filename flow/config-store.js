/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import {EventEmitter} from 'events';
import Persistence from './persistence';
import Dispatcher from './dispatcher';
import config from '../seeds/config'; // TODO

/*
 * Config Store
 */
let ConfigStore = Object.assign({}, EventEmitter.prototype, Persistence, {
  getAll() {
    return config;
  }
});

ConfigStore.dispatchToken = Dispatcher.register(function(payload) {
  // Object with all supported actions by this store
  let actions = {
  };
  // If this action type is one of the supported, invoke it
  if (actions[payload.action.type]) actions[payload.action.type](payload);
});

export default ConfigStore;
