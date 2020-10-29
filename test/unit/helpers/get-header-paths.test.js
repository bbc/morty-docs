const getHeaderPaths = require('../../../src/helpers/get-header-paths')

describe('Get header paths', () => {
  it('returns an array of every possible path', () => {
    const basePath = 'morty-docs/some-repo'
    const relPath = 'folder/subFolder/nestedSubFolder/file.md'
    const expected = [
      {
        text: 'morty-docs',
        path: '/morty-docs'
      },
      {
        text: 'some-repo',
        path: '/morty-docs/some-repo'
      },
      {
        text: 'folder',
        path: '/morty-docs/some-repo/folder'
      },
      {
        text: 'subFolder',
        path: '/morty-docs/some-repo/folder/subFolder'
      },
      {
        text: 'nestedSubFolder',
        path: '/morty-docs/some-repo/folder/subFolder/nestedSubFolder'
      }
    ]

    const actual = getHeaderPaths(basePath, relPath)

    expect(actual).toEqual(expected)
  })

  it('handles a missing relPath', () => {
    const basePath = 'morty-docs/some-repo'
    const expected = [
      {
        text: 'morty-docs',
        path: '/morty-docs'
      },
      {
        text: 'some-repo',
        path: '/morty-docs/some-repo'
      }
    ]

    const actual = getHeaderPaths(basePath)

    expect(actual).toEqual(expected)
  })

  it('filters out any .html files', () => {
    const basePath = 'morty-docs/some-repo'
    const relPath = 'folder/subFolder/nestedSubFolder/file.html'
    const headerLinks = getHeaderPaths(basePath, relPath)

    expect(headerLinks).toEqual(expect.not.arrayContaining(['file.html']))
  })
})
