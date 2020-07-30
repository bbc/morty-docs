const React = require('react')
const ReactDOMServer = require('react-dom/server')

const Header = require('./Components/Header')
const Footer = require('./Components/Footer')

const Styles = {
  wrapper: {
    minHeight: '75vh',
    paddingBottom: '20px'
  },
  html: {
    minHeight: '100vh'
  },
  body: {
    minHeight: '100vh'
  }
}

const MortyPage = ({ relPath, body }) => {
  return (
    <html lang='en' style={Styles.html}>
      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>{relPath}</title>
        <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossOrigin='anonymous' />
      </head>
      <body style={Styles.body}>
        <div style={Styles.wrapper}>
          <Header relPath={relPath} />
          <div className='container' dangerouslySetInnerHTML={{ __html: body }} />
        </div>
        <Footer />
      </body>
    </html>
  )
}

const renderMortyPage = (relPath, htmlBody) => ReactDOMServer.renderToString(
  <MortyPage relPath={relPath} body={htmlBody} />
)

module.exports = renderMortyPage
