const path = require('path')
const asciidoctor = require('asciidoctor')()

const renderMortyPage = require('./page-renderers/MortyPage')
const parseToHtml = require('./markdown-to-html-parser')

const changeExtension = relPath => relPath.replace(/\.[^.]*$/, '.html') // \.[^.]*$  selects everything from end of string to first '.' character including the '.'

const transformContent = (inputObj, options) => {
  const inputRelPath = inputObj.relativePath
  const parser = path.extname(inputRelPath) === '.asciidoc' ? asciidoctor.convert.bind(asciidoctor) : parseToHtml

  return {
    relativePath: changeExtension(inputRelPath),
    raw: renderMortyPage(
      inputRelPath,

      parser(inputObj.raw.toString()),
      options)
  }
}

module.exports = transformContent
