const generateIndexes = require('../../src/generate-indexes.js')

describe('Generate Indexes with the correct paths', () => {
  it('for a top level index page', () => {
    const input = [{ relativePath: 'someRootFile.html' }]

    const actual = generateIndexes(input, { repoName: 'some-repo' })

    const expected = [{
      relativePath: 'index.html',
      raw: expect.anything()
    }]

    expect(actual).toEqual(expected)
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
      raw: expect.anything()
    }, {
      relativePath: 'someFolder/index.html',
      raw: expect.anything()
    }, {
      relativePath: 'someOtherFolder/index.html',
      raw: expect.anything()
    }]

    expect(actual).toEqual(expected)
  })

  it('generates indexes for every directory in path', () => {
    const input = [{
      relativePath: 'someFolder/someOtherFolder/docs/file.html'
    }]

    const actual = generateIndexes(input, { repoName: 'some-repo' })

    const expected = [{
      relativePath: 'someFolder/index.html',
      raw: expect.anything()
    }, {
      relativePath: 'someFolder/someOtherFolder/index.html',
      raw: expect.anything()
    }, {
      relativePath: 'someFolder/someOtherFolder/docs/index.html',
      raw: expect.anything()
    }]

    expect(actual).toEqual(expected)
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
