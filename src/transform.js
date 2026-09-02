const path = require('path')
const { Index } = require('flexsearch')

const transformContent = require('./transform-content')
const generateIndexes = require('./generate-indexes')
const generateSearchOutputs = require('./generate-search-outputs')

const validate = (inputObjs) => {
  if (!Array.isArray(inputObjs)) throw new Error('First arg to transform() must be an array')

  inputObjs.forEach(inputObj => {
    if (typeof inputObj.raw === 'undefined') throw new Error('All objects in input array must have a .raw property')
    if (typeof inputObj.relativePath === 'undefined') throw new Error('All objects in input array must have a .relativePath property')
  })
}

const transform = (inputObjs, options) => {
  validate(inputObjs)

  const searchIndex = new Index('memory')

  const contentObjs = inputObjs.map((inputObj) => {
    const ext = path.extname(inputObj.relativePath)
    if (ext === '.md') { //  || ext === '.asciidoc' || ext === '.adoc' || ext === '.asc'
      const transformed = transformContent(inputObj, options)
      searchIndex.add(transformed.relativePath, inputObj.raw.toString('utf-8'))
      return transformed
    } else {
      return inputObj
    }
  })

  const searchObjs = generateSearchOutputs(options, searchIndex)

  const indexObjs = generateIndexes(contentObjs, options)

  return [
    ...contentObjs,
    ...indexObjs,
    ...searchObjs
  ]
}

module.exports = transform
