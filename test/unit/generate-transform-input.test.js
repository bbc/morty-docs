const generateTransformInput = require('../../src/generate-transform-input')

const fs = require('fs')
const { Dirent, constants } = require('fs') // used for mocking return values of readdirSync

const readdirSyncMock = jest.spyOn(fs, 'readdirSync')
const readFileSyncMock = jest.spyOn(fs, 'readFileSync')
const existsSyncMock = jest.spyOn(fs, 'existsSync') // only used for checking symlinks

describe('Test outputs for different returns from readdirSync', () => {
  describe('When readdirSync returns just an empty directory', () => {
    it('it returns an empty array because it drops all directories', async () => {
      const directory = new Dirent('directory', constants.UV_DIRENT_DIR)
      directory.parentPath = '/anything'
      readdirSyncMock.mockReturnValue([directory])

      const actual = await generateTransformInput('/any')
      expect(actual).toEqual([])
    })
  })

  describe('When readdirSync returns just a single file', () => {
    it('it returns expected object for this file', async () => {
      const file = new Dirent('file.md', constants.UV_DIRENT_FILE)
      file.parentPath = '/path'
      readdirSyncMock.mockReturnValue([file])
      readFileSyncMock.mockReturnValue('file-contents')

      const actual = await generateTransformInput('/any')
      const expected = [{
        relativePath: '/path/file.md',
        raw: 'file-contents'
      }]
      expect(actual).toEqual(expected)
    })
  })

  describe('When readdirSync returns a file and a good symlink', () => {
    it('it returns expected objects for both', async () => {
      const file = new Dirent('file.md', constants.UV_DIRENT_FILE)
      file.parentPath = '/path1'

      const symlink = new Dirent('symlink', constants.UV_DIRENT_LINK)
      symlink.parentPath = '/path2'

      readdirSyncMock.mockReturnValue([file, symlink])

      readFileSyncMock.mockReturnValue('file-contents') // for both
      existsSyncMock.mockReturnValue(true)

      const actual = await generateTransformInput('/any')

      const expected = [{
        relativePath: '/path1/file.md',
        raw: 'file-contents'
      },
      {
        relativePath: '/path2/symlink',
        raw: 'file-contents'
      }]
      expect(actual).toEqual(expected)
    })
  })

  afterEach(() => {
    readdirSyncMock.mockReset()
    readFileSyncMock.mockReset()
    existsSyncMock.mockReset()
  })
})
