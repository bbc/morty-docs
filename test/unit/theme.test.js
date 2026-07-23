const React = require('react')
const { render } = require('@testing-library/react')
const { ThemeInitScript, ThemeStyles, ThemeToggle } = require('../../src/page-renderers/Components/Theme')

describe('Theme feature', () => {
  describe('Theme script', () => {
    it('should render inline script', () => {
      const { container } = render(<ThemeInitScript />)
      const initScript = container.querySelector('script')

      expect(initScript).toBeTruthy()
      expect(initScript.innerHTML).toContain('localStorage.getItem')
      expect(initScript.innerHTML).toContain('getSystemTheme')
      expect(initScript.innerHTML).toContain('dataset.theme')
    })
    it('should match snapshot', () => {
      const { asFragment } = render(<ThemeInitScript />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
  describe('Theme styles', () => {
    it('should render inline CSS', () => {
      const { container } = render(<ThemeStyles />)
      const style = container.querySelector('style')

      expect(style.innerHTML).toContain('data-theme="dark"')
      expect(style.innerHTML).toContain(':root')
      expect(style.innerHTML).toContain('--bg-primary')
    })
    it('should match snapshot', () => {
      const { asFragment } = render(<ThemeStyles />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
  describe('Theme toggle', () => {
    it('should render with correct attributes', () => {
      const { container } = render(<ThemeToggle />)

      const button = container.querySelector('#settings-button')
      expect(button.getAttribute('aria-haspopup')).toBe('true')
      expect(button.getAttribute('aria-expanded')).toBe('false')
      expect(button.getAttribute('aria-label')).toBe('Settings')
    })
    it('should render all three theme options', () => {
      const { container } = render(<ThemeToggle />)

      const options = container.querySelectorAll('.theme-option[role="menuitem"]')
      expect(options.length).toBe(3)
      expect([...options].map(option => option.dataset.theme)).toEqual(['light', 'dark', 'system'])
      expect([...options].map(option => option.textContent)).toEqual(['Light', 'Dark', 'System'])
    })
    it('should include inline script in toggle', () => {
      const { container } = render(<ThemeToggle />)
      const toggleScript = container.querySelector('script')

      expect(toggleScript.innerHTML).toContain('setTheme')
    })
    it('should match snapshot', () => {
      const { asFragment } = render(<ThemeToggle />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
