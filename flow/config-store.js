/*jshint esnext:true, browserify:true, unused:true */
/*globals SpaceHorse*/
'use strict';

import {EventEmitter} from 'events';
import Persistence from './persistence';
import Dispatcher from './dispatcher';

let config = SpaceHorse.config;

/*
 * Config Store
 */
let ConfigStore = Object.assign({}, EventEmitter.prototype, Persistence, {
  // @return {Object} All the saved configurations
  getAll() {
    return config;
  },
  // @return {String} Path to document with the given id (eg: ./docs/0d372d5.md)
  getDocumentPath(id) {
    return `${ config.storageLocation }/${ id }.${ config.documentExtension }`;
  },
  // @return {String} Pattern that matches any stored doc (eg: ./docs/**/*.md)
  getDocumentPattern() {
    return `${ config.storageLocation }/**/*.${ config.documentExtension }`;
  },
  // @return {String} Path to data file, where relationships between models are stored
  getDataPath() {
    return `${ config.storageLocation }/data.json`;
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
