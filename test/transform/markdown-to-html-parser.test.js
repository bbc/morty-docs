const parseToHtml = require('../../src/markdown-to-html-parser')

describe('Markdown Parser', () => {
  it('gives all images the "img-responsive" class', () => {
    const markdown = `![A delightful image](./some-image.png)`

    const actual = parseToHtml(markdown)

    const expected = `img class="img-responsive"`

    expect(actual.includes(expected)).toBe(true)
  })

  it('gives all tables the "table" class', () => {
    const markdown = `| Column1 | Column2 |\n| --- | --- |\n| Some value | Some other value |`

    const actual = parseToHtml(markdown)

    const expected = `table class="table"`

    expect(actual.includes(expected)).toBe(true)
  })

  it('creates anchor link for headings', () => {
    const markdown = '# Heading'

    const actual = parseToHtml(markdown)

    const expected = '<h1 id="heading"><a href="#heading">Heading</a></h1>'

    expect(actual.includes(expected)).toBe(true)
  })

  it('creates an html link from an md link', () => {
    const markdown = '[here](./docs/user/publishing-your-repo.md)'

    const actual = parseToHtml(markdown)

    const expected = '<p><a href="./docs/user/publishing-your-repo.html">here</a></p>'

    expect(actual).toEqual(expected)
  })
})
