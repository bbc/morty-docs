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

const Footer = ({ useGithubStyle = false }) => {
  const footerStyles = useGithubStyle
    ? { ...Styles.footer, backgroundColor: 'var(--morty-footer-bg)' }
    : Styles.footer
  const footerLinkStyles = useGithubStyle
    ? { ...Styles.footerLink, color: 'var(--morty-link-fg)' }
    : Styles.footerLink

  return (
    <footer style={footerStyles}>
      <a href='https://github.com/bbc/morty-docs' style={footerLinkStyles}>Morty-Docs on github</a>
      <br />
      Page generated on {prettyDate(new Date())}
    </footer>
  )
}

module.exports = Footer
