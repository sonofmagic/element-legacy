const ELEMENT_THEME_USER_CONFIG = 'ELEMENT_THEME_USER_CONFIG' as const

export function loadFromLocal<T = unknown>(key: string): Promise<T | undefined> {
  return new Promise((resolve) => {
    if (!chrome?.storage?.local) {
      resolve(undefined)
      return
    }
    chrome.storage.local.get([key], (result) => {
      resolve(result[key] as T | undefined)
    })
  })
}

export function saveToLocal<T>(key: string, value: T): void {
  chrome?.storage?.local?.set({ [key]: value })
}

export function loadUserThemeFromLocal<T = unknown>(): Promise<T | undefined> {
  return loadFromLocal<T>(ELEMENT_THEME_USER_CONFIG)
}

export function saveUserThemeToLocal<T>(value: T): void {
  saveToLocal(ELEMENT_THEME_USER_CONFIG, value)
}
