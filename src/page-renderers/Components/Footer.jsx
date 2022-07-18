const React = require('react')
const { prettyDate } = require('./PrettyDate')

const Styles = {
  footer: {
    bottom: '0',
    width: '100%',
    backgroundColor: '#f5f5f5',
    boxSizing: 'border-box',
    minHeight: '25vh',
    position: 'relative',
    textAlign: 'center',
    padding: '1em 0 2em 0',
    lineHeight: '1.5rem'
  },

  footerLink: {
    color: '#337ab7'
  }
}

const Footer = () => {
  return (
    <footer style={Styles.footer}>
      <a href='https://github.com/bbc/morty-docs' style={Styles.footerLink}>Morty-Docs on github</a>
      <br />
      Page generated on {prettyDate(new Date())}
    </footer>
  )
}

module.exports = Footer
