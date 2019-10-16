const generateTransformInput = require('../../src/generate-transform-input')
const readdir = require('recursive-readdir')
const fs = require('fs')

jest.mock('recursive-readdir')
jest.mock('fs')

readdir.mockImplementation(() => Promise.resolve(['some/path/tofile.md', 'another/path/tofile.md']))
fs.readFileSync.mockImplementation(() => 'some text in a file')

describe('Generate transform input', () => {
  it('creates a correctly strcutured array of file objects from a directory', async () => {
    const expected = [
      {
        relativePath: 'some/path/tofile.md',
        raw: 'some text in a file'
      },
      {
        relativePath: 'another/path/tofile.md',
        raw: 'some text in a file'
      }
    ]

    const actual = await generateTransformInput('someDirectory')

    expect(actual).toEqual(expected)
  })
})
