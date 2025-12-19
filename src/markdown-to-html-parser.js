// const showdown = require('showdown')
const { marked } = require('marked')
const emoji = require('node-emoji')

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
      const textString = this.parser.parseInline(tokens[0].tokens)
      const alertMatch = textString.match(/\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]/i)

      if (!alertMatch) return `<blockquote>${textString}</blockquote>`

      const type = alertMatch[1].toLowerCase()
      let content = textString.replace(/\[![A-Z]+\]/i, '')
      content = content.replace(/^<br>/, '')
      const title = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
      return `<blockquote class="markdown-alert markdown-alert-${type}"><p><strong>${title}</strong></p><p>${content}</p></blockquote>`
    }
  }

  marked.use({ renderer, breaks: true })
  let html = marked.parse(markdown).trim()

  // Custom replacements
  html = html.replace(/<a href="([^:\n]*?).md">/g, '<a href="$1.html">') // convertMdLinksToHtmlLinks
  html = html.replace(/<a href="([^:\n]*?).md#(.*?)">/g, '<a href="$1.html#$2">') // convertMdHashLinksToHtmlLinks
  html = html.replace(/<(h[123456]) id="([^"]+)">(.*)<\/\1>/g, '<$1 id="$2"><a href="#$2">$3</a></$1>') // headingExtension
  html = html.replace(/<table(.*)>/g, '<table class="table" $1>') // add class to table tags
  html = html.replace(/<img(.*)>/g, '<img class="img-responsive" $1 />') // add class to image tags
  html = html.replace(/<li>(<input.*)<\/li>/g, '<li class="task-list-item">$1</li>') // add class for list items (must have input at beginning)
  html = html.replace(/<a href="\/([^:\n]*)">/g, `<a href="${basePath}/$1">`) // addBasePathToRootLinks
  html = html.replace(/<link(.+)href="\/([^:\n]*)"(.*)\/>/g, `<link$1href="${basePath}/$2"$3/>`) // addBasePathToLinkHrefs

  const withEmoji = emoji.emojify(html) // convert emoji shortcodes to unicode e.g. :warning:

  return withEmoji
}

module.exports = parseToHTML
