/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import {EventEmitter} from 'events';
import Persistence from './persistence';
import Dispatcher from './dispatcher';
import data from '../seeds/data'; // TODO

/*
 * Board Store
 */
let BoardStore = Object.assign({}, EventEmitter.prototype, Persistence, {
  getBoard(id) {
    return data.boards.find((el) => el.id == id);
  },
  getAll() {
    return data.boards;
  }
});

BoardStore.dispatchToken = Dispatcher.register(function(payload) {
  // Object with all supported actions by this store
  let actions = {
  };
  // If this action type is one of the supported, invoke it
  if (actions[payload.action.type]) actions[payload.action.type](payload);
});

export default BoardStore;
