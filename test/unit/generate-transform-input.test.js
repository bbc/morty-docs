const generateTransformInput = require('../../src/generate-transform-input')
const readdir = require('recursive-readdir')
const fs = require('fs')

jest.mock('recursive-readdir')
jest.mock('fs')

describe('Generate transform input', () => {
  beforeEach(() => {
    readdir.mockImplementation(() => Promise.resolve([
      '/tmp/someRepo/someDirectory/some/path/tofile.md',
      '/tmp/someRepo/someDirectory/another/path/tofile.md'
    ]))
    fs.readFileSync.mockImplementation(() => 'some text in a file')
  })

  afterEach(() => {
    readdir.mockRestore()
    fs.readFileSync.mockRestore()
  })

  it('creates a correctly structured array of file objects from a directory ending in a slash', async () => {
    const dir = '/tmp/someRepo/someDirectory/'

    const expected = [{
      relativePath: 'some/path/tofile.md',
      raw: 'some text in a file'
    }, {
      relativePath: 'another/path/tofile.md',
      raw: 'some text in a file'
    }]

    const actual = await generateTransformInput(dir)

    expect(actual).toEqual(expected)
  })

  it('creates a correctly structured array of file objects from a directory that does not end in a slash', async () => {
    const dir = '/tmp/someRepo/someDirectory'

    const expected = [{
      relativePath: 'some/path/tofile.md',
      raw: 'some text in a file'
    }, {
      relativePath: 'another/path/tofile.md',
      raw: 'some text in a file'
    }]

    const actual = await generateTransformInput(dir)

    expect(actual).toEqual(expected)
  })
})
