const React = require('react')
const ReactDOMServer = require('react-dom/server')

const Header = require('./Components/Header')
const Footer = require('./Components/Footer')
const IndexListItem = require('./Components/IndexListItem')

const Styles = {
  headingContainer: {
    padding: '40px 15px',
    textAlign: 'center'
  },

  heading: {
    fontSize: '32px'
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
    minHeight: '100vh'
  },
  body: {
    minHeight: '100vh'
  }
}

const IndexPage = ({ listItems, contentTitle }) => (
  <html lang='en' style={Styles.html}>
    <head>
      <meta charSet='utf-8' />
      <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />

      <title>{`Morty Docs`}</title>
      <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossOrigin='anonymous' />
      <link rel='stylesheet' href='https://use.fontawesome.com/releases/v5.8.1/css/all.css' integrity='sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf' crossOrigin='anonymous' />
    </head>
    <body style={Styles.body}>
      <div style={Styles.wrapper}>
        <Header />
        <div className='container' style={{ marginTop: '10px' }}>
          <div className='row col-md-6 col-md-offset-3' style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={Styles.heading}>{contentTitle}</h1>
          </div>
          <div className='row col-md-8 col-md-offset-2'>
            <ul className='list-unstyled'>
              {
                (() => listItems.map((item, index) => <IndexListItem key={index} {...item} />))()
              }
            </ul>

          </div>
        </div>
      </div>
      <Footer />
    </body>
  </html>
)

const renderIndexPage = (listItems, contentTitle) => ReactDOMServer.renderToString(<IndexPage listItems={listItems} contentTitle={contentTitle} />)

module.exports = renderIndexPage
