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
})
