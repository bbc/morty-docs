const showdown = require('showdown')

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

const alertExtension = {
  type: 'output',
  regex: /<blockquote>\s*<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](.*?)<\/p>\s*<\/blockquote>/gis,
  replace: function (_, type, innerHtml) {
    // Remove any initial <br /> after the first line
    const cleanContent = innerHtml
      .replace(/^\s*<br\s*\/?>\s*/i, '')
      .trim();

    // Turn <br /> into paragraph breaks
    const paragraphs = cleanContent
      .split(/<br\s*\/?>/i)
      .map(p => `<p dir="auto">${p.trim()}</p>`)
      .join('');

    return `<div class="markdown-alert markdown-alert-${type.toLowerCase()}" dir="auto">
      <p class="markdown-alert-title" dir="auto">
        <svg class="octicon octicon-info mr-2" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path>
        </svg>${type.charAt(0) + type.slice(1).toLowerCase()}
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
