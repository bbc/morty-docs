const transformContent = require('../../src/transform-content.js')

const options = {
  contentTitle: 'Some Title',
  basePath: '/morty-docs/some-repo'
}

describe('Transform-content returns correct relative path', () => {
  it('for the html made from .md', () => {
    const inputObj = {
      relativePath: 'simple-content.md',
      raw: 'NotUsedInTest-SoFar'
    }

    const result = transformContent(inputObj, options)

    expect(result).toEqual(
      expect.objectContaining({ relativePath: 'simple-content.html', raw: expect.anything() })
    )
  })

  it('even when there is a dot in the path to input .md', () => {
    const inputObj = {
      relativePath: 'docs/arch.2019/simple-content.md',
      raw: 'NotUsedInTest-SoFar'
    }

    const result = transformContent(inputObj, options)

    expect(result).toEqual(
      expect.objectContaining({ relativePath: 'docs/arch.2019/simple-content.html', raw: expect.anything() })
    )
  })
})

// TODO: ? we could extract different parts of the the html and test them separately
describe('Transform-content returns the correct html from markdown', () => {
  it('for a line of plain text', () => {
    const inputObj = {
      relativePath: 'file-name.md',
      raw: 'One line of plain text'
    }

    const result = transformContent(inputObj, options)

    expect(result.raw).toMatchSnapshot()
  })

  it('for Markdown with a title and links', () => {
    const inputObj = {
      relativePath: 'file-name.md',
      raw: '# Title of simple-content.md \n[Relative link to MD in docs directory](docs/file-to-publish.md)\n[Root link to MD in docs directory](/docs/file-to-publish.md)'
    }

    const result = transformContent(inputObj, options)

    expect(result.raw).toMatchSnapshot()
  })
})

describe('Transform-content returns the correct html from AsciiDoc', () => {
  it('for a line of plain text', () => {
    const inputObj = {
      relativePath: 'file-name.asciidoc',
      raw: 'One line of plain text'
    }

    const result = transformContent(inputObj, options)

    expect(result.raw).toMatchSnapshot()
  })

  it('for .asciidoc with a title and a link', () => {
    const inputObj = {
      relativePath: 'file-name.asciidoc',
      raw: '== Title of simple-content.asciidoc \nlink:docs/file-to-publish.md[Link to MD in docs directory]'
    }

    const result = transformContent(inputObj, options)

    expect(result.raw).toMatchSnapshot()
  })

  it('for .adoc with a title and a link', () => {
    const inputObj = {
      relativePath: 'file-name.adoc',
      raw: '== Title of simple-content.adoc \nlink:docs/file-to-publish.md[Link to MD in docs directory]'
    }

    const result = transformContent(inputObj, options)

    expect(result.raw).toMatchSnapshot()
  })

  it('for .asc with a title and a link', () => {
    const inputObj = {
      relativePath: 'file-name.asc',
      raw: '== Title of simple-content.asc \nlink:docs/file-to-publish.md[Link to MD in docs directory]'
    }

    const result = transformContent(inputObj, options)

    expect(result.raw).toMatchSnapshot()
  })
})
