const React = require('react')

const Styles = {
  indexListItem: {
    fontSize: '1.5rem',
    borderBottom: 'solid black 1px',
    marginBottom: '16px',
    paddingBottom: '8px'
  },

  linkText: {
    marginLeft: '8px'
  },

  linkAnchor: {
    textDecoration: 'none',
    color: '#337ab7'
  }
}

const IndexListItem = ({ link, text, iconClass }) => {
  return <li style={Styles.indexListItem}>
    <a href={link} style={Styles.linkAnchor}><i className={iconClass} /><span style={Styles.linkText}>{text}</span></a>
  </li>
}

module.exports = IndexListItem
