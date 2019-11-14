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

    expect(actual[0].raw.toString()).toMatchSnapshot()
    expect(actual[1].raw.toString()).toMatchSnapshot()
    expect(actual[2].raw.toString()).toMatchSnapshot()
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
