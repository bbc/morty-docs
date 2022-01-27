const filterFiles = require('../../../src/helpers/filter-files-in-dir')

describe('Given a list of root file names', () => {
  test('output', () => {
    const directoryPaths = ['test2', 'test1', 'test4', 'test3']
    const directory = '' // root
    const expectedOutput = ['test1', 'test2', 'test3', 'test4']
    const output = filterFiles(directoryPaths, directory)
    expect(output).toEqual(expectedOutput)
  })
})

describe('Given a list of date file names', () => {
  test('It should return them in date order lexically', () => {
    const directoryPaths = ['2022-01-22-name', '2022-01-05-name', '2022-01-10-name']
    const directory = ''
    const expectedOutput = ['2022-01-22-name', '2022-01-10-name', '2022-01-05-name']
    const output = filterFiles(directoryPaths, directory)
    expect(output).toEqual(expectedOutput)
  })
})
