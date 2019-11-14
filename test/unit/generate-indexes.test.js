const generateIndexes = require('../../src/generate-indexes.js')

describe('Generate Indexes with the correct paths', () => {
  it('for a top level index page', () => {
    const input = [{ relativePath: 'foo.html' }]

    const actual = generateIndexes(input, { repoName: 'some-repo' })

    const expected = [{
      relativePath: 'index.html',
      raw: expect.anything()
    }]

    expect(actual).toEqual(expected)
  })

  it('for multiple index pages', () => {
    const input = [{
      relativePath: 'foo.html'
    }, {
      relativePath: 'bar/baz.html'
    }, {
      relativePath: 'bar/qux/qar.html'
    }]

    const actual = generateIndexes(input, { repoName: 'some-repo' })

    const expected = [{
      relativePath: 'index.html',
      raw: expect.anything()
    }, {
      relativePath: 'bar/index.html',
      raw: expect.anything()
    }, {
      relativePath: 'bar/qux/index.html',
      raw: expect.anything()
    }]

    expect(actual).toEqual(expected)
  })
})

describe('Generate Indexes with the correct html', () => {
  it('The correct links are included in the raw output', () => {
    const input = [{
      relativePath: 'foo.html'
    }, {
      relativePath: 'bar/baz.html'
    }, {
      relativePath: 'bar/qux/qar.html'
    }]

    const actual = generateIndexes(input, { repoName: 'some-repo' })

    const expectedRootIndexLinks = [
      '<a href="bar/index.html">',
      '<a href="bar/qux/index.html">',
      '<a href="foo.html">'
    ]

    const expectedBarIndexLinks = [
      '<a href="baz.html">',
      '<a href="qux/index.html">'
    ]

    const expectedQuxIndexLinks = [
      '<a href="qar.html">'
    ]

    expectedRootIndexLinks.forEach(link => {
      expect(actual[0].raw.toString()).toContain(link)
    })

    expectedBarIndexLinks.forEach(link => {
      expect(actual[1].raw.toString()).toContain(link)
    })

    expectedQuxIndexLinks.forEach(link => {
      expect(actual[2].raw.toString()).toContain(link)
    })
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
