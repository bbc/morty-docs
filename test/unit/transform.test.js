const { transform } = require('../../src')

describe('Transform method', () => {
  it('returns the input object unchanged when it is not an .md file', () => {
    const notMdObj = {
      relativePath: 'simple-content.PNG',
      raw: 'Input-Raw-for-simple-content.PNG'
    }

    const result = transform([notMdObj])

    expect(result).toEqual(expect.arrayContaining([notMdObj]))
  })

  it('throws an error when first arg is undefined', () => {
    expect(() => {
      transform()
    }).toThrow('First arg to transform() must be an array')
  })

  it('throws an error when the input array has an object that does not have a \'relativePath\'', () => {
    const objWithoutRelativePath = { raw: '', path: '' }
    expect(() => {
      transform([objWithoutRelativePath])
    }).toThrow('All objects in input array must have a .relativePath property')
  })

  it('throws an error when the input array has an object that does not have a \'raw\'', () => {
    const objWithoutRaw = { roar: '', relativePath: '' }
    expect(() => {
      transform([objWithoutRaw])
    }).toThrow('All objects in input array must have a .raw property')
  })
})
