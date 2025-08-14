const React = require('react')
const ReactDOMServer = require('react-dom/server')

const Header = require('./Components/Header')
const Footer = require('./Components/Footer')
const Reset = require('./Components/Reset')

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
  line-height: 1; 
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


.diff-block .diff-add {
  background-color: #e6ffed;
  display: block;
  white-space: pre;
}

.diff-block .diff-remove {
  background-color: #ffeef0;
  display: block;
  white-space: pre;
}

.diff-block .diff-neutral {
  display: block;
  white-space: pre;
}

.markdown-alert {
  padding: 0.5rem 1rem;
  margin-bottom: 16px;
  border-left: 0.25em solid;
  border-radius: 6px;
  background-color: var(--alert-bg, #f6f8fa);
}

.markdown-alert p {
  margin: 0.5em 0;
}

.markdown-alert-title {
  font-weight: 600;
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
  color: normal !important;
}

.markdown-alert-title svg {
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.markdown-alert-note {
  border-color: #0969da;
  --alert-bg: #ddf4ff;
}

.markdown-alert-tip {
  border-color: #1a7f37;
  --alert-bg: #dafbe1;
}

.markdown-alert-important {
  border-color: #8250df;
  --alert-bg: #fbefff;
}

.markdown-alert-warning {
  border-color: #9a6700;
  --alert-bg: #fff8c5;
}

.markdown-alert-caution {
  border-color: #cf222e;
  --alert-bg: #ffebe9;
}

/* Light mode colors for alerts */
.markdown-alert-note    { color: #0969da; }
.markdown-alert-tip     { color: #1a7f37; }
.markdown-alert-important { color: #8250df; }
.markdown-alert-warning { color: #9a6700; }
.markdown-alert-caution { color: #d1242f; }

.heading-anchor {
  position: relative;
}

/* Position the icon absolutely so it doesn't push text */
.heading-anchor .anchor-link {
  position: absolute;
  left: -24px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.15s ease-in-out;
  color: #000; /* force black */
  text-decoration: none;
}

.anchor-icon {
  display: block;
  width: 16px;
  height: 16px;
  fill: currentColor;
}

/* Show icon only when hovering over the heading */
.heading-anchor:hover .anchor-link {
  opacity: 1;
}


`

const MortyPage = ({ relPath, body, options }) => {
  return (
    <html lang='en' style={Styles.html}>
      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>{relPath}</title>
        <Reset />
        <style dangerouslySetInnerHTML={{ __html: contentStyles }} />
      </head>
      <body style={Styles.body}>
        <div style={Styles.wrapper}>
          <Header relPath={relPath} basePath={options.basePath} />
          <div className='content' dangerouslySetInnerHTML={{ __html: body }} />
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
