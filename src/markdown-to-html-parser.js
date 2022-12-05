const showdown = require('showdown')

// there may be an option to enable this, but since we haven't found it here is a reg-ex
// to convert links within a file from *.md to *.html
const convertMdLinksToHtmlLinks = {
  type: 'output',
  regex: /href="([^:\n]*?).md"/g,
  // exclude colon, so external links aren't converted
  replace: 'href="$1.html"'
}

const headingExtension = {
  type: 'output',
  regex: /<(h[123456]) id="(.*)">(.*)<\/\1>/g,
  replace: '<$1 id="$2"><a href="#$2">$3</a></$1>'
}

const classMap = {
  img: 'img-responsive',
  table: 'table'
}

const bindings = Object.keys(classMap).map((key) => ({
  type: 'output',
  regex: new RegExp(`<${key}(.*)>`, 'g'),
  replace: `<${key} class="${classMap[key]}" $1>`
}))

const normaliseBasePath = (basePath) => {
  const pathElements = (basePath || '').split('/')
    .filter((entry) => Boolean(entry))

  if (pathElements.length === 0) {
    return ''
  }

  return '/' + pathElements.join('/')
}

const createParser = (options) => {
  const basePath = normaliseBasePath(options.basePath)
  const addBasePathToRootLinks = {
    type: 'output',
    regex: /<a href="\/([^:\n]*)">/g, // exclude colon, so external links aren't converted
    replace: `<a href="${basePath}/$1">`
  }

  const parser = new showdown.Converter({
    extensions: [
      convertMdLinksToHtmlLinks,
      addBasePathToRootLinks,
      headingExtension,
      ...bindings
    ]
  })
  parser.setFlavor('github')
  return parser
}

const parseToHTML = (markdown, options = {}) => {
  const parser = createParser(options)
  return parser.makeHtml(markdown)
}

module.exports = parseToHTML
