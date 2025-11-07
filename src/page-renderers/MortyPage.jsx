// Core React modules for server-side rendering
const React = require('react')
const ReactDOMServer = require('react-dom/server')

// Page components
const Header = require('./Components/Header')
const Footer = require('./Components/Footer')
const Reset = require('./Components/Reset')

// Inline styles for key layout elements
const Styles = {
  wrapper: {
    minHeight: '75vh',
    paddingBottom: '20px'
  },
  html: {
    minHeight: '100vh',
    fontSize: '16px'
  },
  body: {
    minHeight: '100vh',
    fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
    color: '#333',
    backgroundColor: '#fff'
  }
}

// CSS for the main content area (typography, links, code blocks, tables, etc.)
const contentStyles = `
.content {
  padding: 20px 96px;
  line-height: 1.42857143;
  max-width: 960px;
  margin: 0 auto;
}

.content a { color: #337ab7; text-decoration: none; }

.content h1 { font-size: 2.2rem; font-weight: 500; margin: 20px 0 10px; }
.content h2 { font-size: 1.8rem; font-weight: 500; margin: 20px 0 10px; }
.content h3 { font-size: 1.5rem; font-weight: 500; margin: 20px 0 10px; }

.content ul {
  display: block; list-style-type: disc;
  margin-block-start: 1em; margin-block-end: 1em;
  padding-inline-start: 40px; margin-bottom: 10px;
}
.content ol {
  list-style-type: decimal; display: block;
  margin-block-start: 1em; margin-block-end: 1em;
  padding-inline-start: 40px;
}

.content p { margin-bottom: 10px; }

.content img { display: block; max-width: 100%; height: auto; vertical-align: middle; }
.content strong { font-weight: 700; }
.content em { font-style: italic; }

.content blockquote {
  padding: 10px 20px; margin: 0 0 20px; font-size: 17.5px; border-left: 5px solid #eee;
}
.content blockquote p:last-child { margin-bottom: 0; }

.content hr { margin: 20px 0; border: 0; border-top: 1px solid #949494; }

/* ---- Code blocks / inline code ---- */
.content pre {
  display: block;
  padding: 9.5px;
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.4;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;

  white-space: pre;
  word-break: normal;
  word-wrap: normal;
  overflow-x: auto;
  tab-size: 2;
}
.content code { font-family: Menlo,Monaco,Consolas,"Courier New",monospace; }
.content pre code {
  padding: 0;
  font-size: inherit;
  background-color: transparent;
  border-radius: 0;
  display: block;
}
.content pre code:not(.hljs) { color: #333; } /* fallback before hljs runs */

/* Inline code: neutral unless hljs has themed it */
.content :not(pre) code {
  padding: 2px 4px;
  font-size: 90%;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  border-radius: 4px;
}

/* Default colour/background only if hljs hasn't themed it */
/* The colors of this were wierd before, now they are standard */
.content :not(pre) code:not([class*="language-"]) {
  color: #222222;
  background-color: #F1F1F1;
}

/* Links inside inline code: use link colour */
.content a code {
  color: 337AB7 !important; /* let link be a link colour */
}

/* ---- Tables ---- */
.content table {
  background-color: transparent;
  border-spacing: 0;
  border-collapse: collapse;
  width: 100%;
  max-width: 100%;
  margin-bottom: 20px;
}
.content th {
  text-align: left; vertical-align: bottom; border-bottom: 2px solid #ddd;
  font-weight: bold; font-size: 1.2rem; padding: 8px; line-height: 1.42857143;
}
.content td {
  padding: 8px; line-height: 1.42857143; vertical-align: top; border-top: 1px solid #ddd;
}

/* ---- Diff block ---- */
.diff-block .diff-add { background-color: #e6ffed; display: block; white-space: pre; }
.diff-block .diff-remove { background-color: #ffeef0; display: block; white-space: pre; }
.diff-block .diff-neutral { display: block; white-space: pre; }

/* ---- Alerts ---- */
.markdown-alert { padding: .5rem 1rem; margin-bottom: 16px; border-left: .25em solid; border-radius: 6px; background-color: var(--alert-bg, #f6f8fa);}
.markdown-alert p { margin: .5em 0; }
.markdown-alert-title { font-weight: 600; display: flex; align-items: center; margin-bottom: .25rem; color: normal !important; }
.markdown-alert-title svg { margin-right: .5rem; flex-shrink: 0; }

.markdown-alert-note { border-color: #0969da; --alert-bg: #ddf4ff; }
.markdown-alert-tip { border-color: #1a7f37; --alert-bg: #dafbe1; }
.markdown-alert-important { border-color: #8250df; --alert-bg: #fbefff; }
.markdown-alert-warning { border-color: #9a6700; --alert-bg: #fff8c5; }
.markdown-alert-caution { border-color: #cf222e; --alert-bg: #ffebe9; }

.markdown-alert-note    { color: #0969da; }
.markdown-alert-tip     { color: #1a7f37; }
.markdown-alert-important { color: #8250df; }
.markdown-alert-warning { color: #9a6700; }
.markdown-alert-caution { color: #d1242f; }

/* ---- Anchor links ---- */
.heading-anchor { position: relative; }
.heading-anchor .anchor-link {
  position: absolute; left: -24px; top: 50%; transform: translateY(-50%);
  opacity: 0; transition: opacity .15s ease-in-out; color: #000; text-decoration: none;
}
.anchor-icon { display: block; width: 16px; height: 16px; fill: currentColor; }
.heading-anchor:hover .anchor-link { opacity: 1; }
`

// HTML document component
const MortyPage = ({ relPath, body, options }) => {
  return (
    <html lang='en' style={Styles.html}>
      <head>
        {/* Meta tags and title */}
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>{relPath}</title>

        {/* Reset styles and content CSS */}
        <Reset />
        <style dangerouslySetInnerHTML={{ __html: contentStyles }} />

        {/* Highlight.js theme and core script */}
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.9.0/styles/github.min.css'
        />
        <script
          defer
          src='https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.9.0/highlight.min.js'
        />

        {/* Script to load extra languages and apply syntax highlighting */}
        <script
          defer
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  function normalizeLanguageClasses(el) {
    // Ensure all code blocks have a "language-..." class
    for (const cls of Array.from(el.classList)) {
      if (!cls.startsWith('language-') && /^[a-z0-9_+-]+$/i.test(cls)) {
        el.classList.add('language-' + cls.toLowerCase());
      }
    }
  }

  function collectRequestedLanguages() {
    // Gather unique languages used in the document
    const set = new Set();
    document.querySelectorAll('pre code').forEach(function (el) {
      normalizeLanguageClasses(el);
      const classes = Array.from(el.classList);
      const langClass = classes.find(c => c.startsWith('language-'));
      if (!langClass) return;
      let name = langClass.replace(/^language-/, '').toLowerCase();
      name = name.replace(/-diff$/, '').replace(/^diff-/, '');
      if (name && name !== 'diff') set.add(name);
    });
    return Array.from(set);
  }

  function loadLanguage(name) {
    // Dynamically load a highlight.js language pack
    return new Promise(function (resolve) {
      if (window.hljs && window.hljs.getLanguage && window.hljs.getLanguage(name)) {
        return resolve();
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.9.0/languages/' + name + '.min.js';
      script.async = true;
      script.onload = function () { resolve(); };
      script.onerror = function () { resolve(); };
      document.head.appendChild(script);
    });
  }

  function highlightAll() {
    // Apply syntax highlighting to all code blocks
    if (!window.hljs) return;
    if (window.hljs.configure) {
      window.hljs.configure({ ignoreUnescapedHTML: true });
    }
    document.querySelectorAll('pre code').forEach(function (el) {
      try { window.hljs.highlightElement(el); } catch (e) {}
    });
  }

  window.addEventListener('DOMContentLoaded', function () {
    if (!window.hljs) return;
    const langs = collectRequestedLanguages();
    Promise.all(langs.map(loadLanguage)).then(highlightAll);
  });
})();
            `
          }}
        />
      </head>
      <body style={Styles.body}>
        <div style={Styles.wrapper}>
          <Header relPath={relPath} basePath={options.basePath} />
          {/* Render markdown HTML – ensure it is sanitised if untrusted */}
          <div className='content' dangerouslySetInnerHTML={{ __html: body }} />
        </div>
        <Footer />
      </body>
    </html>
  )
}

// Render to a full HTML string
const renderMortyPage = (relPath, htmlBody, options) =>
  ReactDOMServer.renderToString(
    <MortyPage relPath={relPath} body={htmlBody} options={options} />
  )

module.exports = renderMortyPage
