/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import async from 'async';
import fs from 'fs';
import glob from 'glob';
import matter from 'gray-matter';

/*
 * Server-side Front Matter Helper
 *
 * Utility methods to parse and write content with YAML Front Matter blocks.
 * Extends the `gray-matter` gem by adding methods to asynchronously parse files
 * and customizes the resulting object. This code is intended to be used in a
 * server or desktop app.
 */
let FrontMatter = {
  // Parse the data string into an `attributes` property (contains the extracted
  // YAML) and `body` (contains the string contents below the yaml separators).
  // @param {String} str - The string to parse.
  parse(str) {
    let parsedData = matter(str);

    // Data massage: move YAML attributes to the root; ignore `original` property
    let result = parsedData.data || {};
    result.content = parsedData.content;

    return result;
  },
  parseFile(filepath, callback) {
    fs.readFile(filepath, 'utf-8', (err, data) => {
      if (err) throw err;

      let filename = filepath.split("/").slice(-1)[0];
      let extension = filename.split(".").slice(-1)[0];
      let parsedData = FrontMatter.parse(data);

      // Use the filename if an ID attribute was not specified.
      parsedData.id = parsedData.id || filename.replace(`.${extension}`, "");

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
  },
  // @param {Object} data - An object with the front matter to stringify
  // and a property `content` with the content string to append
  stringify(data) {
    let attributes = Object.assign({}, data);
    delete attributes.content;
    return matter.stringify(data.content, attributes);
  },
  writeFile(filepath, data, callback) {
    fs.writeFile(filepath, this.stringify(data), callback);
  }
};

export default FrontMatter;
