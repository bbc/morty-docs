const React = require('react')
const getHeaderPaths = require('../../helpers/get-header-paths')
const { ThemeToggle } = require('./Theme')

const Styles = {
  navbar: {
    border: 'none',
    borderRadius: '0',
    backgroundColor: 'var(--bg-header)',
    marginBottom: '0',
    width: '100%'
  },
  headerNav: {
    display: 'flex',
    alignItems: 'center'
  },
  headerLinks: {
    padding: '1rem',
    listStyle: 'none',
    display: 'flex',
    alignItems: 'center'
  },
  headerLink: {
    textAlign: 'left',
    color: 'var(--text-header)',
    fontSize: '1.5rem',
    textDecoration: 'none'
  },
  separator: {
    margin: '0 0.28rem',
    color: 'var(--separator-colour)'
  }
}

const HeaderLinks = ({ paths }) => paths.map(({ text, path }, index) => {
  return (
    <li key={index}>
      {index !== paths.length ? <span aria-hidden style={Styles.separator}>/</span> : undefined}
      <a style={Styles.headerLink} href={path}>{text}</a>
    </li>
  )
})

const Header = ({ relPath, basePath }) => {
  return (
    <div style={Styles.navbar}>
      <nav style={Styles.headerNav}>
        <ol style={Styles.headerLinks}>
          <HeaderLinks paths={getHeaderPaths(basePath, relPath)} />
        </ol>
        <ThemeToggle />
      </nav>
    </div>
  )
}

module.exports = Header
