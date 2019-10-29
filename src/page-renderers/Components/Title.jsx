const React = require('react')
const Styles = {
  heading: {
    fontSize: '32px'
  }
}
const Title = ({ contentTitle }) => {
  if (contentTitle) {
    return (
      <div className='row col-md-6 col-md-offset-3' style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={Styles.heading}>{contentTitle}</h1>
      </div>
    )
  } else return null
}

module.exports = Title
