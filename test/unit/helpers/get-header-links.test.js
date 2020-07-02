const getHeaderLinks = require('../../../src/helpers/get-header-links')

describe('When passed a relative path', () => {
  const relPath = 'folder/subFolder/nestedSubFolder/file.md'
  const pathParts = relPath.split('/')

  it('returns an array of every possible path', () => {
    const expected = [
      'folder',
      'folder/subFolder',
      'folder/subFolder/nestedSubFolder'
    ]

    const actual = getHeaderLinks(relPath, pathParts)

    expect(actual).toEqual(expected)
  })

  it('filters out any .md files', () => {
    const headerLinks = getHeaderLinks(relPath, pathParts)

    expect(headerLinks).toEqual(expect.not.arrayContaining(['file.md']))
  })
})