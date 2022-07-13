const React = require('react')
const Styles = {
  heading: {
    fontSize: '2rem',
    fontWeight: '500'
  }
}
const Title = ({ contentTitle }) => {
  if (contentTitle) {
    return (
      <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '32px' }}>
        <h1 style={Styles.heading}>{contentTitle}</h1>
      </div>
    )
  } else return null
}

module.exports = Title
