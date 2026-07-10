const React = require('react')
const ReactDOMServer = require('react-dom/server')

const Header = require('./Components/Header')
const Footer = require('./Components/Footer')
const Reset = require('./Components/Reset')
const usesGithubMarkdownStyle = require('../helpers/uses-github-markdown-style')

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

const contentStyles = `
.content {
  padding: 20px 96px;
  line-height: 1.42857143;
  max-width: 960px;
  margin: 0 auto;
}

.content a {
  color: #337ab7;
  text-decoration: none;
}

.content h1 {
  font-size: 2.2rem;
  font-weight: 500;
  margin-top: 20px;
  margin-bottom: 10px;
}

.content h2 {
  font-size: 1.8rem;
  font-weight: 500;
  margin-top: 20px;
  margin-bottom: 10px;
}

.content h3 {
  font-size: 1.5rem;
  font-weight: 500;
  margin-top: 20px;
  margin-bottom: 10px;
}

.content ul {
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  padding-inline-start: 40px;
  margin-bottom: 10px;
}

.content ol {
  list-style-type: decimal;
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  padding-inline-start: 40px;
}

.content ul li.task-list-item {
  list-style-type: none;
}

.content p {
  margin-bottom: 10px;
}

.content img {
  display: block;
  max-width: 100%;
  height: auto;
  vertical-align: middle;
}

.content strong {
  font-weight: 700;
}

.content em {
  font-style: italic;
}

.content blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
}
.content blockquote.markdown-alert-note{ border-left: 5px solid #0A67D8; }
.content blockquote.markdown-alert-warning{ border-left: 5px solid #9D6800; }
.content blockquote.markdown-alert-important{ border-left: 5px solid #7F50DD; }
.content blockquote.markdown-alert-tip{ border-left: 5px solid #187E32; }
.content blockquote.markdown-alert-caution{ border-left: 5px solid #CE2228; }

.content blockquote.markdown-alert-note p:first-child strong { color: #0A67D8; }
.content blockquote.markdown-alert-warning p:first-child strong { color: #9D6800; }
.content blockquote.markdown-alert-important p:first-child strong { color: #7F50DD; }
.content blockquote.markdown-alert-tip p:first-child strong { color: #187E32; }
.content blockquote.markdown-alert-caution p:first-child strong { color: #CE2228; }


.content blockquote p:last-child {
    margin-bottom: 0;
}

.content hr {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 0;
  border-top: 1px solid #949494;
}

.content pre {
  display: block;
  padding: 9.5px;
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.42857143;
  color: #333;
  word-break: break-all;
  word-wrap: break-word;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.content code {
  font-family: Menlo,Monaco,Consolas,"Courier New",monospace;
}

.content pre code {
  padding: 0;
  font-size: inherit;
  color: inherit;
  white-space: pre-wrap;
  background-color: transparent;
  border-radius: 0;
}

.content :not(pre) code {
  padding: 2px 4px;
  font-size: 90%;
  color: #c7254e;
  background-color: #f9f2f4;
  border-radius: 4px;
}

.content table {
  background-color: transparent;
  border-spacing: 0;
  border-collapse: collapse;
  width: 100%;
  max-width: 100%;
  margin-bottom: 20px;
}

.content th {
  text-align: left;
  vertical-align: bottom;
  border-bottom: 2px solid #ddd;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 8px;
  line-height: 1.42857143;
}

.content td {
  padding: 8px;
  line-height: 1.42857143;
  vertical-align: top;
  border-top: 1px solid #ddd;
}

.content .mermaid {
  visibility: hidden;
  position: relative;

  &:before {
    content: 'Rendering diagram...';
    visibility: visible;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  &[data-processed] {
    visibility: visible;

    &:before {
      display: none;
    }
  }
}

`

const githubContentStyles = `
.content-github pre {
  line-height: 1.4;
  overflow-x: auto;
  tab-size: 2;
  white-space: pre;
  word-break: normal;
  word-wrap: normal;
}

.content-github pre code {
  display: block;
  white-space: pre;
}

.content-github :not(pre) code {
  color: #24292f;
  background-color: #eff1f3;
}

.content-github a code {
  color: #337ab7;
}

.content-github .diff-line {
  display: block;
  min-height: 1.4em;
  margin: 0 -9.5px;
  padding: 0 9.5px;
  white-space: pre;
}

.content-github .diff-add {
  background-color: #dafbe1;
}

.content-github .diff-remove {
  background-color: #ffebe9;
}

.content-github blockquote.markdown-alert {
  padding: 8px 16px;
  font-size: inherit;
  color: inherit;
  background-color: var(--alert-background);
  border-left: 4px solid var(--alert-colour);
}

.content-github .markdown-alert-title {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 4px;
  font-weight: 600;
  color: var(--alert-colour);
}

.content-github .markdown-alert-title svg {
  flex-shrink: 0;
}

.content-github .markdown-alert-note { --alert-colour: #0969da; --alert-background: #ddf4ff; }
.content-github .markdown-alert-tip { --alert-colour: #1a7f37; --alert-background: #dafbe1; }
.content-github .markdown-alert-important { --alert-colour: #8250df; --alert-background: #fbefff; }
.content-github .markdown-alert-warning { --alert-colour: #9a6700; --alert-background: #fff8c5; }
.content-github .markdown-alert-caution { --alert-colour: #cf222e; --alert-background: #ffebe9; }

.content-github .heading-anchor {
  position: relative;
}

.content-github .anchor-link {
  position: absolute;
  top: 50%;
  left: -24px;
  color: inherit;
  opacity: 0;
  transform: translateY(-50%);
}

.content-github .heading-anchor:hover .anchor-link,
.content-github .anchor-link:focus {
  opacity: 1;
}

.content-github .anchor-icon {
  display: block;
  width: 16px;
  height: 16px;
  fill: currentColor;
}

@media (max-width: 720px) {
  .content-github {
    padding-right: 32px;
    padding-left: 32px;
  }
}
`

const highlightScript = `
(function () {
  function languageFor(code) {
    var className = Array.from(code.classList).find(function (name) {
      return name.indexOf('language-') === 0;
    });
    return className ? className.replace('language-', '') : '';
  }

  window.addEventListener('DOMContentLoaded', function () {
    if (!window.hljs) return;

    document.querySelectorAll('.content-github pre:not(.diff-block) code[class*="language-"]').forEach(function (code) {
      window.hljs.highlightElement(code);
    });

    document.querySelectorAll('.content-github .diff-block code').forEach(function (code) {
      var language = languageFor(code);
      code.querySelectorAll('.diff-line').forEach(function (line) {
        var source = line.textContent;
        var prefix = /^[+-]/.test(source) ? source.charAt(0) : '';
        var value = prefix ? source.slice(1) : source;

        if (language && language !== 'diff' && window.hljs.getLanguage(language)) {
          value = window.hljs.highlight(value, { language: language, ignoreIllegals: true }).value;
          line.innerHTML = prefix + value;
        }
      });
    });
  });
})();
`

const MortyPage = ({ relPath, body, options }) => {
  const useGithubStyle = usesGithubMarkdownStyle(options)

  return (
    <html lang='en' style={Styles.html}>
      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>{relPath}</title>
        <Reset />
        <style dangerouslySetInnerHTML={{ __html: contentStyles }} />
        {useGithubStyle && <style dangerouslySetInnerHTML={{ __html: githubContentStyles }} />}
        {useGithubStyle && <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.9.0/styles/github.min.css' />}
        {useGithubStyle && <script defer src='https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.9.0/highlight.min.js' />}
        {useGithubStyle && <script dangerouslySetInnerHTML={{ __html: highlightScript }} />}
      </head>
      <body style={Styles.body}>
        <div style={Styles.wrapper}>
          <Header relPath={relPath} basePath={options.basePath} />
          <div className={useGithubStyle ? 'content content-github' : 'content'} dangerouslySetInnerHTML={{ __html: body }} />
        </div>
        <Footer />
      </body>
    </html>
  )
}

const renderMortyPage = (relPath, htmlBody, options) => ReactDOMServer.renderToString(
  <MortyPage relPath={relPath} body={htmlBody} options={options} />
)

module.exports = renderMortyPage
