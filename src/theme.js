/* eslint-env browser */
const themeInit = () => {
  const getSystemTheme = () => matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

  const saved = localStorage.getItem('theme')
  document.documentElement.dataset.theme = saved && saved !== 'system' ? saved : getSystemTheme()
}

// for settings toggle
const themeToggle = () => {
  const getSystemTheme = () => matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  let currentTheme = localStorage.getItem('theme')

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme
  }

  const updateActiveOption = () => {
    document.querySelectorAll('.theme-option').forEach((option) => {
      option.classList.toggle('active', option.dataset.theme === currentTheme)
    })
  }

  const setTheme = (theme) => {
    currentTheme = theme
    localStorage.setItem('theme', theme)
    applyTheme(theme === 'system' ? getSystemTheme() : theme)

    updateActiveOption()
  }

  const toggleDropdown = () => {
    document.getElementById('settings-dropdown').classList.toggle('open')
  }

  document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.getElementById('settings-dropdown')
    const button = document.getElementById('settings-button')

    button?.addEventListener('click', toggleDropdown)

    document.querySelectorAll('.theme-option').forEach((option) => {
      option.addEventListener('click', () => {
        setTheme(option.dataset.theme)
        toggleDropdown()
      })
    })

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !button.contains(e.target)) {
        dropdown.classList.remove('open')
      }
    })

    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (!currentTheme || currentTheme === 'system') {
        applyTheme(getSystemTheme())
      }
    })

    if (currentTheme) {
      setTheme(currentTheme)
    } else {
      applyTheme(getSystemTheme())
      updateActiveOption()
    }
  })
}

const initInLine = `(${themeInit.toString()})()`
const toggleInLine = `(${themeToggle.toString()})()`

module.exports = { initInLine, toggleInLine }
