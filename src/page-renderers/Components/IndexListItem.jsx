const React = require('react')
const IconFileLines = require('./icons/IconFileLines')
const IconFolderOpen = require('./icons/IconFolderOpen')

const Styles = {
  indexListItem: {
    fontSize: '1.5rem',
    borderBottom: 'solid black 1px',
    marginBottom: '1rem',
    paddingBottom: '0.5rem'
  },

  linkText: {
    marginLeft: '1rem'
  },

  linkAnchor: {
    textDecoration: 'none',
    color: '#337ab7'
  },

  icon: {
    fill: '#337ab7',
    height: '1em',
    verticalAlign: 'middle'
  },
  iconWrap: {
    display: 'inline-block',
    width: '1em'
  }
}

const Icon = ({ iconName }) => {
  if (iconName === 'folder') {
    return <IconFolderOpen style={Styles.icon} />
  }
  return <IconFileLines style={Styles.icon} />
}

const IndexListItem = ({ link, text, iconName }) => {
  return <li style={Styles.indexListItem}>
    <a href={link} style={Styles.linkAnchor}><span style={Styles.iconWrap}><Icon iconName={iconName} /></span><span style={Styles.linkText}>{text}</span></a>
  </li>
}

module.exports = IndexListItem
