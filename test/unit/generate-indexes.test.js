const generateIndexes = require('../../src/generate-indexes.js')

beforeAll(() => {
  jest.useFakeTimers('modern')
  jest.setSystemTime(new Date(2020, 3, 1))
})

afterAll(() => {
  jest.useRealTimers()
})

describe('Generating indexes', () => {
  it('returns an index page for the "root" folder', () => {
    const input = [{
      relativePath: 'someRootFile.html'
    }]

    const actual = generateIndexes(input, { repoName: 'some-repo', basePath: 'morty-docs/some-repo' })
    const expected = [{
      relativePath: 'index.html',
      raw: expect.any(Buffer)
    }]

    expect(actual).toEqual(expect.arrayContaining(expected))
    expect(actual).toHaveLength(expected.length)
  })

  it('returns an index page for the "root" folder, if the folder contains no files', () => {
    const input = [{
      relativePath: 'rfc/someRfc.html'
    }]

    const actual = generateIndexes(input, { repoName: 'some-repo', basePath: 'morty-docs/some-repo' })

    const expected = [{
      relativePath: 'index.html',
      raw: expect.any(Buffer)
    }, {
      relativePath: 'rfc/index.html',
      raw: expect.any(Buffer)
    }]

    expect(actual).toEqual(expect.arrayContaining(expected))
    expect(actual).toHaveLength(expected.length)
  })

  it('for multiple index pages', () => {
    const input = [{
      relativePath: 'someRootFile.html'
    }, {
      relativePath: 'someFolder/file.html'
    }, {
      relativePath: 'someOtherFolder/file.html'
    }]

    const actual = generateIndexes(input, { repoName: 'some-repo', basePath: 'morty-docs/some-repo' })
    const expected = [{
      relativePath: 'index.html',
      raw: expect.any(Buffer)
    }, {
      relativePath: 'someFolder/index.html',
      raw: expect.any(Buffer)
    }, {
      relativePath: 'someOtherFolder/index.html',
      raw: expect.any(Buffer)
    }]

    expect(actual).toEqual(expect.arrayContaining(expected))
    expect(actual).toHaveLength(expected.length)
  })

  it('does not override an existing index.html file in the root', () => {
    const input = [{
      relativePath: 'someRootFile.html'
    }, {
      relativePath: 'index.html'
    }]

    const actual = generateIndexes(input, { repoName: 'some-repo', basePath: 'morty-docs/some-repo' })
    const expectedAbsent = [{
      relativePath: 'index.html',
      raw: expect.any(Buffer)
    }]

    expect(actual).not.toEqual(expect.arrayContaining(expectedAbsent))
    expect(actual).toHaveLength(0)
  })

  it('does not override an existing index.html file in a subdirectory', () => {
    const input = [{
      relativePath: 'someRootFile.html'
    }, {
      relativePath: 'somePath/someNestedFile.html'
    }, {
      relativePath: 'somePath/index.html'
    }]

    const actual = generateIndexes(input, { repoName: 'some-repo', basePath: 'morty-docs/some-repo' })
    const expectedAbsent = [{
      relativePath: 'somePath/index.html',
      raw: expect.any(Buffer)
    }]

    expect(actual).not.toEqual(expect.arrayContaining(expectedAbsent))
    expect(actual).toHaveLength(1)
  })

  it('generates indexes for every other directory in path', () => {
    const input = [{
      relativePath: 'docs/arch/someMDFile.html'
    }]

    const actual = generateIndexes(input, { repoName: 'some-repo', basePath: 'morty-docs/some-repo' })

    const expected = [{
      relativePath: 'index.html',
      raw: expect.any(Buffer)
    }, {
      relativePath: 'docs/index.html',
      raw: expect.any(Buffer)
    }, {
      relativePath: 'docs/arch/index.html',
      raw: expect.any(Buffer)
    }]

    expect(actual).toEqual(expect.arrayContaining(expected))
    expect(actual).toHaveLength(expected.length)
  })
})

describe('Generate Indexes with the correct html', () => {
  it('The correct links are included in the raw output', () => {
    const input = [{
      relativePath: 'rootFile.html'
    }, {
      relativePath: 'folder/nestedFile.html'
    }, {
      relativePath: 'docs/arch/furtherNestedFile.html'
    }]

    const actual = generateIndexes(input, { repoName: 'some-repo', basePath: 'morty-docs/some-repo' })

    expect(actual[0].raw.toString()).toMatchSnapshot()
    expect(actual[1].raw.toString()).toMatchSnapshot()
    expect(actual[2].raw.toString()).toMatchSnapshot()
    expect(actual[3].raw.toString()).toMatchSnapshot()
  })

  it('to match snapshot with a content title', () => {
    const input = [{
      relativePath: 'foo1.html'
    }, {
      relativePath: 'foo2.html'
    }]

    const actual = generateIndexes(input, { contentTitle: 'some-repo', basePath: 'morty-docs/some-repo' })

    expect(actual[0].raw.toString()).toMatchSnapshot()
  })

  it('to match snapshot without a content title', () => {
    const input = [{
      relativePath: 'foo1.html'
    }, {
      relativePath: 'foo2.html'
    }]

    const actual = generateIndexes(input, { basePath: 'morty-docs/some-repo' })

    expect(actual[0].raw.toString()).toMatchSnapshot()
  })

  it('to match snapshot with a colon in the filename', () => {
    const input = [{
      relativePath: 'file:foo1.html'
    }, {
      relativePath: 'foo2.html'
    }]

    const actual = generateIndexes(input, { basePath: 'morty-docs/some-repo' })

    expect(actual[0].raw.toString()).toMatchSnapshot()
  })

  it('to match snapshot with a pdf file', () => {
    const input = [{
      relativePath: 'foo1.html'
    }, {
      relativePath: 'foo2.pdf'
    }]

    const actual = generateIndexes(input, { basePath: 'morty-docs/some-repo' })

    expect(actual[0].raw.toString()).toMatchSnapshot()
  })
})
