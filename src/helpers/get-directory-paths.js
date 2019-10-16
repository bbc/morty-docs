module.exports = filePaths => [...new Set(filePaths.map(path => {
  const lastSlashIndex = path.lastIndexOf('/')
  // if the filePath contains a '/', then return just the directory
  // otherwise, return '' (i.e. this is the root)
  return lastSlashIndex !== -1 ? path.slice(0, lastSlashIndex) : ''
}))]
