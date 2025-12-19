const parseToHtml = require('../../src/markdown-to-html-parser')

describe('Markdown Parser', () => {
  it('gives all images the "img-responsive" class', () => {
    const markdown = '![A delightful image](./some-image.png)'

    const actual = parseToHtml(markdown)
    const expected = 'img class="img-responsive"'

    expect(actual.includes(expected)).toBe(true)
  })

  it('gives all tables the "table" class', () => {
    const markdown = '| Column1 | Column2 |\n| --- | --- |\n| Some value | Some other value |'

    const actual = parseToHtml(markdown)
    const expected = 'table class="table"'

    expect(actual.includes(expected)).toBe(true)
  })

  it('should convert a complicated table', () => {
    const markdown = '| Image                                                      | Details                                                                                                                                                                                                                                                                                            |\n' +
      '|------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|\n' +
      '| ![Metrik website](docs/images/metrik-graph.png)            | **Metriks Website:** The Metrik website exposes Delivery Lead Time (DLT) and Deployment Frequency  for components subscribed to deployment-tracker. There is more information available within the [Metriks website](https://broxy.tools.bbc.co.uk/metriks) - use the \'Help\' link in the header. |\n' +
      '| ![Slack notifications](docs/images/slack-notification.png) | **Slack notifications:** Notifications can be enabled for global channels or channels in the Technology & Product Group or iPlayer and Sounds workspace. These do not work for other workspaces yet. Follow the [slack notifications setup guide](docs/usage-guides/slack-notifications.md) to set up slack notifications.                      |\n' +
      '| ![Email notifications](docs/images/email-notification.png) | **Email notifications:** Email notifications can be enabled for any email account. Follow the [email notifications setup guide](docs/usage-guides/email-notifications.md) to set up email notifications.                      |\n' +
      '| ![Email notifications](docs/images/data-feeds.png)         | **Data feeds:** The data stored by Deployment Tracker can be used to create products on top of. Details on how to consume the data can be found in the [Consume data guide](./docs/usage-guides/consuming-data.md) and examples of product built on top of the data provided are [listed below](#products-using-deployment-tracker-data) |\n' +
      '| ![Grafana annotations](docs/images/grafana_annotations.png)| **Add Annotations to Grafana:** The data stored by Deployment Tracker can be used to send annotations to the [BBC SRE Grafana](https://dashboard.sre.tools.bbc.co.uk/) for deployments. Follow the [Grafana annotations guide](docs/usage-guides/grafana-annotations.md) to set up annotations from Deployment Tracker.'

    const actual = parseToHtml(markdown)
    const expected = 'table class="table"'

    expect(actual.includes(expected)).toBe(true)
  })

  it('creates anchor link for headings', () => {
    const markdown = '# Heading'

    const actual = parseToHtml(markdown)
    const expected = '<h1 id="heading"><a href="#heading">Heading</a></h1>'

    expect(actual.includes(expected)).toBe(true)
  })

  it('creates anchor link for headings even with nested HTML content', () => {
    const cases = [
      {
        markdown: '# Heading <em id="123">with style!</em>',
        expected: '<h1 id="heading-em-id123with-styleem"><a href="#heading-em-id123with-styleem">Heading <em id="123">with style!</em></a></h1>'
      },
      {
        markdown: '## Another <strong>bold</strong> heading',
        expected: '<h2 id="another-strongboldstrong-heading"><a href="#another-strongboldstrong-heading">Another <strong>bold</strong> heading</a></h2>'
      },
      {
        markdown: '### Simple Heading',
        expected: '<h3 id="simple-heading"><a href="#simple-heading">Simple Heading</a></h3>'
      },
      {
        markdown: '### Special Char Delete: # &amp; Test: Version@1',
        expected: '<h3 id="special-char-delete-amp-test-version1"><a href="#special-char-delete-amp-test-version1">Special Char Delete: # &amp; Test: Version@1</a></h3>'
      }
    ]

    cases.forEach(({ markdown, expected }) => {
      const actual = parseToHtml(markdown)
      expect(actual).toMatch(expected)
    })
  })

  it('converts GitHub alerts to HTML', () => {
    const cases = [
      {
        markdown: '> [!NOTE]\n> My Note text',
        expected: '<blockquote class="markdown-alert markdown-alert-note">\n<p><strong>Note</strong></p>\n<p>My Note text</p>\n</blockquote>'
      },
      {
        markdown: '> [!TIP]\n> My Note text',
        expected: '<blockquote class="markdown-alert markdown-alert-tip">\n<p><strong>Tip</strong></p>\n<p>My Note text</p>\n</blockquote>'
      },
      {
        markdown: '> Normal quote text',
        expected: '<blockquote>Normal quote text</blockquote>'
      },
      {
        markdown: '> [!TIP]\n> Multi-line\n> Multi-line\n> Multi-line',
        expected: '<blockquoteclass="markdown-alertmarkdown-alert-tip"><p><strong>Tip</strong></p><p>Multi-line<br>Multi-line<br>Multi-line</p></blockquote>'
      }
    ]

    cases.forEach(({ markdown, expected }) => {
      const actual = parseToHtml(markdown)
      // this removes annoying whitespace from the output
      expect(actual.replace(/\s+/g, '')).toBe(expected.replace(/\s+/g, ''))
    })
  })

  it('creates an html link from an md link', () => {
    const markdown =
      '[here](./docs/user/publishing-your-repo.md)\n[here](./docs/user/publishing-another-repo.md)'

    const actual = parseToHtml(markdown)

    const expected =
      '<p><a href="./docs/user/publishing-your-repo.html">here</a><br><a href="./docs/user/publishing-another-repo.html">here</a></p>'

    expect(actual).toEqual(expected)
  })

  it("doesn't break absolute links", () => {
    const markdown =
      '[here](https://bbc.co.uk/docs/user/publishing-your-repo.md)\n[here](https://bbc.co.uk/docs/user/publishing-another-repo.md)'

    const actual = parseToHtml(markdown)

    const expected =
      '<p><a href="https://bbc.co.uk/docs/user/publishing-your-repo.md">here</a><br><a href="https://bbc.co.uk/docs/user/publishing-another-repo.md">here</a></p>'

    expect(actual).toEqual(expected)
  })

  it("doesn't break absolute links in link tags", () => {
    const markdown = '<link href="https://bbc.co.uk/docs/user/main.css" />'

    const actual = parseToHtml(markdown)

    const expected =
      '<link href="https://bbc.co.uk/docs/user/main.css" />'

    expect(actual).toEqual(expected)
  })

  it('adds the base path to root links in link tags', () => {
    const markdown = '<link href="/assets/main.css" />'

    const actual = parseToHtml(markdown, { basePath: '/morty-docs/some-repo' })

    const expected =
      '<link href="/morty-docs/some-repo/assets/main.css" />'

    expect(actual).toEqual(expected)
  })

  it('retains additional link attributes when a link tag contains a root link', () => {
    const markdown = '<link rel="stylesheet" href="/assets/main.css" media="print" />'

    const actual = parseToHtml(markdown, { basePath: '/morty-docs/some-repo' })
    const expected =
      '<link rel="stylesheet" href="/morty-docs/some-repo/assets/main.css" media="print" />'

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

  it('should render check boxes correctly', () => {
    const markdown =
      '- [ ] Item 1\n' +
      '- [x] Item 2\n' +
      '- [ ] Item 3'

    const actual = parseToHtml(markdown)
    const expected =
      '<ul>\n' +
      '<li class="task-list-item"><input disabled="" type="checkbox"> Item 1</li>\n' +
      '<li class="task-list-item"><input checked="" disabled="" type="checkbox"> Item 2</li>\n' +
      '<li class="task-list-item"><input disabled="" type="checkbox"> Item 3</li>\n' +
      '</ul>'

    expect(actual).toEqual(expected)
  })

  it('should render normal list items without input class', () => {
    const markdown =
      '- Item 1\n' +
      '- Item 2\n' +
      '- Item 3'

    const actual = parseToHtml(markdown)
    const expected =
      '<ul>\n' +
      '<li>Item 1</li>\n' +
      '<li>Item 2</li>\n' +
      '<li>Item 3</li>\n' +
      '</ul>'

    expect(actual).toEqual(expected)
  })
})
