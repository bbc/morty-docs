const fs = require('fs')
const path = require('path')
const renderSearchResultsPage = require('./page-renderers/SearchResults')

const generateSearchOutputs = (options, searchIndex) => {
  const searchIndexData = { index: {} }
  searchIndex.export((key, data) => {
    searchIndexData.index[key] = data
  })

  const searchResultPage = {
    relativePath: 'search-results.html',
    raw: Buffer.from(renderSearchResultsPage(options, 'search-results.html'))
  }

  const searchLibrary = fs.readFileSync(
    path.join(
      __dirname,
      '../node_modules/flexsearch/dist/flexsearch.bundle.min.js'
    )
  )
  const searchResultsJS = fs.readFileSync(
    path.join(__dirname, '../src/assets/search-results.js')
  )

  return [
    searchResultPage,
    {
      relativePath: 'search-index.json',
      raw: JSON.stringify(searchIndexData)
    },
    {
      relativePath: 'flexsearch.bundle.min.js',
      raw: searchLibrary
    },
    {
      relativePath: 'search-results.js',
      raw: searchResultsJS
    }
  ]
}

module.exports = generateSearchOutputs
