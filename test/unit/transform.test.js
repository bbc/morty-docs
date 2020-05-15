const mockTransformContentOutput = { relativePath: 'transformedPath', raw: 'transformedRaw' }
jest.mock('../../src/transform-content', () => jest.fn(() => mockTransformContentOutput))
const mockTransformContent = require('../../src/transform-content')

const { transform } = require('../../src')

describe('transform.js', () => {
  it('returns the input object unchanged when it is not a .md file', () => {
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

  it('transforms .md files', () => {
    const mdObj = {
      relativePath: 'simple-content.md',
      raw: '# Some Markdown'
    }

    const result = transform([mdObj], {})

    expect(result).toEqual(expect.arrayContaining([mockTransformContentOutput]))
    expect(mockTransformContent).toHaveBeenCalledWith(mdObj, {})
  })

  const asciidocExtensions = ['.asciidoc', '.adoc', '.asc']

  asciidocExtensions.forEach(asciidocExtension => {
    it(`transforms ${asciidocExtension} files`, () => {
      const asciidocObj = {
        relativePath: `simple-content${asciidocExtension}`,
        raw: '== Some AsciiDoc'
      }

      const result = transform([asciidocObj], {})

      expect(result).toEqual(expect.arrayContaining([mockTransformContentOutput]))
      expect(mockTransformContent).toHaveBeenCalledWith(asciidocObj, {})
    })
  })
})
