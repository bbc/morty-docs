const dateRegex = /\d{4}-\d{2}-\d{2}/

module.exports = (filePaths, directory) => filePaths.filter(filePath => {
  if (filePath.lastIndexOf('/') !== -1) {
    return directory === filePath.slice(0, filePath.lastIndexOf('/'))
  } else {
    return directory === ''
  }
}).sort((a, b) => a.match(dateRegex) && b.match(dateRegex) ? b.localeCompare(a) : a.localeCompare(b))
