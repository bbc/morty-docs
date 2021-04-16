const readdir = require('recursive-readdir')
const fs = require('fs')
const path = require('path')

const generateTransformInput = (dir) => {
  dir = path.format(path.parse(dir))

  return readdir(dir).then(files => {
    return files.map(file => {
      console.log(file)
      return {
        absoluteDirectoryPath: path.dirname(file.toString()),
        relativePath: file.toString().replace(`${dir}/`, ''),
        raw: fs.readFileSync(file)
      }
    })
  })
}

module.exports = generateTransformInput
