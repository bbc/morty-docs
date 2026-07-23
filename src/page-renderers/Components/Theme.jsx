const React = require('react')
const { initInLine, toggleInLine } = require('../../theme')

const themeStyles = require('../../styles/theme.css.js')
const settingsStyles = require('../../styles/settings.css.js')

const ThemeInitScript = () => {
  return <script dangerouslySetInnerHTML={{ __html: initInLine }} />
}
const ThemeStyles = () => {
  return <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
}

const ThemeToggle = () => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: settingsStyles }} />
      <div className='settings-container'>
        <button id='settings-button' className='settings-button' aria-label='Settings' aria-haspopup='true' aria-expanded='false'>
          <span className='settings-text'>Settings</span>
          <span className='settings-icon'>{'\u2699'}</span>
        </button>

        <div id='settings-dropdown' className='settings-dropdown' role='menu'>
          <button className='theme-option' data-theme='light' role='menuitem'>Light</button>
          <button className='theme-option' data-theme='dark' role='menuitem'>Dark</button>
          <button className='theme-option' data-theme='system' role='menuitem'>System</button>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: toggleInLine }} />
    </>
  )
}

module.exports = { ThemeInitScript, ThemeStyles, ThemeToggle }
