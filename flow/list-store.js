/*jshint esnext:true, browserify:true, unused:true */
/*globals SpaceHorse*/
'use strict';

import {EventEmitter} from 'events';
import Persistence from './persistence';
import Dispatcher from './dispatcher';

let data = SpaceHorse.data;

/*
 * List Store
 */
let ListStore = Object.assign({}, EventEmitter.prototype, Persistence, {
  getAll(boardId) {
    return data.lists.filter((el) => el.boardId == boardId);
  }
});

ListStore.dispatchToken = Dispatcher.register(function(payload) {
  // Object with all supported actions by this store
  let actions = {
  };
  // If this action type is one of the supported, invoke it
  if (actions[payload.action.type]) actions[payload.action.type](payload);
});

export default ListStore;
