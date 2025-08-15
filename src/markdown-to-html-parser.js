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
  regex: /<(h[1-6]) id="([^"]+)">(.*?)<\/\1>/g,
  replace: (_match, tag, id, text) => {
    const iconSvg = `
<svg class="anchor-icon" aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
  <path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 
           4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 
           .751.751 0 0 1 .018-1.042.751.751 0 0 1 
           1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5
           a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25
           a.751.751 0 0 1-1.042-.018.751.751 0 0 1
           -.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 
           2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018
           .751.751 0 0 1 .018 1.042l-1.25 1.25
           a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5
           a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1
           -.018 1.042.751.751 0 0 1-1.042.018
           1.998 1.998 0 0 0-2.83 0l-2.5 2.5
           a1.998 1.998 0 0 0 0 2.83Z"></path>
</svg>`;
    return `<${tag} id="${id}" class="heading-anchor">
      <a href="#${id}" class="anchor-link" aria-label="Permalink">${iconSvg}</a>
      ${text}
    </${tag}>`;
  }
};

const codeBlockExtension = {
  type: 'output',
  regex: /<pre><code class="language-([^"]+)">([\s\S]*?)<\/code><\/pre>/g,
  replace: (match, lang, code) => {
    const langs = lang.split(/\s+/); // split "diff yaml" into ["diff","yaml"]
    const primaryLang = langs.find(l => l !== 'diff') || langs[0];
    const isDiff = langs.includes('diff');

    // GitHub-compatible final class
    const finalLangClass = isDiff ? `diff-${primaryLang}` : primaryLang;

    return `<pre><code class="language-${finalLangClass}">${code}</code></pre>`;
  }
};

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

// 1) MD pre-pass: make the fence parsable by Showdown
const diffFencePre = {
  type: 'lang',
  // ```diff yaml   ->   ```yaml-diff
  // allow extra spaces, be case-insensitive
  regex: /^```[ \t]*diff[ \t]+([A-Za-z0-9_+-]+)[ \t]*$/gmi,
  replace: (m, sublang) => '```' + sublang + '-diff'
};

// 2) HTML post-pass: convert language-<lang>-diff into diff-block + wrappers
const diffBlockPost = {
  type: 'output',
  regex: /<pre><code class="([^"]*)">([\s\S]*?)<\/code><\/pre>/g,
  replace: (_, classes, raw) => {
    let isDiff = /-diff\b/.test(classes) || /\blanguage-diff\b/.test(classes);
    if (!isDiff) return `<pre><code class="${classes}">${raw}</code></pre>`;

    // determine primary language
    let langMatch = classes.match(/([a-z0-9_+-]+)-diff\b/i);
    const lang = langMatch ? langMatch[1] : 'diff';

    // normalize classes: keep other classes but remove '-diff'
    const finalClasses = classes.replace(/-diff\b/, '');

    // wrap each line
    const wrapped = raw.split(/\r?\n/).map(line => {
      if (line.startsWith('+')) return `<span class="diff-add">${line}</span>`;
      if (line.startsWith('-')) return `<span class="diff-remove">${line}</span>`;
      return `<span class="diff-neutral">${line}</span>`;
    }).join('\n');

    return `<pre class="diff-block"><code class="${finalClasses}">${wrapped}</code></pre>`;
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
    sanitize: true,
    extensions: [
      diffFencePre,
      convertMdLinksToHtmlLinks,
      convertMdHashLinksToHtmlLinks,
      addBasePathToRootLinks,
      addBasePathToLinkHrefs,
      headingExtension,
      diffBlockPost,
      alertExtension,
      ...bindings
    ]
  })
  parser.setFlavor('github')
  return parser
}


const parseToHTML = (markdown, options = {}) => {
  const parser = createParser(options);
  return parser.makeHtml(markdown);
};

module.exports = parseToHTML
