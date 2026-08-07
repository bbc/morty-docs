const resultsContainer = document.getElementById('search-results-list')
const searchTerm = new URLSearchParams(window.location.search).get('term')

document.querySelector('h1').textContent = `Search Results for "${searchTerm}"`
document.getElementById('search-term').value = searchTerm

const fetchSearchIndex = async () => {
  const indexResponse = await fetch(
    `/${window.__MORTY_OPTIONS.basePath}/search-index.json`
  )

  if (!indexResponse.ok) {
    throw new Error('Failed to fetch search index')
  }

  const indexData = await indexResponse.json()
  const index = new window.FlexSearch.Index('memory')

  Object.entries(indexData.index).forEach(([key, value]) => {
    index.import(key, value)
  })

  return index
}

try {
  const index = await fetchSearchIndex()
  const results = index.search(searchTerm, { limit: 21 })

  if (results.length === 0) {
    const noResults = document.createElement('li')
    noResults.textContent = `No results found for "${searchTerm}".`
    resultsContainer.appendChild(noResults)
  }

  results.forEach(async (result, index) => {
    if (index === 20) {
      const moreResults = document.createElement('li')
      moreResults.textContent = `More than 20 results found for "${searchTerm}". Please refine your search.`
      resultsContainer.appendChild(moreResults)
    } else {
      const entry = document.createElement('li')
      const link = document.createElement('a')
      link.href = `/${window.__MORTY_OPTIONS.basePath}/${result}`
      link.textContent = result

      const preview = document.createElement('div')
      preview.classList.add('preview')

      const previewIFrame = document.createElement('iframe')
      previewIFrame.tabIndex = -1
      previewIFrame.src = `${link.href}?preview`
      preview.appendChild(previewIFrame)

      entry.appendChild(link)
      entry.appendChild(preview)

      resultsContainer.appendChild(entry)
    }
  })
} catch (error) {
  console.error('Error fetching or processing search index:', error)
  const errorMessage = document.createElement('li')
  errorMessage.textContent = 'An error occurred while fetching search results.'
  resultsContainer.appendChild(errorMessage)
}
