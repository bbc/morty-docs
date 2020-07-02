const getHeaderLinks = (relPath, pathParts) => {
  let directories

  if (relPath) {
    const paths = []

    let pathComponent

    pathParts.map(pathPart => {
      pathComponent ? pathComponent = pathComponent + '/' + pathPart : pathComponent = pathPart
      paths.push(pathComponent)
    })

    directories = paths.filter(path => !path.includes('.md')) // filter out .html files
  }

  return directories
}

module.exports = getHeaderLinks
