const ELEMENT_THEME_USER_CONFIG = 'ELEMENT_THEME_USER_CONFIG'
export function loadFromLocal(key) {
  return new window.Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key])
    })
  })
}
export function saveToLocal(key, value) {
  chrome.storage.local.set({ [key]: value })
}

export function loadUserThemeFromLocal() {
  return loadFromLocal(ELEMENT_THEME_USER_CONFIG)
}
export function saveUserThemeToLocal(value) {
  saveToLocal(ELEMENT_THEME_USER_CONFIG, value)
}
