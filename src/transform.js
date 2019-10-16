const path = require('path')

const transformContent = require('./transform-content')
const generateIndexes = require('./generate-indexes')

const transform = (inputObjs, options) => {
  const contentObjs = inputObjs.map(inputObj => {
    if (path.extname(inputObj.relativePath) === '.md') {
      return transformContent(inputObj, options)
    } else {
      return inputObj
    }
  })

  const indexObjs = generateIndexes(contentObjs, options)

  return [...contentObjs, ...indexObjs]
}

module.exports = transform
