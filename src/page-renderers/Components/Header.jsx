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
    display: 'flex',
    alignItems: 'center',
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
  searchForm: {
    paddingRight: '1rem',
    display: 'flex',
    gap: '0.5em'
  },
  searchInput: {
    fontSize: 'inherit',
    fontFamily: 'inherit'
  }
}

const HeaderLinks = ({ paths }) =>
  paths.map(({ text, path }, index) => {
    return (
      <li key={index}>
        {index !== paths.length
          ? (
            <span aria-hidden style={Styles.separator}>
              /
            </span>
            )
          : undefined}
        <a style={Styles.headerLink} href={path}>
          {text}
        </a>
      </li>
    )
  })

const Header = ({ relPath, basePath, className }) => {
  return (
    <div style={Styles.navbar} className={className}>
      <nav style={Styles.headerNav}>
        <ol style={Styles.headerLinks}>
          <HeaderLinks paths={getHeaderPaths(basePath, relPath)} />
        </ol>
        <form
          style={Styles.searchForm}
          action={`/${basePath}/search-results.html`}
          method='GET'
        >
          <input style={Styles.searchInput} name='term' id='search-term' type='text' aria-description='Search term' />
          <input style={Styles.searchInput} type='submit' value='Search' />
        </form>
      </nav>
    </div>
  )
}

module.exports = Header
