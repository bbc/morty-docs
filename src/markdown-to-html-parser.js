const showdown = require('showdown')

// there may be an option to enable this, but since we haven't found it here is a reg-ex
// to convert links within a file from *.md to *.html
const linkExtensionExtension = {
  type: 'output',
  regex: /<a href="(.*).md">/g,
  replace: '<a href="$1.html">'
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

const bindings = Object.keys(classMap)
  .map(key => ({
    type: 'output',
    regex: new RegExp(`<${key}(.*)>`, 'g'),
    replace: `<${key} class="${classMap[key]}" $1>`
  }))

const parser = new showdown.Converter({
  extensions: [linkExtensionExtension, headingExtension, ...bindings]
})

parser.setFlavor('github')

const parseToHTML = (markdown) => parser.makeHtml(markdown)

module.exports = parseToHTML
