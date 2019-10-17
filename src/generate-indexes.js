const path = require('path')
const renderIndexPage = require('./page-renderers/IndexPage')
const getDirectories = require('./helpers/get-directory-paths')
const filterFilesInDirectory = require('./helpers/filter-files-in-dir')
const filterDirectoriesInDirectory = require('./helpers/filter-dirs-in-dir')

const generateIndex = (htmlFilePaths, subDirPaths, contentTitle) => {
  const subDirLinks = subDirPaths.map(dirPath => ({
    link: `${dirPath}/index.html`,
    text: dirPath,
    iconClass: 'fas fa-folder-open'
  }))

  const fileLinks = htmlFilePaths.map(filePath => {
    // TODO: is this what we want? We encodeURIComponent only the basename. And why is dirname on fileName, not on filePath? That should loose directories.
    // TODO: check whether we can just encodeURIComponent(filePath)? Or is there a problem with encoding forward slashes?
    const fileName = path.basename(filePath)
    const encodedFileName = encodeURIComponent(fileName)
    const encodedFilePath = `${path.dirname(fileName)}/${encodedFileName}`

    return {
      link: encodedFilePath,
      text: fileName,
      iconClass: 'fas fa-file-alt'
    }
  })

  return renderIndexPage([...subDirLinks, ...fileLinks], contentTitle)
}

const generateIndexes = (files, options) => {
  const htmlFilePaths = files
    .map(file => file.relativePath)
    .filter(relativePath => path.extname(relativePath) === '.html')

  const directories = getDirectories(htmlFilePaths)

  const indexes = directories.map(directory => {
    const filesInDir = filterFilesInDirectory(htmlFilePaths, directory)
    const subDirsInDir = filterDirectoriesInDirectory(directories, directory)
    const indexPath = directory ? `${directory}/index.html` : 'index.html'

    return {
      relativePath: indexPath,
      raw: Buffer.from(generateIndex(filesInDir, subDirsInDir, options.contentTitle))
    }
  })

  return indexes
}

module.exports = generateIndexes
