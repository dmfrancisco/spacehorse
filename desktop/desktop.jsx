/*jshint esnext:true, browserify:true, unused:vars */
'use strict';

import async from 'async';
import fs from 'fs';
import React from 'react';
import FrontMatter from './helpers/front-matter';
import CardStore from './flow/card-store';
import Router from './components/router-component.jsx';
import data from '../seeds/data';

let startUrl = "/boards/3551dbaf6a52a/";

const Config = {
  documents: {
    location: "./seeds",
    ext: "md",
    filenamePattern: "./seeds/**/*.md"
  },
  data: {
    location: "./seeds/data.json"
  }
};

// Do persistence by reading and saving data to the filesystem
CardStore.sync = function(method, model) {
  let methods = {
    read(resolve, reject) {
      FrontMatter.parseAllFiles(Config.documents.filenamePattern, function(err, data) {
        resolve(data);
      });
    },
    create(resolve, reject, model) {
      async.parallel([
        function() {
          let path = `${ Config.documents.location }/${ model.id }.${ Config.documents.ext }`;
          let newDocument = { id: model.id, content: model.content };
          FrontMatter.writeFile(path, newDocument);
        },
        function() {
          let copy = Object.assign({}, data);
          copy.cards = []; // We'll re-add with only the id and listId properties
          data.cards.forEach(({ id, listId }) => copy.cards.push({ id, listId }));
          let str = JSON.stringify(copy, null, '\t'); // \t for pretty-print
          fs.writeFile(Config.data.location, str);
        }
      ], resolve);
    },
    update(resolve, reject, model) {
      let path = `${ Config.documents.location }/${ model.id }.${ Config.documents.ext }`;
      let newDocument = { id: model.id, content: model.content };
      FrontMatter.writeFile(path, newDocument);
      resolve(model);
    },
    delete(resolve, reject, model) {
      reject({ msg: "Not implemented" }); // TODO
    }
  };

  if (methods[method]) {
    return new Promise((resolve, reject) => {
      methods[method](resolve, reject, model);
    });
  }
};

// Render the app
React.render(<Router startUrl={startUrl} />, document.body);

// For now, get all content for all existing cards
CardStore.fetchContents();
