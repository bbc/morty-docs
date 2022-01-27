const { sortArrayByDate } = require('../../../src/helpers/sort-array-by-date')

describe('Given an array', () => {
  test('it should sorted lexically (0-9 < a-z>)', () => {
    const list = ['example1', '2018', '2017', 'test2']
    const expectedOutput = ['2017', '2018', 'example1', 'test2']
    const output = sortArrayByDate(list)
    expect(output).toEqual(expectedOutput)
  })
})

describe('Given an array that prefix dates in the name', () => {
  test('it should sort it reverse chronologically', () => {
    const list = ['2019-10-29-some-document', '2017-10-01-some-document', '2021-10-29-some-document', '2020-10-29-some-document']
    const expectedOutput = ['2021-10-29-some-document', '2020-10-29-some-document', '2019-10-29-some-document', '2017-10-01-some-document']
    const output = sortArrayByDate(list)
    expect(output).toEqual(expectedOutput)
  })
})
