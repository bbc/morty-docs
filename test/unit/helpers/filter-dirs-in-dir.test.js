const filterDirectoriesInDirectory = require('../../../src/helpers/filter-dirs-in-dir')

describe('Filter directories in directory', () => {
  it('returns directories within a given directory', () => {
    const directoryPaths = [
      'dir1/subdir1',
      'dir1/subdir2',
      'dir2/subdir3'
    ]

    const currentDirectory = 'dir1'

    const expected = [
      'subdir1',
      'subdir2'
    ]

    const actual = filterDirectoriesInDirectory(directoryPaths, currentDirectory)

    expect(actual).toEqual(expected)
  })

  it('something to do with nested dirs', () => {
    const directoryPaths = [
      'docs/arch/',
      'services/service/docs/arch/'
    ]

    const currentDirectory = 'docs'

    const expected = [
      'services/service/docs/arch/',
      'arch/'
    ]

    const actual = filterDirectoriesInDirectory(directoryPaths, currentDirectory)

    expect(actual).toEqual(expected)
  })
})
