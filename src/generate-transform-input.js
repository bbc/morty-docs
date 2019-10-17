const readdir = require('recursive-readdir')
const fs = require('fs')

const generateTransformInput = (dir) => {
  const matchFirstDir = /^[^\/]*\// // finds the first dir, i.e will match 'www/' from 'www/foo'

  return readdir(dir).then(files => {
    return files.map(file => {
      return {
        relativePath: file.toString().replace(matchFirstDir, ''),
        raw: fs.readFileSync(file)
      }
    })
  })
}

module.exports = generateTransformInput
