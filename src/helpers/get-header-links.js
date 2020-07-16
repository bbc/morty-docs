const getHeaderLinks = (relPath) => {  
  return (relPath || '')
    .split('/')
    .filter(part => !part || !part.includes('.'))
    .map((part, index, array) => array.slice(0, index + 1))
    .map(parts => parts.join('/'));
}

module.exports = getHeaderLinks
