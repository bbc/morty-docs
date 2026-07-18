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

const Icon = ({ iconName, style = Styles.icon }) => {
  if (iconName === 'folder') {
    return <IconFolderOpen style={style} />
  }
  return <IconFileLines style={style} />
}

const IndexListItem = ({ link, text, iconName, useGithubStyle = false }) => {
  const itemStyles = useGithubStyle
    ? { ...Styles.indexListItem, borderBottomColor: 'var(--morty-border)' }
    : Styles.indexListItem
  const anchorStyles = useGithubStyle
    ? { ...Styles.linkAnchor, color: 'var(--morty-link-fg)' }
    : Styles.linkAnchor
  const iconStyles = useGithubStyle
    ? { ...Styles.icon, fill: 'var(--morty-link-fg)' }
    : Styles.icon

  return (
    <li style={itemStyles}>
      <a href={link} style={anchorStyles}><span style={Styles.iconWrap}><Icon iconName={iconName} style={iconStyles} /></span><span style={Styles.linkText}>{text}</span></a>
    </li>
  )
}

module.exports = IndexListItem
