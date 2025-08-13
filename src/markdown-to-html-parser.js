const showdown = require('showdown')
const alertIcons = require('./alert-icons.js')

// there may be an option to enable this, but since we haven't found it here is a reg-ex
// to convert links within a file from *.md to *.html
const convertMdLinksToHtmlLinks = {
  type: 'output',
  regex: /<a href="([^:\n]*?).md">/g,
  // exclude colon, so external links aren't converted
  replace: '<a href="$1.html">'
}

// Replace hash links with .html e.g. page.md#Title becomes page.html#Title.
const convertMdHashLinksToHtmlLinks = {
  type: 'output',
  regex: /<a href="([^:\n]*?).md#(.*?)">/g,
  // exclude colon, so external links aren't converted
  replace: '<a href="$1.html#$2">'
}

const headingExtension = {
  type: 'output',
  regex: /<(h[123456]) id="([^"]+)">(.*)<\/\1>/g,
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

// ✅ NEW: GitHub-style diff block extension
const diffBlockExtension = {
  type: 'output',
  regex: /<pre><code class="[^"]*(language-[^"]*diff|diff[^"]*language-[^"]*)[^"]*">([\s\S]*?)<\/code><\/pre>/g,
  replace: function(_, className, code) {
    const lines = code.split('\n').map(line => {
      if (line.startsWith('+')) {
        return `<span class="diff-add">${line}</span>`;
      } else if (line.startsWith('-')) {
        return `<span class="diff-remove">${line}</span>`;
      } else {
        return `<span class="diff-neutral">${line}</span>`;
      }
    }).join('\n');
    return `<pre class="diff-block"><code>${lines}</code></pre>`;
  }
};


// Github alerts output type extension
const alertExtension = {
  type: 'output',
  regex: /<blockquote>\s*<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](.*?)<\/p>\s*<\/blockquote>/gis,
  replace: function (_, type, innerHtml) {
    const cleanContent = innerHtml.replace(/^\s*<br\s*\/?>\s*/i, '').trim();
    const paragraphs = cleanContent
      .split(/<br\s*\/?>/i)
      .map(p => `<p dir="auto">${p.trim()}</p>`)
      .join('');
    const icon = alertIcons[type.toLowerCase()] || '';
    return `<div class="markdown-alert markdown-alert-${type.toLowerCase()}" dir="auto">
      <p class="markdown-alert-title" dir="auto">
        ${icon}${type.charAt(0) + type.slice(1).toLowerCase()}
      </p>
      ${paragraphs}
    </div>`;
  }
};


const createParser = (options) => {
  const basePath = normaliseBasePath(options.basePath)
  const addBasePathToRootLinks = {
    type: 'output',
    regex: /<a href="\/([^:\n]*)">/g, // exclude colon, so external links aren't converted
    replace: `<a href="${basePath}/$1">`
  }

  const addBasePathToLinkHrefs = {
    type: 'output',
    regex: /<link(.+)href="\/([^:\n]*)"(.*)\/>/g, // exclude colon, so external links aren't converted
    replace: `<link$1href="${basePath}/$2"$3/>`
  }

  const parser = new showdown.Converter({
    extensions: [
      convertMdLinksToHtmlLinks,
      convertMdHashLinksToHtmlLinks,
      addBasePathToRootLinks,
      addBasePathToLinkHrefs,
      headingExtension,
      diffBlockExtension,
      alertExtension,
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
