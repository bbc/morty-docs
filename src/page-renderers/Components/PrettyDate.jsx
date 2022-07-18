const React = require('react')

const nth = function(d) {
  if (d > 3 && d < 21) return 'th'
  switch (d % 10) {
    case 1:  return 'st'
    case 2:  return 'nd'
    case 3:  return 'rd'
    default: return 'th'
  }
}

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const prettyDate = (dateObj) => {
  const day = dateObj.getDate()
  const year = dateObj.getFullYear()
  return (
    <>
      {day}<sup>{nth(day)}</sup> {month[dateObj.getMonth()]} {year}
    </>
  )
}

module.exports = {
  prettyDate
}
