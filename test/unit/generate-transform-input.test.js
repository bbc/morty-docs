const fs = require('fs')
const generateTransformInput = require('../../src/generate-transform-input')

// beforeAll(() => {
//   jest.spyOn(console, 'log').mockImplementation(() => {})
// })
// describe('Test outputs for different returns from readdirSync', () => {
//   it('it returns an empty array because folder `empty` does not exist', () => {
//     // pre-setup an empty folder
//     if (!fs.existsSync('test/files/empty')) fs.mkdirSync('test/files/empty')
//
//     const actual = generateTransformInput('test/files/empty')
//     expect(actual).toEqual([])
//   })
//
//   it('it returns all files in 1 directory', () => {
//     const actual = generateTransformInput('test/files/test1')
//     expect(actual).toEqual([{ raw: expect.any(Object), relativePath: 'test1.txt' }])
//   })
//
//   it('it returns all files in multiple directories', () => {
//     const actual = generateTransformInput('test/files/test2')
//     expect(actual).toEqual([
//       { raw: expect.any(Object), relativePath: 'dir1/test1.txt' },
//       { raw: expect.any(Object), relativePath: 'dir2/test1.txt' }
//     ])
//   })
//
//   it('it returns all files with sub directories', () => {
//     const actual = generateTransformInput('test/files/test3')
//     expect(actual).toEqual([
//       { raw: expect.any(Object), relativePath: 'dir1/test1.txt' },
//       { raw: expect.any(Object), relativePath: 'dir1/sub1/test1.txt' },
//       { raw: expect.any(Object), relativePath: 'dir1/sub1/sub2/test1.txt' }
//     ])
//   })
//
//   it('should fail when directory doesnt exist', () => {
//     expect.assertions(1)
//     try {
//       generateTransformInput('test/files/doesntexist')
//     } catch (e) {
//       expect(e.message).toEqual("ENOENT: no such file or directory, scandir 'test/files/doesntexist'")
//     }
//   })
// })
//
// describe('Symbolic links', () => {
//   it('has a good symlink to a directory, so include all files in the list', () => {
//     const actual = generateTransformInput('test/files/test4/dir1')
//     expect(actual).toEqual([
//       { raw: expect.any(Object), relativePath: 'symlink.txt' },
//       { raw: expect.any(Object), relativePath: 'test1.txt' }
//     ])
//     // cd test/files/test4/dir1
//     // ln -s ../good-symlink symlink     - copy contents of symlink folder and put in dir1
//   })
//
//   it('has a good symlink to a file, so include it in the file list', () => {
//     const actual = generateTransformInput('test/files/test5')
//     expect(actual).toEqual([
//       { raw: expect.any(Object), relativePath: 'symlink.txt' }
//     ])
//   })
//
//   it('has a bad symlink, ignore these files in the output', () => {
//     const actual = generateTransformInput('test/files/test6')
//     expect(actual).toEqual([])
//   })
// })
//
// describe('Snapshot Test', () => {
//   it('should match test1 snapshot', () => {
//     const actual = generateTransformInput('test/files/test1')
//     expect(actual).toMatchSnapshot()
//   })
// })
describe('Snapshot Test', () => {
  const cases = [
    ['test1', 1],
    ['test2', 2],
    ['test3', 3],
    ['test4', 3],
    ['test5', 1],
    ['test6', 0]
  ]

  test.each(cases)('Files in folder `%s`, should match snapshot with `%s` files', async (folderName, totalFiles) => {
    const actual = generateTransformInput(`test/files/${folderName}`)
    expect(actual).toMatchSnapshot()
    expect(actual.length).toEqual(totalFiles)
  })
})
