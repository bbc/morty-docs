const filterDirs = (directoryPaths, directory) => {
  const directoryArray = []
  const nestedDirFolders = directoryPaths.filter(directoryPath => directoryPath.includes(directory) && !directoryPath.startsWith(directory) && directoryPath !== directory)
  if (nestedDirFolders.length) directoryArray.push(nestedDirFolders)
  // if directory path includes the config folder then return the full directory path

  const rootDirFolders = directoryPaths.filter(directoryPath => directoryPath.startsWith(directory) && directoryPath !== directory)
  const rootDir = rootDirFolders.map(directoryPath => directoryPath.startsWith(`${directory}/`) && directory !== ''
    ? directoryPath.replace(`${directory}/`, '') : directoryPath)
  if (rootDir.length) directoryArray.push(rootDir)
  // if directory path starts with the config folder then remove the directory from the path
  return directoryArray.flat()
}

module.exports = filterDirs
