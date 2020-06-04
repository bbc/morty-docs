const dateRegex = /\d{4}-\d{2}-\d{2}/ // i.e. 2019-10-29

function sortByDate (a, b) {
  return a.match(dateRegex) && b.match(dateRegex) ? b.localeCompare(a) : a.localeCompare(b)
}

const directoryDepth = path => path.split('/').length
const isInRootDirectory = filePath => directoryDepth(filePath) === 1
const isIn = directory => filePath => filePath.startsWith(directory) && ((directoryDepth(filePath) - 1) === directoryDepth(directory))

module.exports = (filePaths, directory) => {
  const isInSpecifiedDirectory = directory ? isIn(directory) : isInRootDirectory
  return filePaths.filter(isInSpecifiedDirectory).sort(sortByDate)
}
