const path = require('path')
const renderIndexPage = require('./page-renderers/IndexPage')
const getDirectories = require('./helpers/get-directory-paths')
const filterFilesInDirectory = require('./helpers/filter-files-in-dir')
const filterDirectoriesInDirectory = require('./helpers/filter-dirs-in-dir')

const generateIndex = (directory, filePaths, subDirPaths, options) => {
  const subDirLinks = subDirPaths.filter(dirPath => !dirPath.includes('/')).map(dirPath => ({
    link: `${dirPath}/index.html`,
    text: dirPath,
    iconName: 'folder'
  }))

  const fileLinks = filePaths.map(filePath => {
    const text = path.basename(filePath)

    return {
      link: encodeURIComponent(text),
      text,
      iconName: 'file'
    }
  })

  return renderIndexPage([...subDirLinks, ...fileLinks], options, directory)
}

const generateIndexes = (files, options = { contentTitle: '' }) => {
  const supportedFilePaths = files
    .map(file => file.relativePath)
    .filter(relativePath => path.extname(relativePath) === '.html' || path.extname(relativePath) === '.pdf')

  const directories = getDirectories(supportedFilePaths)
  // If we have not got a 'root' folder, then add one.
  // TODO: Refactor this so it is not needed (maybe?)
  if (!directories.includes('')) {
    directories.push('')
  }

  const indexes = directories.flatMap(directory => {
    const filesInDir = filterFilesInDirectory(supportedFilePaths, directory)
    const subDirsInDir = filterDirectoriesInDirectory(directories, directory)
    const indexPath = directory ? `${directory}/index.html` : 'index.html'

    if (filesInDir.includes(path.join(directory, 'index.html'))) {
      return []
    }

    return {
      relativePath: indexPath,
      raw: Buffer.from(generateIndex(directory, filesInDir, subDirsInDir, options))
    }
  })

  return indexes
}

module.exports = generateIndexes
