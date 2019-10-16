module.exports = (directoryPaths, directory) => directoryPaths
  // if the path includes the directory AND the path is NOT identical to the directory
  .filter(directoryPath => directoryPath.includes(directory) && directoryPath !== directory)
  // if the path includes the directory AND the directory is NOT 'root'
  .map(directoryPath => directoryPath.includes(`${directory}/`) && directory !== ''
    // replace the directory WITHIN the path with ''
    // /foo/bar/qux/
    // /bar/qux/
    // /foo
    ? directoryPath.replace(`${directory}/`, '')
    // or return the path...?
    : directoryPath)

// 'bar'
// 'bar/qux'

// 'foo'
//
