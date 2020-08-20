const React = require('react')
const Header = require('../../src/page-renderers/Components/Header')
const renderer = require('react-test-renderer')

describe('The header is rendered with the correct breadcrumb links ', () => {
  it('When a basepath is passed through', () => {
    const component = renderer.create(
      <Header relPath={'folder/nestedFolder/someFile.html'} basePath={'morty-docs/some-repo'} />
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('When a basepath is not passed through', () => {
    const component = renderer.create(
      <Header relPath={'folder/nestedFolder/someFile.html'} basePath={''} />
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
