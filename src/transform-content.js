const path = require('path')
const asciidoctor = require('asciidoctor')()

const renderMortyPage = require('./page-renderers/MortyPage')
const parseToHtml = require('./markdown-to-html-parser')

const changeExtension = relPath => relPath.replace(/\.[^.]*$/, '.html') // \.[^.]*$  selects everything from end of string to first '.' character including the '.'

const convertToHtml = ({ relativePath, raw }, options) => {
  const textString = raw.toString()
  const ext = path.extname(relativePath)

  if (ext === '.asciidoc' || ext === '.adoc' || ext === '.asc') {
    return asciidoctor.convert(textString)
  }

  return parseToHtml(textString, options)
}

const transformContent = (inputObj, options) => {
  const inputRelPath = inputObj.relativePath
  const html = convertToHtml(inputObj, options)

  return {
    relativePath: changeExtension(inputRelPath),
    raw: renderMortyPage(inputRelPath, html)
  }
}

module.exports = transformContent
