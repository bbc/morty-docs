const getDirectoryPaths = require('../../../src/helpers/get-directory-paths')

describe('Filter files in directory', () => {
  it('returns all stages of a directory path', () => {
    const filePaths = [
      'SomeFile.html',
      'SomeDir/SomeNestedDir/File1.html',
      'SomeDir/AnotherDir/AnotherNestedDir/File1.html'
    ]

    const expected = [
      '',
      'SomeDir',
      'SomeDir/SomeNestedDir',
      'SomeDir/AnotherDir',
      'SomeDir/AnotherDir/AnotherNestedDir'
    ]

    const actual = getDirectoryPaths(filePaths)

    expect(actual).toEqual(expected)
  })
})
