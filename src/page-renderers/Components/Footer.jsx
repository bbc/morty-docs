const React = require('react')

const Styles = {
  footer: {
    bottom: '0',
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: '0 15px',
    boxSizing: 'border-box',
    minHeight: '25vh',
    position: 'relative'
  },

  footerContainer: {
    padding: '1em 0 2em 0'
  },
  footerContent: {
    textAlign: 'center'
  }
}

const Footer = () => {
  return (
    <footer style={Styles.footer} className='footer'>
      <div style={Styles.footerContainer} className='container'>
        <div className='row'>
          <div style={Styles.footerContent} className='col-md-4 col-md-offset-4'>
            <h3>
              What is Morty-Docs?
            </h3>
            <p >
              Link to <a href='https://github.com/bbc/morty-docs'>Morty-docs</a>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

module.exports = Footer
