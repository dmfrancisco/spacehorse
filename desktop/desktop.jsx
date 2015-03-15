/*jshint esnext:true, browserify:true, unused:vars */
'use strict';

import React from 'react';
import FrontMatter from './helpers/front-matter';
import CardStore from './flow/card-store';
import Router from './components/router-component.jsx';

let startUrl = "/boards/3551dbaf6a52a/";
let cardFilenamePattern = "./seeds/**/*.md";

// Do persistence by reading and saving data to the filesystem
CardStore.sync = function(method, model) {
  let methods = {
    read(model, resolve, reject) {
      FrontMatter.parseAllFiles(cardFilenamePattern, function(err, data) {
        resolve(data);
      });
    },
    create(model, resolve, reject) {
      reject({ msg: "Not implemented" }); // TODO
    },
    update(model, resolve, reject) {
      reject({ msg: "Not implemented" }); // TODO
    },
    delete(model, resolve, reject) {
      reject({ msg: "Not implemented" }); // TODO
    }
  };

  if (methods[method]) {
    return new Promise((resolve, reject) => {
      methods[method](model, resolve, reject);
    });
  }
};

// Render the app
React.render(<Router startUrl={startUrl} />, document.body);

// For now, get all content for all existing cards
CardStore.fetchContents();
