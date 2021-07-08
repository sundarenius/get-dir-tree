import walk from './walk.js';
import _ from 'lodash'

const dirTree = {}

const getFilesAndSubDirs = async () => {
  const directories = await walk()
  return directories
}

const createSubPaths = (dir) => {
  const dirSplit = dir.split('/')
  const file = dirSplit.pop()
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

const getDirTree = async (res) => {
  const dirs = await getFilesAndSubDirs()
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
      const file = dirSplit.splice(dirSplit.length - 1)
      if (typeof _.get(dirTree, `${dirSplit.join('.')}.${file}`) !== 'object') {
        console.log(file)
        _.set(dirTree, `${dirSplit.join('.')}`, {
          ..._.get(dirTree, `${dirSplit.join('.')}`),
          [file]: 'file'
        })
      }
    }
  })
  return JSON.parse(JSON.stringify(dirTree).replace(/"0":"f","1":"i","2":"l","3":"e"/g, '').replace(/{,/g, '{'))
}

const terminalArg = process.argv[2]
if (terminalArg === '--get') {
  getDirTree().then(res => {
    // Weird reason it adds following value sometimes, strip them away
    console.log(JSON.stringify(res, null, 2))
  })
}

export default getDirTree
