const React = require('react')

const Styles = {
  indexListItem: {
    fontSize: '1.6em',
    borderBottom: 'solid black 1px',
    marginBottom: '10px'
  },

  linkText: {
    marginLeft: '5px'
  }
}

const IndexListItem = ({ link, text, iconClass }) => {
  return <li className='index-list' style={Styles.indexListItem}>
    <a href={link}><i className={iconClass} /><span style={Styles.linkText}>{text}</span></a>
  </li>
}

module.exports = IndexListItem
