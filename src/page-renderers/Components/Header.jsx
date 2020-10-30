const React = require('react')
const getHeaderPaths = require('../../helpers/get-header-paths')

const Styles = {
  navbar: {
    border: 'none',
    borderRadius: '0',
    backgroundColor: '#000',
    height: '60px',
    marginBottom: '0',
    width: '100%',
    padding: '1.142rem'
  },
  headerNav: {
  },
  headerLinks: {
    padding: '0',
    listStyle: 'none',
    display: 'flex',
    height: '100%',
    alignItems: 'center'
  },
  headerLink: {
    textAlign: 'left',
    color: 'lightblue',
    fontSize: '2rem'
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
  <div className='container' style={Styles.navbar}>
    <nav style={Styles.headerNav}>
      <ol style={Styles.headerLinks}>
        <HeaderLinks paths={getHeaderPaths(basePath, relPath)} />
      </ol>
    </nav>
  </div>
)

module.exports = Header
