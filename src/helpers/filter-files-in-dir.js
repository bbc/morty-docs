const { sortArrayByDate } = require('./sort-array-by-date')

const directoryDepth = path => path.split('/').length
const isInRootDirectory = filePath => directoryDepth(filePath) === 1
const isIn = directory => filePath => filePath.startsWith(directory) && ((directoryDepth(filePath) - 1) === directoryDepth(directory))

module.exports = (filePaths, directory) => {
  const isInSpecifiedDirectory = directory ? isIn(directory) : isInRootDirectory
  return sortArrayByDate(filePaths.filter(isInSpecifiedDirectory))
}
