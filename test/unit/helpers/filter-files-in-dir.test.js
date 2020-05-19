const filterFilesInDirectory = require('../../../src/helpers/filter-files-in-dir')

describe('Filter files in directory', () => {
  it('returns files in the root directory', () => {
    const filePaths = [
      'File1.html',
      'File2.html',
      'SomeDir/File1.html',
      'SomeOtherDir/AnotherDir/File1.html'
    ]

    const currentDirectory = ''

    const expected = [
      'File1.html',
      'File2.html'
    ]

    const actual = filterFilesInDirectory(filePaths, currentDirectory)

    expect(actual).toEqual(expected)
  })

  it('returns files within a top level directory', () => {
    const filePaths = [
      'File1.html',
      'SomeDir/File1.html',
      'SomeDir/File2.html',
      'SomeOtherDir/AnotherDir/File1.html'
    ]

    const currentDirectory = 'SomeDir'

    const expected = [
      'SomeDir/File1.html',
      'SomeDir/File2.html'
    ]

    const actual = filterFilesInDirectory(filePaths, currentDirectory)

    expect(actual).toEqual(expected)
  })

  it('returns files within a nested directory', () => {
    const filePaths = [
      'File1.html',
      'SomeDir/File1.html',
      'SomeOtherDir/AnotherDir/File1.html',
      'SomeOtherDir/AnotherDir/File2.html'
    ]

    const currentDirectory = 'SomeOtherDir/AnotherDir'

    const expected = [
      'SomeOtherDir/AnotherDir/File1.html',
      'SomeOtherDir/AnotherDir/File2.html'
    ]

    const actual = filterFilesInDirectory(filePaths, currentDirectory)

    expect(actual).toEqual(expected)
  })

  it('returns files within a given directory, with dated files sorted reverse chronologically', () => {
    const filePaths = [
      'README.html',
      'SomeDir/2016-09-01-dated-file-1.html',
      'SomeDir/2016-9-02-dated-file-2.html',
      'SomeDir/2016-10-01-dated-file-3.html',
      'SomeDir/File1.html',
      'SomeOtherDir/AnotherDir/File1.html',
      'SomeDir/2017-09-01-dated-file-4.html'
    ]

    const currentDirectory = 'SomeDir'

    const expected = [
      'SomeDir/2017-09-01-dated-file-4.html',
      'SomeDir/2016-10-01-dated-file-3.html',
      'SomeDir/2016-9-02-dated-file-2.html',
      'SomeDir/2016-09-01-dated-file-1.html',
      'SomeDir/File1.html'
    ]

    const actual = filterFilesInDirectory(filePaths, currentDirectory)

    expect(actual).toEqual(expected)
  })
})
