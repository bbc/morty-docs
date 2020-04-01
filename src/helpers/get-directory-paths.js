const getDirectoryPaths = (filePaths) => {
  const dirPaths = filePaths.map(path => {
    // file = SomeOtherDir/AnotherDir/AnotherNestedDir/file.html
    if (!path.includes('/')) return '' // if file is not in the directory, return '', as this is the root

    const splitPaths = path.split('/') // => [ 'SomeOtherDir', 'AnotherDir', 'AnotherNestedDir', 'File1.html' ]
    splitPaths.pop() // remove file.html

    const allDirs = splitPaths.map((splitPath, index) => {
      const newPath = joinPathParts(splitPaths, index)
      return newPath
    })

    return allDirs
  })

  return [...new Set(dirPaths.flat())]
}

const joinPathParts = (pathsArray, end) => {
  if (end === 0) {
    return pathsArray[0]
  }
  end++
  return pathsArray.slice(0, end).join('/')
}

module.exports = getDirectoryPaths
