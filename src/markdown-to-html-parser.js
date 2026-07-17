const { marked } = require('marked')
const hljs = require('highlight.js/lib/common')
const emoji = require('node-emoji')
const alertIcons = require('./alert-icons')
const usesGithubMarkdownStyle = require('./helpers/uses-github-markdown-style')

const MAX_HIGHLIGHTED_CODE_BLOCK_BYTES = 100 * 1024
const MAX_HIGHLIGHTED_CODE_DOCUMENT_BYTES = 100 * 1024
const MAX_HIGHLIGHTED_CODE_LINE_BYTES = 10 * 1024
const MAX_HIGHLIGHTED_DIFF_LINES = 2000

const anchorIcon = `
<svg class="anchor-icon" aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
  <path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path>
</svg>`

const escapeHtml = value => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[character])

const normaliseCodeLanguage = language => {
  const match = (language || '').trim().match(/^([A-Za-z0-9_+#-]+)(?:\s|$)/)
  return match ? match[1] : ''
}

const normaliseCodeText = text => text.replace(/\n$/, '')

const exceedsCodeLineLimits = (code, maximumLines = Infinity) => {
  let lineCount = 1
  let lineStart = 0

  while (lineStart <= code.length) {
    const newline = code.indexOf('\n', lineStart)
    const lineEnd = newline === -1 ? code.length : newline
    if (Buffer.byteLength(code.slice(lineStart, lineEnd), 'utf8') > MAX_HIGHLIGHTED_CODE_LINE_BYTES) return true
    if (newline === -1) return false

    lineCount += 1
    if (lineCount > maximumLines) return true
    lineStart = newline + 1
  }

  return false
}

const normaliseBasePath = (basePath) => {
  const pathElements = (basePath || '').split('/')
    .filter((entry) => Boolean(entry))

  if (pathElements.length === 0) {
    return ''
  }

  return '/' + pathElements.join('/')
}

const parseToHTML = (markdown, options = {}) => {
  // const parser = createParser(options)
  // return parser.makeHtml(markdown)
  const basePath = normaliseBasePath(options.basePath)
  const useGithubStyle = usesGithubMarkdownStyle(options)
  let hasMermaid = false
  let remainingHighlightedCodeBytes = MAX_HIGHLIGHTED_CODE_DOCUMENT_BYTES

  function flattenHeading (text) {
    // To match showdown behaviour
    return text
      .replace(/<(\w+)([^>]*)>/g, (match, tag, attrs) => {
        // Extract id attribute if present
        const idMatch = attrs.match(/id="([^"]+)"/)
        return tag + (idMatch ? '-id' + idMatch[1] : '')
      })
      .replace(/<\/(\w+)>/g, '$1') // Replace closing tags with tag name
      .replace(/[^a-zA-Z0-9 \-"=]+/g, '') // Remove special chars like ?!@ etc...
      .replace(/[^\w-]+/g, '-') // Replace non-word chars with dashes
      .replace(/^-+|-+$/g, '') // Trim leading/trailing dashes
      .toLowerCase()
  }

  const renderer = {
    heading ({ tokens, depth }) {
      const text = this.parser.parseInline(tokens)
      const escapedText = flattenHeading(text.toLowerCase())

      return `<h${depth} id="${escapedText}">${text}</h${depth}>`
    },
    blockquote ({ tokens }) {
      const firstToken = tokens[0]
      const alertPattern = /^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\][ \t]*(?:\n[ \t]*)?/i
      const alertMatch = firstToken && firstToken.type === 'paragraph'
        ? firstToken.text.match(alertPattern)
        : null
      if (!alertMatch) return marked.Renderer.prototype.blockquote.call(this, { tokens }) // default behavior

      const type = alertMatch[1].toLowerCase()
      const title = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
      const firstInlineToken = firstToken.tokens[0]
      const strippedInlineToken = {
        ...firstInlineToken,
        raw: firstInlineToken.raw.replace(alertPattern, ''),
        text: firstInlineToken.text.replace(alertPattern, '')
      }
      const firstInlineTokens = [strippedInlineToken, ...firstToken.tokens.slice(1)]
        .filter(token => token.raw || token.text)
      while (firstInlineTokens[0] && firstInlineTokens[0].type === 'br') {
        firstInlineTokens.shift()
      }
      const contentTokens = firstInlineTokens.length === 0
        ? tokens.slice(1)
        : [{
            ...firstToken,
            raw: firstToken.raw.replace(alertPattern, ''),
            text: firstToken.text.replace(alertPattern, ''),
            tokens: firstInlineTokens
          }, ...tokens.slice(1)]
      const content = this.parser.parse(contentTokens)

      if (useGithubStyle) {
        return `<blockquote class="markdown-alert markdown-alert-${type}"><p class="markdown-alert-title">${alertIcons[type]}${title}</p>${content}</blockquote>`
      }

      return `<blockquote class="markdown-alert markdown-alert-${type}"><p><strong>${title}</strong></p>${content}</blockquote>`
    },
    code (token) {
      if (token.lang === 'mermaid') {
        hasMermaid = true
        return `<div class="mermaid">${escapeHtml(normaliseCodeText(token.text))}</div>`
      }

      const language = normaliseCodeLanguage(token.lang)
      const isDiff = language === 'diff' || language.endsWith('-diff')
      const isHighlightable = isDiff || (language && hljs.getLanguage(language))
      if (!isHighlightable) return marked.Renderer.prototype.code.call(this, token)

      const codeBytes = Buffer.byteLength(token.text, 'utf8')
      if (codeBytes > MAX_HIGHLIGHTED_CODE_BLOCK_BYTES || codeBytes > remainingHighlightedCodeBytes) {
        return marked.Renderer.prototype.code.call(this, token)
      }

      const code = normaliseCodeText(token.text)
      const maximumLines = isDiff ? MAX_HIGHLIGHTED_DIFF_LINES : Infinity
      if (exceedsCodeLineLimits(code, maximumLines)) {
        return marked.Renderer.prototype.code.call(this, token)
      }
      remainingHighlightedCodeBytes -= codeBytes

      if (isDiff) {
        const highlightedLanguage = language === 'diff' ? 'diff' : language.replace(/-diff$/, '')
        const highlightedLines = code.split('\n').map(line => {
          const lineClass = line.startsWith('+')
            ? 'diff-add'
            : line.startsWith('-')
              ? 'diff-remove'
              : 'diff-neutral'
          const prefix = /^[+-]/.test(line) ? line.charAt(0) : ''
          const value = prefix ? line.slice(1) : line
          const highlightedValue = highlightedLanguage !== 'diff' && hljs.getLanguage(highlightedLanguage)
            ? hljs.highlight(value, { language: highlightedLanguage, ignoreIllegals: true }).value
            : escapeHtml(value)

          return `<span class="diff-line ${lineClass}">${prefix}${highlightedValue}</span>`
        }).join('\n')

        return `<pre class="diff-block"><code class="language-${highlightedLanguage}">${highlightedLines}</code></pre>`
      }

      const highlighted = hljs.highlight(code, { language, ignoreIllegals: true }).value
      return `<pre><code class="language-${language} hljs">${highlighted}\n</code></pre>`
    }
  }

  marked.use({ renderer, breaks: true })
  const markdownToParse = markdown.replace(/^([ \t]*)(`{3,}|~{3,})[ \t]*diff[ \t]+([A-Za-z0-9_+#-]+)[ \t]*$/gmi, '$1$2$3-diff')
  let html = marked.parse(markdownToParse).trim()

  // Custom replacements
  html = html.replace(/<a href="([^:\n]*?).md">/g, '<a href="$1.html">') // convertMdLinksToHtmlLinks
  html = html.replace(/<a href="([^:\n]*?).md#(.*?)">/g, '<a href="$1.html#$2">') // convertMdHashLinksToHtmlLinks
  if (useGithubStyle) {
    html = html.replace(/<(h[123456]) id="([^"]+)">([\s\S]*?)<\/\1>/g, `<$1 id="$2" class="heading-anchor"><a href="#$2" class="anchor-link" aria-label="Permalink">${anchorIcon}</a>$3</$1>`)
  } else {
    html = html.replace(/<(h[123456]) id="([^"]+)">([\s\S]*?)<\/\1>/g, '<$1 id="$2"><a href="#$2">$3</a></$1>') // headingExtension
  }
  html = html.replace(/<table(.*)>/g, '<table class="table" $1>') // add class to table tags
  html = html.replace(/<img(.*)>/g, '<img class="img-responsive" $1 />') // add class to image tags
  html = html.replace(/<li>(<input.*)<\/li>/g, '<li class="task-list-item">$1</li>') // add class for list items (must have input at beginning)
  html = html.replace(/<a href="\/([^:\n]*)">/g, `<a href="${basePath}/$1">`) // addBasePathToRootLinks
  html = html.replace(/<link(.+)href="\/([^:\n]*)"(.*)\/>/g, `<link$1href="${basePath}/$2"$3/>`) // addBasePathToLinkHrefs

  if (hasMermaid) {
    html = `<script src="/morty-docs/mermaid.min.js" type="module"></script>\n<script>mermaid.initialize({ startOnLoad: true });</script>\n${html}`
  }

  const withEmoji = emoji.emojify(html) // convert emoji shortcodes to unicode e.g. :warning:

  return withEmoji
}

module.exports = parseToHTML
