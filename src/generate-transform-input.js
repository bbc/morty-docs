const readdir = require('recursive-readdir')
const fs = require('fs')

const generateTransformInput = (dir) => {
  dir = dir.endsWith('/') ? dir : `${dir}/`

  return readdir(dir).then(files => {
    return files.map(file => {
      return {
        relativePath: file.toString(),
        raw: fs.readFileSync(file)
      }
    })
  })
}

module.exports = generateTransformInput
