/*jshint esnext:true, browserify:true, unused:vars */
'use strict';

import async from 'async';
import fs from 'fs';
import React from 'react';
import FrontMatter from './helpers/front-matter';
import ConfigStore from './flow/config-store';
import CardStore from './flow/card-store';
import Router from './components/router-component.jsx';

let data = SpaceHorse.data;
let startUrl = "/boards/3551dbaf6a52a/";

// Do persistence by reading and saving data to the filesystem
CardStore.sync = function(method, model) {
  let methods = {
    read(resolve, reject) {
      let pattern = ConfigStore.getDocumentPattern();
      FrontMatter.parseAllFiles(pattern, function(err, data) {
        resolve(data);
      });
    },
    create(resolve, reject, model) {
      async.parallel([
        function() {
          let path = ConfigStore.getDocumentPath(model.id);
          let newDocument = { id: model.id, content: model.content };
          FrontMatter.writeFile(path, newDocument);
        },
        function() {
          let copy = Object.assign({}, data);
          copy.cards = []; // We'll re-add with only the id and listId properties
          data.cards.forEach(({ id, listId }) => copy.cards.push({ id, listId }));

          let path = ConfigStore.getDataPath();
          let str = JSON.stringify(copy, null, '\t'); // \t for pretty-print
          fs.writeFile(path, str);
        }
      ], resolve);
    },
    update(resolve, reject, model) {
      let path = ConfigStore.getDocumentPath(model.id);
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
