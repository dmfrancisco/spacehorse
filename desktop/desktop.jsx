/*jshint esnext:true, browserify:true */
'use strict';

import async from 'async';
import glob from 'glob';
import fs from 'fs';
import fm from 'front-matter';
import React from 'react';
import {Router, CardStore} from '../app.jsx';

let startUrl = "/boards/3551dbaf6a52a/";
let cardFilenamePattern = "../seeds/**/*.md";

/*
 * Front Matter Mixin
 *
 * Utility methods to parse content with YAML Front Matter blocks.
 * Extends the `front-matter` gem by adding methods to parse files and
 * customizes the resulting object.
 */
let FrontMatterMixin = {
  // Parse the data string into an `attributes` property (contains the extracted
  // YAML) and `body` (contains the string contents below the yaml separators).
  parse(data) {
    let parsedData = fm(data);

    // Data massage: move YAML attributes to the root; rename `body` to `content`
    let result = parsedData.attributes || {};
    result.content = parsedData.body;

    return result;
  },
  parseFile(filepath, callback) {
    fs.readFile(filepath, 'utf-8', (err, data) => {
      if (err) throw err;

      let filename = filepath.split("/").slice(-1)[0];
      let parsedData = FrontMatterMixin.parse(data);

      // Use the filename if an ID attribute was not specified.
      parsedData.id = parsedData.id || filename.replace(".md", "");

      callback(err, parsedData);
    });
  },
  // Read and parse all files that match a given name pattern. Invoke the
  // callback after all files have been parsed with the aggregate result.
  parseAllFiles(pattern, callback) {
    glob(pattern, (err, filepaths) => {
      if (err) throw err;

      async.map(filepaths, this.parseFile, callback);
    });
  }
};

// Do persistence by reading and saving data to the filesystem
CardStore.sync = function(method, model) {
  let methods = {
    read(model, resolve, reject) {
      FrontMatterMixin.parseAllFiles(cardFilenamePattern, function(err, data) {
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
