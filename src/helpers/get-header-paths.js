const getHeaderLinks = (basePath, relPath = '') => {
  const combinedParts = [...basePath.split('/'), ...relPath.split('/')]
  const paths = combinedParts.filter(part => part && (!part.endsWith('.html') && !part.endsWith('.md')))

  return paths.reduce((acc, item, index) => {
    const prevPart = acc[index - 1]
    const path = prevPart ? `${prevPart.path}/${item}` : `/${item}`

    acc.push({
      text: item,
      path
    })

    return acc
  }, [])
}

module.exports = getHeaderLinks
