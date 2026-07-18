const React = require('react')
const ReactDOMServer = require('react-dom/server')

const Header = require('./Components/Header')
const Footer = require('./Components/Footer')
const GithubTheme = require('./Components/GithubTheme')
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
.content-github {
  color: var(--morty-page-fg);
}

.content-github a {
  color: var(--morty-link-fg);
}

.content-github hr {
  border-top-color: var(--morty-border);
}

.content-github pre {
  line-height: 1.4;
  overflow-x: auto;
  tab-size: 2;
  white-space: pre;
  word-break: normal;
  word-wrap: normal;
  color: var(--morty-page-fg);
  background-color: var(--morty-surface);
  border-color: var(--morty-border);
}

.content-github pre code {
  display: block;
  white-space: pre;
}

.content-github :not(pre) code {
  color: var(--morty-page-fg);
  background-color: var(--morty-inline-code-bg);
}

.content-github a code {
  color: var(--morty-link-fg);
}

.content-github blockquote:not(.markdown-alert) {
  color: var(--morty-muted-fg);
  border-left-color: var(--morty-border);
}

.content-github th,
.content-github td {
  border-color: var(--morty-border);
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

.content-github .markdown-alert-note { --alert-colour: var(--morty-alert-note-fg); --alert-background: var(--morty-alert-note-bg); }
.content-github .markdown-alert-tip { --alert-colour: var(--morty-alert-tip-fg); --alert-background: var(--morty-alert-tip-bg); }
.content-github .markdown-alert-important { --alert-colour: var(--morty-alert-important-fg); --alert-background: var(--morty-alert-important-bg); }
.content-github .markdown-alert-warning { --alert-colour: var(--morty-alert-warning-fg); --alert-background: var(--morty-alert-warning-bg); }
.content-github .markdown-alert-caution { --alert-colour: var(--morty-alert-caution-fg); --alert-background: var(--morty-alert-caution-bg); }

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

// Highlight.js 11.9.0 GitHub theme. The dependency is BSD-3-Clause licensed.
const highlightStyles = `
.content .diff-block {
  overflow-x: auto;
  word-break: normal;
  word-wrap: normal;
}

.content .diff-line {
  display: block;
  min-height: 1.4em;
  margin: 0 -9.5px;
  padding: 0 9.5px;
  white-space: pre;
}

.content .diff-add {
  background-color: var(--morty-diff-add-bg, #dafbe1);
}

.content .diff-remove {
  background-color: var(--morty-diff-remove-bg, #ffebe9);
}

.content-github pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em;
}

.content-github code.hljs {
  padding: 3px 5px;
}

.hljs {
  color: var(--morty-hljs-fg, #24292e);
  background: var(--morty-hljs-bg, #ffffff);
}

.hljs-doctag,
.hljs-keyword,
.hljs-meta .hljs-keyword,
.hljs-template-tag,
.hljs-template-variable,
.hljs-type,
.hljs-variable.language_ {
  color: var(--morty-hljs-keyword, #d73a49);
}

.hljs-title,
.hljs-title.class_,
.hljs-title.class_.inherited__,
.hljs-title.function_ {
  color: var(--morty-hljs-entity, #6f42c1);
}

.hljs-attr,
.hljs-attribute,
.hljs-literal,
.hljs-meta,
.hljs-number,
.hljs-operator,
.hljs-variable,
.hljs-selector-attr,
.hljs-selector-class,
.hljs-selector-id {
  color: var(--morty-hljs-constant, #005cc5);
}

.hljs-regexp,
.hljs-string,
.hljs-meta .hljs-string {
  color: var(--morty-hljs-string, #032f62);
}

.hljs-built_in,
.hljs-symbol {
  color: var(--morty-hljs-variable, #e36209);
}

.hljs-comment,
.hljs-code,
.hljs-formula {
  color: var(--morty-hljs-comment, #6a737d);
}

.hljs-name,
.hljs-quote,
.hljs-selector-tag,
.hljs-selector-pseudo {
  color: var(--morty-hljs-tag, #22863a);
}

.hljs-subst {
  color: var(--morty-hljs-fg, #24292e);
}

.hljs-section {
  color: var(--morty-hljs-section, #005cc5);
  font-weight: bold;
}

.hljs-bullet {
  color: var(--morty-hljs-bullet, #735c0f);
}

.hljs-emphasis {
  color: var(--morty-hljs-fg, #24292e);
  font-style: italic;
}

.hljs-strong {
  color: var(--morty-hljs-fg, #24292e);
  font-weight: bold;
}

.hljs-addition {
  color: var(--morty-hljs-addition-fg, #22863a);
  background-color: var(--morty-hljs-addition-bg, #f0fff4);
}

.hljs-deletion {
  color: var(--morty-hljs-deletion-fg, #b31d28);
  background-color: var(--morty-hljs-deletion-bg, #ffeef0);
}
`

const MortyPage = ({ relPath, body, options }) => {
  const useGithubStyle = usesGithubMarkdownStyle(options)
  const useHighlightStyles = typeof body === 'string' && (body.includes(' hljs"') || body.includes('class="diff-block"'))
  const bodyStyles = useGithubStyle
    ? { ...Styles.body, color: 'var(--morty-page-fg)', backgroundColor: 'var(--morty-page-bg)' }
    : Styles.body

  return (
    <html lang='en' style={Styles.html}>
      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        {useGithubStyle && <meta name='color-scheme' content='light dark' />}
        <title>{relPath}</title>
        <Reset />
        {useGithubStyle && <GithubTheme />}
        <style dangerouslySetInnerHTML={{ __html: contentStyles }} />
        {useGithubStyle && <style dangerouslySetInnerHTML={{ __html: githubContentStyles }} />}
        {useHighlightStyles && <style dangerouslySetInnerHTML={{ __html: highlightStyles }} />}
      </head>
      <body className={useGithubStyle ? 'theme-github' : undefined} style={bodyStyles}>
        <div style={Styles.wrapper}>
          <Header relPath={relPath} basePath={options.basePath} />
          <div className={useGithubStyle ? 'content content-github' : 'content'} dangerouslySetInnerHTML={{ __html: body }} />
        </div>
        <Footer useGithubStyle={useGithubStyle} />
      </body>
    </html>
  )
}

const renderMortyPage = (relPath, htmlBody, options) => ReactDOMServer.renderToString(
  <MortyPage relPath={relPath} body={htmlBody} options={options} />
)

module.exports = renderMortyPage
