/*jshint esnext:true, browserify:true, unused:true */
'use strict';

import async from 'async';
import fs from 'fs';
import glob from 'glob';
import fm from 'front-matter';

/*
 * Front Matter
 *
 * Utility methods to parse content with YAML Front Matter blocks.
 * Extends the `front-matter` gem by adding methods to parse files and
 * customizes the resulting object.
 */
let FrontMatter = {
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
      let parsedData = FrontMatter.parse(data);

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

export default FrontMatter;
