const React = require('react')

const Styles = {
  navbar: {
    border: 'none',
    borderRadius: '0',
    backgroundColor: '#000',
    minHeight: '60px',
    marginBottom: '0',
    width: '100%',
    paddingRight: '5px',
    paddingLeft: '5px'
  }
}

const Header = () => (
  <div className='container' style={Styles.navbar}>
    <div className='row col-md-12' style={{ width: '100%', paddingTop: '10px', paddingRight: '0px', paddingLeft: '25px' }}>
      <h3 className='col-md-4' style={{ textAlign: 'left', paddingRight: '0px', paddingBottom: '20px', color: '#fff' }}>
        Morty-Docs
      </h3>
    </div>
  </div>
)

module.exports = Header
