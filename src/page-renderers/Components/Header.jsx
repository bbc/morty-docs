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
    paddingRight: '5px',
    paddingLeft: '5px'
  },
  headerLinks: {
    marginTop: '5px'
  },
  headerLogo: {
    height: '65%',
    width: 'auto'
  }
}

const OptionalHeaderLogo = ({ headerLogoUrl }) => {
  if (!headerLogoUrl) return null
  return (
    <div className='col-md-4'>
      <img style={Styles.headerLogo} src={headerLogoUrl} />
    </div>
  )
}

const Header = ({ relPath, headerLogoUrl }) => {
  let pathParts
  let headerPaths
  let headerLinks

  if (relPath) {
    pathParts = relPath.split('/')
    headerPaths = getHeaderPaths(relPath)

    headerLinks = headerPaths.map((dir, index) => {
      return <a style={{ textAlign: 'left', paddingRight: '3px', color: '#4f8df0', fontSize: '20' }} href={'/' + dir} key={index}><span>{'/' + pathParts[index]}</span></a>
    })
  } else {
    headerLinks = <h3 style={{ color: '#fff', marginTop: '5px' }}>Morty-Docs</h3>
  }

  return (
    <div className='container' style={Styles.navbar}>
      <div className='row col-md-12' style={{ width: '100%', paddingTop: '10px', paddingRight: '0px', paddingLeft: '25px' }}>
        <div className='col-md-4' style={Styles.headerLinks}>
          {headerLinks}
        </div>
        <OptionalHeaderLogo headerLogoUrl={headerLogoUrl} />
      </div>
    </div>
  )
}

module.exports = Header
