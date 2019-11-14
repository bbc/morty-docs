const dateRegex = /\d{4}-\d{2}-\d{2}/ // i.e. 2019-10-29

function sortByDate (a, b) {
  return a.match(dateRegex) && b.match(dateRegex) ? b.localeCompare(a) : a.localeCompare(b)
}

function isFileInCurrentDir (filePath, directory) {
  return (filePath.replace(directory, '').match(/\//g) || []).length <= 1
}

function filterFilesInDir (filePaths, directory) {
  return filePaths.filter(filePath => {
    return directory // directory = '' is falsy
      ? filePath.startsWith(directory) && isFileInCurrentDir(filePath, directory)
      : !filePath.includes('/') // returns true for files in root directory
  })
}

module.exports = (filePaths, directory) => {
  return filterFilesInDir(filePaths, directory).sort(sortByDate)
}
