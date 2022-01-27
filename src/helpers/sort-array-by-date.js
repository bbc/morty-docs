const dateRegex = /\d{4}-\d{2}-\d{2}/ // i.e. 2019-10-29

function sortByDate (a, b) {
  return a.match(dateRegex) && b.match(dateRegex) ? b.localeCompare(a) : a.localeCompare(b)
}

const sortArrayByDate = (arr) => {
  return arr.sort(sortByDate)
}

module.exports = {
  sortArrayByDate
}
