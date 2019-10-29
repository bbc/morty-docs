const dateRegex = /\d{4}-\d{2}-\d{2}/ //2019-10-29

module.exports = (filePaths, directory) => filePaths.filter(filePath => {
  return directory 
    ? filePath.startsWith(directory)
    : !filePath.includes('/')  // returns true for files in root directory
}).sort((a, b) => a.match(dateRegex) && b.match(dateRegex) ? b.localeCompare(a) : a.localeCompare(b))
