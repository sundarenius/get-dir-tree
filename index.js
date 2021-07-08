import walk from './walk.js';
import _ from 'lodash'

const dirTree = {}

const getFilesAndSubDirs = async (ingoreFilesFolders) => {
  const directories = await walk(ingoreFilesFolders)
  return directories
}

const createSubPaths = (dir) => {
  const dirSplit = dir.split('/')
  dirSplit.forEach((val, i) => {
    const dirSplitClone = [ ...dirSplit ]
    const spliceIndex = (i + 1)
    dirSplitClone.splice(spliceIndex)
    const path = dirSplitClone.join('.')
    const getPath = _.get(dirTree, dirTree[path])
    if (typeof getPath !== 'object') {
      _.set(dirTree, path, {})
    }
  })
}

const getDirTree = async (includeFileData, ingoreFilesFolders) => {
  const dirs = await getFilesAndSubDirs(ingoreFilesFolders)
  dirs.forEach(dir => {
    if (dir.includes('/')) {
      createSubPaths(dir)
    } else {
      dirTree[dir] = 'file'
    }
  })
  // Second loop to wait for first one to finish creating all sub-paths
  dirs.forEach(dir => {
    if (dir.includes('/')) {
      const dirSplit = dir.split('/')
      const file = dirSplit.splice(dirSplit.length - 1)[0]
      if (typeof _.get(dirTree, `${dirSplit.join('.')}.${file}`) !== 'object') {
        _.set(dirTree, `${dirSplit.join('.')}`, {
          ..._.get(dirTree, `${dirSplit.join('.')}`),
          [file]: includeFileData ? {
            fileType: file.split('.').splice(1).join('.') || 'file',
            relativePath: `${dirSplit.join('/')}/${file}`
          } : true
        })
      }
    }
  })
  return dirTree
}

const terminalArg = process.argv[2]
if (terminalArg === '--get') {
  getDirTree(true).then(res => {
    console.log(JSON.stringify(res, null, 2))
  })
}

export default getDirTree
