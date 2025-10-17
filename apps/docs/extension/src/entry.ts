import init from './app'

declare global {
  interface Window {
    ElementThemeRollerInit?: boolean
  }
}

if (!window.ElementThemeRollerInit) {
  window.ElementThemeRollerInit = true
  init()
}
