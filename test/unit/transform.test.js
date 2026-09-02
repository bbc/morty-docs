const { Index } = require('flexsearch')
const { transform } = require('../../src')
const mockTransformContent = require('../../src/transform-content')

jest.mock('../../src/transform-content', () => jest.fn())

const mockTransformContentOutput = {
  relativePath: 'transformedPath',
  raw: 'transformedRaw'
}

beforeEach(() => {
  jest.resetAllMocks()
  mockTransformContent.mockReturnValue(mockTransformContentOutput)
})

describe('transform.js', () => {
  it('returns the input object unchanged when it is not a .md file', () => {
    const notMdObj = {
      relativePath: 'simple-content.PNG',
      raw: 'Input-Raw-for-simple-content.PNG'
    }

    const result = transform([notMdObj], { basePath: 'morty-docs/some-repo' })

    expect(result).toEqual(expect.arrayContaining([notMdObj]))
  })

  it('throws an error when first arg is undefined', () => {
    expect(() => {
      transform()
    }).toThrow('First arg to transform() must be an array')
  })

  it("throws an error when the input array has an object that does not have a 'relativePath'", () => {
    const objWithoutRelativePath = { raw: '', path: '' }
    expect(() => {
      transform([objWithoutRelativePath])
    }).toThrow('All objects in input array must have a .relativePath property')
  })

  it("throws an error when the input array has an object that does not have a 'raw'", () => {
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

    const result = transform([mdObj], { basePath: 'morty-docs/some-repo' })

    expect(result).toEqual(expect.arrayContaining([mockTransformContentOutput]))
    expect(mockTransformContent).toHaveBeenCalledWith(mdObj, { basePath: 'morty-docs/some-repo' })
  })

  it('indexes .md files for search', () => {
    mockTransformContent.mockImplementation((inputObj) => ({
      relativePath: inputObj.relativePath,
      raw: 'transformed content'
    }))

    const files = [
      {
        relativePath: 'simple-content-containing-term.md',
        raw: 'This is some content containing the term "searchable"'
      },
      {
        relativePath: 'simple-content-not-containing-term.md',
        raw: 'This is some content not containing the term'
      }
    ]

    const result = transform(files, { basePath: 'morty-docs/some-repo' })

    const searchIndex = result.find(
      (obj) => obj.relativePath === 'search-index.json'
    ).raw
    const index = new Index('memory')

    Object.entries(JSON.parse(searchIndex).index).forEach(([key, value]) => {
      index.import(key, value)
    })

    const results = index.search('searchable')
    expect(results).toEqual(['simple-content-containing-term.md'])
  })

  /*
  const asciidocExtensions = ['.asciidoc', '.adoc', '.asc']

  asciidocExtensions.forEach(asciidocExtension => {
    it(`transforms ${asciidocExtension} files`, () => {
      const asciidocObj = {
        relativePath: `simple-content${asciidocExtension}`,
        raw: '== Some AsciiDoc'
      }

      const result = transform([asciidocObj], { basePath: 'morty-docs/some-repo' })

      expect(result).toEqual(expect.arrayContaining([mockTransformContentOutput]))
      expect(mockTransformContent).toHaveBeenCalledWith(asciidocObj, { basePath: 'morty-docs/some-repo' })
    })
  })
  */
})
