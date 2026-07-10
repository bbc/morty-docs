const parseToHtml = require('../../src/markdown-to-html-parser')
const transformContent = require('../../src/transform-content')

const githubOptions = {
  basePath: '/morty-docs/some-repo',
  markdownStyle: 'github'
}

describe('GitHub Markdown style', () => {
  it('keeps the original heading markup unless the style is selected', () => {
    const original = parseToHtml('# Heading', { markdownStyle: 'original' })
    const github = parseToHtml('# Heading', githubOptions)

    expect(original).toBe('<h1 id="heading"><a href="#heading">Heading</a></h1>')
    expect(original).not.toContain('anchor-icon')
    expect(github).toContain('<h1 id="heading" class="heading-anchor">')
    expect(github).toContain('class="anchor-link"')
    expect(github).toContain('class="anchor-icon"')
  })

  it('adds an icon to GitHub alerts', () => {
    const actual = parseToHtml('> [!WARNING]\n> Check this setting', githubOptions)

    expect(actual).toContain('class="markdown-alert markdown-alert-warning"')
    expect(actual).toContain('class="markdown-alert-title"')
    expect(actual).toContain('class="octicon octicon-alert"')
    expect(actual).toContain('Check this setting')
  })

  it('styles plain and language-specific diff fences by line', () => {
    const plainDiff = parseToHtml('```diff\n-old\n+new\n unchanged\n```', githubOptions)
    const yamlDiff = parseToHtml('```diff yaml\n-enabled: false\n+enabled: true\n```', githubOptions)

    expect(plainDiff).toContain('<pre class="diff-block"><code class="language-diff">')
    expect(plainDiff).toContain('<span class="diff-line diff-remove">-old</span>')
    expect(plainDiff).toContain('<span class="diff-line diff-add">+new</span>')
    expect(plainDiff).toContain('<span class="diff-line diff-neutral"> unchanged</span>')
    expect(yamlDiff).toContain('<pre class="diff-block"><code class="language-yaml">')
  })

  it('only loads GitHub styles and highlighting when selected', () => {
    const input = { relativePath: 'example.md', raw: '```js\nconst enabled = true\n```' }
    const original = transformContent(input, { basePath: '', markdownStyle: 'original' }).raw
    const github = transformContent(input, githubOptions).raw

    expect(original).toContain('class="content"')
    expect(original).not.toContain('content-github')
    expect(original).not.toContain('@highlightjs/cdn-assets')
    expect(github).toContain('class="content content-github"')
    expect(github).toContain('@highlightjs/cdn-assets@11.9.0/styles/github.min.css')
    expect(github).toContain('@highlightjs/cdn-assets@11.9.0/highlight.min.js')
  })
})
