const readdir = require('recursive-readdir')
const fs = require('fs')
const path = require('path')

const generateTransformInput = (dir) => {
  const pathParts = path.parse(dir)

  return readdir(dir).then(files => {
    return files.map(file => {
      console.log(`pathParts.dir: ${JSON.stringify(pathParts.dir, null, 2)}`)
      return {
        relativePath: file.toString().replace(`${pathParts.dir}/`, ''),
        raw: fs.readFileSync(file)
      }
    })
  })
}

module.exports = generateTransformInput
