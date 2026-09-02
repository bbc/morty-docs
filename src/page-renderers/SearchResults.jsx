const React = require('react')
const ReactDOMServer = require('react-dom/server')

const Header = require('./Components/Header')
const Title = require('./Components/Title')
const Footer = require('./Components/Footer')
const Reset = require('./Components/Reset')

const resultsStyle = `
  .results {
    margin-top: 10px;
    max-width: 1200px;
    margin: auto;
    padding: 0 20px;
  }

  .results a {
    color: #337ab7;
    text-decoration: none;
  }

  .results > ul {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }

  .results > ul > li {
    display: flex;
    flex-direction: column;
    gap: 0.9em;
    padding-top: 0.5em;
    border-top: 1px solid #ccc;
  }

  .results > ul > li > a {
    font-size: 1.5em;
  }

  .results > ul > li > .preview {
    max-height: 300px;
    height: 300px;
    width: 90%;
    align-self: flex-end;
    padding: 0 20px;
    overflow: hidden;
    background: #fff;
    border: 1px solid #ccc;
    position: relative;
  }

  .results > ul > li > .preview > iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  .results > ul > li > .preview:before {
    content: '';
    background-color: hotpink;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: .1;
  }
`

const Styles = {
  headingContainer: {
    padding: '40px 15px',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '1.9em',
    marginTop: '0.5em'
  },
  logo: {
    maxWidth: '100%'
  },
  mortyLogo: {
    maxWidth: '45%'
  },
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

const SearchResultsPage = ({ options, relPath }) => {
  return (
    <html lang='en' style={Styles.html}>
      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />

        <title>Search Results</title>
        <Reset />
        <style dangerouslySetInnerHTML={{ __html: resultsStyle }} />
      </head>
      <body style={Styles.body}>
        <script>{`window.__MORTY_OPTIONS = { basePath: '${options.basePath}' };`}</script>
        <script src={`/${options.basePath}/flexsearch.bundle.min.js`} />
        <div style={Styles.wrapper}>
          <Header relPath={relPath} basePath={options.basePath} />
          <div style={{ marginTop: '10px' }}>
            <Title contentTitle='Search Results' />
            <div className='results'>
              <ul id='search-results-list' />
            </div>
          </div>
        </div>
        <script src={`/${options.basePath}/search-results.js`} type='module' />
        <Footer />
      </body>
    </html>
  )
}

const renderSearchResultsPage = (options, relPath) =>
  ReactDOMServer.renderToString(
    <SearchResultsPage options={options} relPath={relPath} />
  )

module.exports = renderSearchResultsPage
