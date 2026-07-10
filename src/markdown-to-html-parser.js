const { marked } = require('marked')
const emoji = require('node-emoji')
const alertIcons = require('./alert-icons')
const usesGithubMarkdownStyle = require('./helpers/uses-github-markdown-style')

const anchorIcon = `
<svg class="anchor-icon" aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
  <path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path>
</svg>`

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
      let textString = ''
      tokens.forEach(token => {
        if (token.tokens) {
          textString += this.parser.parseInline(token.tokens)
        } else if (token.type === 'space') {
          textString += this.parser.parseInline([{ type: 'br', text: token.text, raw: token.raw }])
        } else if (['list', 'code', 'hr', 'table'].includes(token.type)) {
          textString += marked.Renderer.prototype[token.type].call(this, token) // use default renderer for these block-level tokens
        } else {
          textString += this.parser.parseInline(tokens)
        }
      })

      const alertMatch = textString.match(/\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]/i)
      if (!alertMatch) return marked.Renderer.prototype.blockquote.call(this, { tokens }) // default behavior

      const type = alertMatch[1].toLowerCase()
      let content = textString.replace(/\[![A-Z]+\]/i, '')
      content = content.replace(/^<br>/, '')
      const title = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()

      if (useGithubStyle) {
        return `<blockquote class="markdown-alert markdown-alert-${type}"><p class="markdown-alert-title">${alertIcons[type]}${title}</p><p>${content}</p></blockquote>`
      }

      return `<blockquote class="markdown-alert markdown-alert-${type}"><p><strong>${title}</strong></p><p>${content}</p></blockquote>`
    },
    code ({ text, lang, escaped }) {
      if (lang === 'mermaid') {
        try {
          hasMermaid = true
          return `<div class="mermaid">${text}</div>`
        } catch (error) {
          console.error('Error rendering Mermaid diagram:', error)
          return marked.Renderer.prototype.code.call(this, { text, lang, escaped })
        }
      }
      return marked.Renderer.prototype.code.call(this, { text, lang, escaped })
    }
  }

  marked.use({ renderer, breaks: true })
  const markdownToParse = useGithubStyle
    ? markdown.replace(/^(\s*)(`{3,}|~{3,})[ \t]*diff[ \t]+([A-Za-z0-9_+-]+)[ \t]*$/gmi, '$1$2$3-diff')
    : markdown
  let html = marked.parse(markdownToParse).trim()

  // Custom replacements
  html = html.replace(/<a href="([^:\n]*?).md">/g, '<a href="$1.html">') // convertMdLinksToHtmlLinks
  html = html.replace(/<a href="([^:\n]*?).md#(.*?)">/g, '<a href="$1.html#$2">') // convertMdHashLinksToHtmlLinks
  if (useGithubStyle) {
    html = html.replace(/<(h[123456]) id="([^"]+)">([\s\S]*?)<\/\1>/g, `<$1 id="$2" class="heading-anchor"><a href="#$2" class="anchor-link" aria-label="Permalink">${anchorIcon}</a>$3</$1>`)
    html = html.replace(/<pre><code class="language-([^"]+)">([\s\S]*?)<\/code><\/pre>/g, (match, language, code) => {
      const isDiff = language === 'diff' || language.endsWith('-diff')
      if (!isDiff) return match

      const highlightedLanguage = language === 'diff' ? 'diff' : language.replace(/-diff$/, '')
      const lines = code.replace(/\n$/, '').split('\n').map(line => {
        const lineClass = line.startsWith('+')
          ? 'diff-add'
          : line.startsWith('-')
            ? 'diff-remove'
            : 'diff-neutral'
        return `<span class="diff-line ${lineClass}">${line}</span>`
      }).join('\n')

      return `<pre class="diff-block"><code class="language-${highlightedLanguage}">${lines}</code></pre>`
    })
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
