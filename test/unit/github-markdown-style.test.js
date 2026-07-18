const parseToHtml = require('../../src/markdown-to-html-parser')
const transformContent = require('../../src/transform-content')
const hljs = require('highlight.js/lib/common')

const githubOptions = {
  basePath: '/morty-docs/some-repo',
  markdownStyle: 'github'
}

describe('Markdown presentation and highlighting', () => {
  afterEach(() => jest.restoreAllMocks())

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

  it.each([
    { name: 'original', options: { markdownStyle: 'original' } },
    { name: 'GitHub', options: githubOptions }
  ])('preserves multiple alert paragraphs with the $name style', ({ options }) => {
    const actual = parseToHtml('> [!CAUTION]\n>\n> First paragraph.\n>\n> Second paragraph.', options)

    expect(actual).toContain('<p>First paragraph.</p>\n<p>Second paragraph.</p>')
    expect(actual).not.toContain('First paragraph.<br>')
  })

  it.each([
    { name: 'original', options: { markdownStyle: 'original' } },
    { name: 'GitHub', options: githubOptions }
  ])('styles plain and language-specific diff fences by line with the $name style', ({ options }) => {
    const plainDiff = parseToHtml('```diff\n-old\n+new\n unchanged\n```', options)
    const yamlDiff = parseToHtml('```diff yaml\n-enabled: false\n+enabled: true\n```', options)

    expect(plainDiff).toContain('<pre class="diff-block"><code class="language-diff">')
    expect(plainDiff).toContain('<span class="diff-line diff-remove">-old</span>')
    expect(plainDiff).toContain('<span class="diff-line diff-add">+new</span>')
    expect(plainDiff).toContain('<span class="diff-line diff-neutral"> unchanged</span>')
    expect(plainDiff).toContain('</span><span class="diff-line diff-add">')
    expect(plainDiff).not.toContain('</span>\n<span class="diff-line')
    expect(yamlDiff).toContain('<pre class="diff-block"><code class="language-yaml">')
  })

  it('highlights both styles while only applying GitHub presentation when selected', () => {
    const input = { relativePath: 'example.md', raw: '```js\nconst enabled = true\n```' }
    const original = transformContent(input, { basePath: '', markdownStyle: 'original' }).raw
    const github = transformContent(input, githubOptions).raw

    expect(original).toContain('class="content"')
    expect(original).not.toContain('class="content content-github"')
    expect(original).not.toContain('@highlightjs/cdn-assets')
    expect(original).toContain('class="language-js hljs"')
    expect(original).toContain('<span class="hljs-keyword">const</span>')
    expect(original).toContain('.hljs-keyword')
    expect(original).not.toContain('class="theme-github"')
    expect(original).not.toContain('@media (prefers-color-scheme: dark)')
    expect(github).toContain('class="content content-github"')
    expect(github).toContain('class="theme-github"')
    expect(github).toContain('<meta name="color-scheme" content="light dark"/>')
    expect(github).toContain('@media (prefers-color-scheme: dark)')
    expect(github).toContain('--morty-page-bg: #0d1117')
    expect(github).toContain('--morty-hljs-keyword: #ff7b72')
    expect(github).toContain('--morty-alert-warning-bg: #bb800926')
    expect(github).toContain('class="language-js hljs"')
    expect(github).toContain('<span class="hljs-keyword">const</span>')
    expect(github).toContain('.hljs-keyword')
    expect(github).not.toContain('<script')
    expect(github).not.toContain('https://cdn.jsdelivr.net')
    expect(original).not.toContain('<script')
    expect(original).not.toContain('https://cdn.jsdelivr.net')
  })

  it('highlights language-specific diffs at build time', () => {
    const actual = parseToHtml('```diff yaml\n-enabled: false\n+enabled: true\n```', githubOptions)

    expect(actual).toContain('<code class="language-yaml">')
    expect(actual).toContain('<span class="diff-line diff-remove">-<span class="hljs-attr">enabled:</span> <span class="hljs-literal">false</span></span>')
    expect(actual).toContain('<span class="diff-line diff-add">+<span class="hljs-attr">enabled:</span> <span class="hljs-literal">true</span></span>')
  })

  it('does not reinterpret diff fences shown inside another code block', () => {
    const actual = parseToHtml('````plaintext\n```diff yaml\n-enabled: false\n+enabled: true\n```\n````', githubOptions)

    expect(actual).toContain('class="language-plaintext hljs"')
    expect(actual).toContain('```diff yaml')
    expect(actual).not.toContain('diff-block')
    expect(actual).not.toContain('diff-line')
    expect(actual).not.toContain('yaml-diff')
  })

  it.each([
    { name: 'original', options: { markdownStyle: 'original' } },
    { name: 'GitHub', options: githubOptions }
  ])('preserves Mermaid diagrams with the $name style', ({ name, options }) => {
    const actual = parseToHtml('```mermaid\ngraph TD\n  A["<unsafe>"] --> B\n```', options)

    expect(actual).toContain('<script src="/morty-docs/mermaid.min.js" defer></script>')
    expect(actual).toContain("mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme:")
    expect(actual).toContain('mermaid.run();')
    if (name === 'GitHub') {
      expect(actual).toContain("window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default'")
    } else {
      expect(actual).toContain("theme: 'default'")
      expect(actual).not.toContain('window.matchMedia')
    }
    expect(actual).toContain('<div class="mermaid">graph TD\n  A[&quot;&lt;unsafe&gt;&quot;] --&gt; B</div>')
    expect(actual).not.toContain('language-mermaid')
    expect(actual).not.toContain('class="hljs')
  })

  it('leaves unknown languages escaped and unhighlighted', () => {
    const actual = parseToHtml('```made-up-language\n<tag> & value\n```', githubOptions)

    expect(actual).toContain('class="language-made-up-language"')
    expect(actual).toContain('&lt;tag&gt; &amp; value')
    expect(actual).not.toContain('class="language-made-up-language hljs"')
  })

  it('uses Highlight.js aliases containing a hash without allowing attribute injection', () => {
    const csharp = parseToHtml('```c#\npublic string Name { get; set; }\n```', githubOptions)
    const unsafeLanguage = parseToHtml('```js"><img/src=x/onerror=alert(1)>\nconst value = true\n```', githubOptions)

    expect(csharp).toContain('class="language-c# hljs"')
    expect(csharp).toContain('<span class="hljs-keyword">get</span>')
    expect(unsafeLanguage).toContain('class="language-js&quot;&gt;&lt;img/src=x/onerror=alert(1)&gt;"')
    expect(unsafeLanguage).not.toContain('<img')
    expect(unsafeLanguage).not.toContain(' hljs"')
  })

  it('matches Marked trailing-newline behavior for highlighted and diff fences', () => {
    const highlighted = parseToHtml('```js\nvalue\n\n```', githubOptions)
    const diff = parseToHtml('```diff\n unchanged\n\n```', githubOptions)

    expect(highlighted).toBe('<pre><code class="language-js hljs">value\n</code></pre>')
    expect(diff).toBe('<pre class="diff-block"><code class="language-diff"><span class="diff-line diff-neutral"> unchanged</span></code></pre>')
  })

  it('highlights code at the 100 KiB boundary', () => {
    const highlightSpy = jest.spyOn(hljs, 'highlight')
    const code = (('x'.repeat(1023) + '\n').repeat(99)) + 'x'.repeat(1024)

    const actual = parseToHtml(`\`\`\`plaintext\n${code}\n\`\`\``, githubOptions)

    expect(highlightSpy).toHaveBeenCalledTimes(1)
    expect(actual).toContain('class="language-plaintext hljs"')
    highlightSpy.mockRestore()
  })

  it('safely escapes oversized code without passing it to Highlight.js', () => {
    const highlightSpy = jest.spyOn(hljs, 'highlight')
    const prefix = '<script>&"'
    const code = prefix + 'x'.repeat((100 * 1024) + 1 - Buffer.byteLength(prefix))

    const actual = parseToHtml(`\`\`\`js\n${code}\n\`\`\``, githubOptions)

    expect(highlightSpy).not.toHaveBeenCalled()
    expect(actual).toContain('class="language-js"')
    expect(actual).toContain('&lt;script&gt;&amp;&quot;')
    expect(actual).not.toContain('<script>')
    expect(actual).not.toContain(' hljs"')
    expect(actual.length).toBe('<pre><code class="language-js">'.length + '&lt;script&gt;&amp;&quot;'.length + ((100 * 1024) + 1 - Buffer.byteLength(prefix)) + '\n</code></pre>'.length)
    highlightSpy.mockRestore()
  })

  it('does not split or highlight oversized typed diffs', () => {
    const highlightSpy = jest.spyOn(hljs, 'highlight')
    const prefix = '+<unsafe>&"'
    const code = prefix + 'x'.repeat((100 * 1024) + 1 - Buffer.byteLength(prefix))

    const actual = parseToHtml(`\`\`\`diff yaml\n${code}\n\`\`\``, githubOptions)

    expect(highlightSpy).not.toHaveBeenCalled()
    expect(actual).toContain('class="language-yaml-diff"')
    expect(actual).toContain('+&lt;unsafe&gt;&amp;&quot;')
    expect(actual).not.toContain('diff-block')
    expect(actual).not.toContain('diff-line')
    expect(actual.length).toBe('<pre><code class="language-yaml-diff">'.length + '+&lt;unsafe&gt;&amp;&quot;'.length + ((100 * 1024) + 1 - Buffer.byteLength(prefix)) + '\n</code></pre>'.length)
    highlightSpy.mockRestore()
  })

  it('limits cumulative highlighting work across a document', () => {
    const highlightSpy = jest.spyOn(hljs, 'highlight')
    const code = Array(60).fill('x'.repeat(1023)).join('\n')
    const markdown = `\`\`\`plaintext\n${code}\n\`\`\`\n\n\`\`\`plaintext\n${code}\n\`\`\``

    const actual = parseToHtml(markdown, githubOptions)

    expect(highlightSpy).toHaveBeenCalledTimes(1)
    expect(actual.match(/class="language-plaintext hljs"/g)).toHaveLength(1)
    expect(actual.match(/class="language-plaintext"/g)).toHaveLength(1)
  })

  it('does not highlight a code line over 10 KiB', () => {
    const highlightSpy = jest.spyOn(hljs, 'highlight')
    const code = '<unsafe>&"' + 'x'.repeat((10 * 1024) + 1)

    const actual = parseToHtml(`\`\`\`plaintext\n${code}\n\`\`\``, githubOptions)

    expect(highlightSpy).not.toHaveBeenCalled()
    expect(actual).toContain('class="language-plaintext"')
    expect(actual).toContain('&lt;unsafe&gt;&amp;&quot;')
    expect(actual).not.toContain(' hljs"')
    expect(actual.endsWith(`${'x'.repeat(64)}\n</code></pre>`)).toBe(true)
  })

  it('does not split or highlight typed diffs over 2000 lines', () => {
    const highlightSpy = jest.spyOn(hljs, 'highlight')
    const code = Array(2001).fill('+').join('\n')

    const actual = parseToHtml(`\`\`\`diff yaml\n${code}\n\`\`\``, githubOptions)

    expect(highlightSpy).not.toHaveBeenCalled()
    expect(actual).toContain('class="language-yaml-diff"')
    expect(actual).not.toContain('diff-block')
    expect(actual).not.toContain('diff-line')
    expect(actual.endsWith('+\n</code></pre>')).toBe(true)
  })
})
