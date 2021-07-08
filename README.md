# GET-DIR-TREE

Get directory files and subfolders tree in JSON of from any path from this was triggered.

Import as default and the response is a Promise with a complete directory tree as JSON data.

## Installation

```shell
npm i @hakansundstrom/get-dir-tree
```

```javascript
var getDirTree = require('get-dir-tree');

/*
 * @argument { boolean } Add true if you want robust data for each file. Otherwise each file just has a true value.
 */
getDirTree(true)
.then(res => {
  // log the response or whatever
})

/*
 * These folders/files are ignored
 * node_modules, .git, .DS_Store, dist, build
 * Add a second argument to getDirTree with regexps in an array to ignore more folders/files
 * eg: [ /myPrivateFolder/, /dontAddme.js/, /iLikePrivate/, /iMakeNoSense.js/ ]
 */
```

## How to use the CLI command
```
 1. sudo npm i -g @hakansundstrom/get-dir-tree (omit sudo and -g to only locally install)
 2. run 'log-dir-tree' from your terminal.
```

## Maintainers
This project was built and maintained by Håkan Sundström.
https://github.com/Sundarenius
