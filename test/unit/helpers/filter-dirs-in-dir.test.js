const filterDirs = require('../../../src/helpers/filter-dirs-in-dir')

describe('Given a list of root folders', () => {
  test('output', () => {
    const directoryPaths = ['test2', 'test1', 'test4', 'test3']
    const directory = '' // root
    const expectedOutput = ['test1', 'test2', 'test3', 'test4']
    const output = filterDirs(directoryPaths, directory)
    expect(output).toEqual(expectedOutput)
  })
})

describe('Given a list of nested folders', () => {
  test('When ', () => {
    const directoryPaths = ['root/test2', 'root/test1', 'root/test4', 'root/test3']
    const directory = '' // root
    const expectedOutput = ['root/test1', 'root/test2', 'root/test3', 'root/test4']
    const output = filterDirs(directoryPaths, directory)
    expect(output).toEqual(expectedOutput)
  })
})

describe('Given a multiple nested folders', () => {
  test('It should only return the ones in the root2 directory', () => {
    const directoryPaths = ['root/test2', 'root/test1', 'root2/test4', 'root2/test3']
    const directory = 'root2'
    const expectedOutput = ['test3', 'test4']
    const output = filterDirs(directoryPaths, directory)
    expect(output).toEqual(expectedOutput)
  })
})

describe('Given a list of date folders', () => {
  test('It should return them in date order lexically', () => {
    const directoryPaths = ['2022-01-22-name', '2022-01-05-name', '2022-01-10-name']
    const directory = ''
    const expectedOutput = ['2022-01-22-name', '2022-01-10-name', '2022-01-05-name']
    const output = filterDirs(directoryPaths, directory)
    expect(output).toEqual(expectedOutput)
  })
})
