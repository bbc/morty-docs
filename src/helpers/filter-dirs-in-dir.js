// module.exports = (directoryPaths, directory) => directoryPaths
//   // if the path includes the directory AND the path is NOT identical to the directory
//   .filter(directoryPath => directoryPath.includes(directory) && directoryPath !== directory)
//   // if the path includes the directory AND the directory is NOT 'root'
//   .map(directoryPath => directoryPath.includes(`${directory}/`) && directory !== ''
//     // replace the directory WITHIN the path with ''
//     // /foo/bar/qux/
//     // /bar/qux/
//     // /foo
//     ? directoryPath.replace(`${directory}/`, '')
//     // or return the path...?
//     : directoryPath)

const filterDirs = (directoryPaths, directory) => {
  console.log('directory paths: ', directoryPaths)
  console.log('directory: ', directory)

  const directoryArray = []
  const test = directoryPaths.filter(directoryPath => directoryPath.includes(directory) && !directoryPath.startsWith(directory) && directoryPath !== directory)
  if (test.length) directoryArray.push(test)

  const start = directoryPaths.filter(directoryPath => directoryPath.startsWith(directory) && directoryPath !== directory)
  const rootDir = start.map(directoryPath => directoryPath.startsWith(`${directory}/`) && directory !== ''
    ? directoryPath.replace(`${directory}/`, '') : directoryPath)
  if (rootDir.length) directoryArray.push(rootDir)

  console.log(directoryArray.flat())
  return directoryArray.flat()
}

module.exports = filterDirs
