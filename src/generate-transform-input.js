// const { readdir } = require('node:fs/promises')
const fs = require('fs')
const path = require('path')

const generateTransformInput = (dir) => {
  dir = path.format(path.parse(dir))

  const list = []

  const files = fs.readdirSync(dir, { recursive: true, withFileTypes: true })
  // recursive option available from node 18+
  // when options.withFileTypes set to true, the returned array will contain <fs.Dirent> objects.
  for (const dirent of files) {
    // console.log(`dirent: ${JSON.stringify(dirent, null, 2)}`)

    // Node API for Dirent is unstable
    const dirPath = dirent.path || dirent.parentPath // path is DEPRECATED! But parentPath does not work in 18.17

    const fullPath = path.join(dirPath, dirent.name)
    // console.log('fullPath = ', fullPath)

    if (dirent.isDirectory()) {
      console.log('directory... continue')
      continue
    }
    if (dirent.isFile()) {
      list.push(makeInputObject(fullPath, dir))
      continue
    }
    if (dirent.isSymbolicLink) {
      if (fs.existsSync(fullPath)) { // fs.exists() is deprecated, but fs.existsSync() is not.
        console.log('Good symlink')
        list.push(makeInputObject(fullPath, dir)) // symlinks become copies
      } else {
        console.log(`Broken symlink at: ${fullPath}`)
      }
      continue
    }
  }
  return list
}

const makeInputObject = (fullPath, rootPath) => {
  return {
    relativePath: fullPath.replace(`${rootPath}/`, ''),
    raw: fs.readFileSync(fullPath)
  }
}

module.exports = generateTransformInput
