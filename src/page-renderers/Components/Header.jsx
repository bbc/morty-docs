const React = require('react')
const getHeaderPaths = require('../../helpers/get-header-paths')

const Styles = {
  navbar: {
    border: 'none',
    borderRadius: '0',
    backgroundColor: '#000',
    marginBottom: '0',
    width: '100%'
  },
  headerNav: {
  },
  headerLinks: {
    padding: '1rem',
    listStyle: 'none',
    display: 'flex',
    alignItems: 'center'
  },
  headerLink: {
    textAlign: 'left',
    color: 'lightblue',
    fontSize: '1.5rem',
    textDecoration: 'none'
  },
  separator: {
    margin: '0 0.28rem',
    color: '#ebebeb'
  }
}

const HeaderLinks = ({ paths }) => paths.map(({ text, path }, index) => {
  return <li key={index}>
    { index !== paths.length ? <span aria-hidden style={Styles.separator}>/</span> : undefined }
    <a style={Styles.headerLink} href={path}>{text}</a>
  </li>
})

const Header = ({ relPath, basePath }) => (
  <div style={Styles.navbar}>
    <nav style={Styles.headerNav}>
      <ol style={Styles.headerLinks}>
        <HeaderLinks paths={getHeaderPaths(basePath, relPath)} />
      </ol>
    </nav>
  </div>
)

module.exports = Header
