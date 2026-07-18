const React = require('react')
const ReactDOMServer = require('react-dom/server')

const Header = require('./Components/Header')
const Title = require('./Components/Title')
const Footer = require('./Components/Footer')
const IndexListItem = require('./Components/IndexListItem')
const GithubTheme = require('./Components/GithubTheme')
const Reset = require('./Components/Reset')
const usesGithubMarkdownStyle = require('../helpers/uses-github-markdown-style')

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
  },
  listContainer: {
    marginTop: '10px',
    maxWidth: '600px',
    margin: 'auto'
  }
}

const IndexPage = ({ listItems, options, relPath }) => {
  const useGithubStyle = usesGithubMarkdownStyle(options)
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

        <title>Morty Docs</title>
        <Reset />
        {useGithubStyle && <GithubTheme />}
      </head>
      <body className={useGithubStyle ? 'theme-github' : undefined} style={bodyStyles}>
        <div style={Styles.wrapper}>
          <Header relPath={relPath} basePath={options.basePath} />
          <div style={{ marginTop: '10px' }}>
            <Title contentTitle={options.contentTitle} />
            <div style={Styles.listContainer}>
              <ul>
                {
                  (() => listItems.map((item, index) => <IndexListItem key={index} {...item} useGithubStyle={useGithubStyle} />))()
                }
              </ul>

            </div>
          </div>
        </div>
        <Footer useGithubStyle={useGithubStyle} />
      </body>
    </html>
  )
}

const renderIndexPage = (listItems, options, htmlFilePaths) => ReactDOMServer.renderToString(<IndexPage listItems={listItems} options={options} relPath={htmlFilePaths} />)

module.exports = renderIndexPage
