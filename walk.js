/**
    Walk directory,
    list tree without regex excludes
 */

import fs from 'fs';
import path from 'path';

const walk = function (dir, regExcludes, done) {
  let results = [];

  fs.readdir(dir, function (err, list) {
    if (err) return done(err);

    let pending = list.length;
    if (!pending) return done(null, results);

    list.forEach(function (file) {
      file = path.join(dir, file);

      let excluded = false;
      let len = regExcludes.length;
      let i = 0;

      for (; i < len; i++) {
        if (file.match(regExcludes[i])) {
          excluded = true;
        }
      }

      // Add if not in regExcludes
      if(excluded === false) {
        results.push(file);

        // Check if its a folder
        fs.stat(file, function (err, stat) {
          if (stat && stat.isDirectory()) {

            // If it is, walk again
            walk(file, regExcludes, function (err, res) {
              results = results.concat(res);

              if (!--pending) { done(null, results); }

            });
          } else {
            if (!--pending) { done(null, results); }
          }
        });
      } else {
        if (!--pending) { done(null, results); }
      }
    });
  });
};

const regExcludes = [
  /node_modules/,
  /.git/,
  /.DS_Store/,
  /dist/,
  /build/,
];

const startWalking = (log = false, ingoreFilesFolders = []) => {
  return new Promise((res, rej) => {
    walk(
      '.',
      [ ...regExcludes, ...ingoreFilesFolders ],
      function(err, results) {
        if (err) {
          rej(err);
          throw err;
        }
        res(results);
        if (log) {
          console.log(results)
        }
      });
  })
}

export default startWalking
