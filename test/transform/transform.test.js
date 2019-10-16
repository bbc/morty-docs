const { transform } = require('../../src/')

describe('Transform method', () => {
  it('returns the input object unchanged when it is not an .md file', () => {
    const notMdObj = {
      relativePath: 'simple-content.PNG',
      raw: 'Input-Raw-for-simple-content.PNG'
    }

    const result = transform([notMdObj])

    expect(result).toEqual(expect.arrayContaining([notMdObj]))
  })
})
