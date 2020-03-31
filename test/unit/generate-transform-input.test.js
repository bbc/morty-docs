const generateTransformInput = require('../../src/generate-transform-input')
const readdir = require('recursive-readdir')
const fs = require('fs')

jest.mock('recursive-readdir')
jest.mock('fs')

readdir.mockImplementation(() => Promise.resolve(['someDirectory/some/path/tofile.md', 'someDirectory/another/path/tofile.md']))
fs.readFileSync.mockImplementation(() => 'some text in a file')

describe('Generate transform input', () => {
  it('creates a correctly structured array of file objects from a directory ending in a slash', async () => {
    const expected = [
      {
        relativePath: 'someDirectory/some/path/tofile.md',
        raw: 'some text in a file'
      },
      {
        relativePath: 'someDirectory/another/path/tofile.md',
        raw: 'some text in a file'
      }
    ]

    const actual = await generateTransformInput('tmp/someRepo/', 'someDirectory/')

    expect(actual).toEqual(expected)
  })

  it('creates a correctly structured array of file objects from a directory that does not end in a slash', async () => {
    const expected = [
      {
        relativePath: 'someDirectory/some/path/tofile.md',
        raw: 'some text in a file'
      },
      {
        relativePath: 'someDirectory/another/path/tofile.md',
        raw: 'some text in a file'
      }
    ]

    const actual = await generateTransformInput('tmp/someRepo', 'someDirectory')

    expect(actual).toEqual(expected)
  })
})
