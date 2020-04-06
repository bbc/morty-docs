const path = require('path')

const transformContent = require('./transform-content')
const generateIndexes = require('./generate-indexes')

const validate = (inputObjs) => {
  if (!Array.isArray(inputObjs)) throw new Error('First arg to transform() must be an array')

  inputObjs.map(inputObj => {
    if (typeof inputObj.raw === 'undefined') throw new Error('All objects in input array must have a .raw property')
    if (typeof inputObj.relativePath === 'undefined') throw new Error('All objects in input array must have a .relativePath property')
  })
}

const transform = (inputObjs, options) => {
  validate(inputObjs)

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
