const React = require('react')
const getHeaderPaths = require('../../helpers/get-header-paths')
const { prettyDate } = require('./PrettyDate')

const Styles = {
  navbar: {
    border: 'none',
    borderRadius: '0',
    backgroundColor: '#000',
    marginBottom: '0',
    width: '100%'
  },
  headerNav: {
    display: 'flex',
    justifyContent: 'space-between'
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
  },
  genTimestamp: {
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    paddingRight: '6px',
    fontSize: '0.85rem'
  }
}

const HeaderLinks = ({ paths }) => paths.map(({ text, path }, index) => {
  return <li key={index}>
    { index !== paths.length ? <span aria-hidden style={Styles.separator}>/</span> : undefined }
    <a style={Styles.headerLink} href={path}>{text}</a>
  </li>
})

const Header = ({ relPath, basePath }) => {
  return (
    <div style={Styles.navbar}>
      <nav style={Styles.headerNav}>
        <ol style={Styles.headerLinks}>
          <HeaderLinks paths={getHeaderPaths(basePath, relPath)} />
        </ol>
        <span style={Styles.genTimestamp}>Page generated on {prettyDate(new Date())}</span>
      </nav>
    </div>
  )
}

module.exports = Header
