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

  it('creates anchor link for headings even with nested HTML content', () => {
    const markdown = '# Heading <em id="123">with style!</em>'

    const actual = parseToHtml(markdown)

    const expected = '<h1 id="heading-em-id123with-styleem"><a href="#heading-em-id123with-styleem">Heading <em id="123">with style!</em></a></h1>'

    expect(actual).toMatch(expected)
  })

  it('creates an html link from an md link', () => {
    const markdown =
      '[here](./docs/user/publishing-your-repo.md)\n[here](./docs/user/publishing-another-repo.md)'

    const actual = parseToHtml(markdown)

    const expected =
      '<p><a href="./docs/user/publishing-your-repo.html">here</a><br />\n<a href="./docs/user/publishing-another-repo.html">here</a></p>'

    expect(actual).toEqual(expected)
  })

  it("doesn't break absolute links", () => {
    const markdown =
      '[here](https://bbc.co.uk/docs/user/publishing-your-repo.md)\n[here](https://bbc.co.uk/docs/user/publishing-another-repo.md)'

    const actual = parseToHtml(markdown)

    const expected =
      '<p><a href="https://bbc.co.uk/docs/user/publishing-your-repo.md">here</a><br />\n<a href="https://bbc.co.uk/docs/user/publishing-another-repo.md">here</a></p>'

    expect(actual).toEqual(expected)
  })

  it("doesn't break absolute links in link tags", () => {
    const markdown = '<link href="https://bbc.co.uk/docs/user/main.css" />'

    const actual = parseToHtml(markdown)

    const expected =
      '<p><link href="https://bbc.co.uk/docs/user/main.css" /></p>'

    expect(actual).toEqual(expected)
  })

  it('adds the base path to root links in link tags', () => {
    const markdown = '<link href="/assets/main.css" />'

    const actual = parseToHtml(markdown, { basePath: '/morty-docs/some-repo' })

    const expected =
      '<p><link href="/morty-docs/some-repo/assets/main.css" /></p>'

    expect(actual).toEqual(expected)
  })

  it('retains additional link attributes when a link tag contains a root link', () => {
    const markdown = '<link rel="stylesheet" href="/assets/main.css" media="print" />'

    const actual = parseToHtml(markdown, { basePath: '/morty-docs/some-repo' })

    const expected =
      '<p><link rel="stylesheet" href="/morty-docs/some-repo/assets/main.css" media="print" /></p>'

    expect(actual).toEqual(expected)
  })

  it('should replace multiple relative links per line', () => {
    const markdown =
      '[here](./publishing-your-repo.md)[here](./publishing-your-repo.md)[here](./publishing-your-repo.md)'

    const actual = parseToHtml(markdown)

    const expected =
      '<p><a href="./publishing-your-repo.html">here</a><a href="./publishing-your-repo.html">here</a><a href="./publishing-your-repo.html">here</a></p>'

    expect(actual).toEqual(expected)
  })

  it('should replace multiple hash links per line', () => {
    const markdown =
      '[here](./link1.md#Section1)[here](./link2.md#Section2)[here](./link3.md#Section3)'

    const actual = parseToHtml(markdown)

    const expected =
      '<p><a href="./link1.html#Section1">here</a><a href="./link2.html#Section2">here</a><a href="./link3.html#Section3">here</a></p>'

    expect(actual).toEqual(expected)
  })
})
