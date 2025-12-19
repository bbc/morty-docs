const React = require('react')
const Header = require('../../src/page-renderers/Components/Header')
const { render } = require('@testing-library/react')

describe('The header is rendered with the correct breadcrumb links ', () => {
  it('When a basepath is passed through', () => {
    const { asFragment } = render(
      <Header relPath='folder/nestedFolder/someFile.html' basePath='morty-docs/some-repo' />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('When a basepath is not passed through', () => {
    const { asFragment } = render(
      <Header relPath='folder/nestedFolder/someFile.html' basePath='' />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
