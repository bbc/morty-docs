const generateIndexes = require('../../src/generate-indexes.js')

describe('Generating indexes', () => {
  it('returns an index page for the "root" folder', () => {
    const input = [{
      relativePath: 'someRootFile.html'
    }]

    const actual = generateIndexes(input, { repoName: 'some-repo' })
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

    const actual = generateIndexes(input, { repoName: 'some-repo' })

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

    const actual = generateIndexes(input, { repoName: 'some-repo' })
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

  it('generates indexes for every other directory in path', () => {
    const input = [{
      relativePath: 'docs/arch/someMDFile.html'
    }]

    const actual = generateIndexes(input, { repoName: 'some-repo' })

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

    const actual = generateIndexes(input, { repoName: 'some-repo' })

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

    const actual = generateIndexes(input, { contentTitle: 'some-repo' })

    expect(actual[0].raw.toString()).toMatchSnapshot()
  })

  it('to match snapshot without a content title', () => {
    const input = [{
      relativePath: 'foo1.html'
    }, {
      relativePath: 'foo2.html'
    }]

    const actual = generateIndexes(input, { })

    expect(actual[0].raw.toString()).toMatchSnapshot()
  })
})
