import {
  ELEMENT_THEME_PREVIEW_CONFIG,
  ELEMENT_THEME_USER_CONFIG,
} from './constant'

export function saveToLocal(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromLocal<T = unknown>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      return null
    }
    return JSON.parse(raw) as T
  }
  catch (error) {
    if (typeof window !== 'undefined' && window.console?.error) {
      window.console.error(error)
    }
    return null
  }
}

export function savePreviewToLocal(value: unknown): void {
  saveToLocal(ELEMENT_THEME_PREVIEW_CONFIG, value)
}

export function loadPreviewFromLocal<T = Record<string, unknown>>(): T {
  return (loadFromLocal<T>(ELEMENT_THEME_PREVIEW_CONFIG) || {}) as T
}

export function removePreviewFromLocal(): void {
  localStorage.removeItem(ELEMENT_THEME_PREVIEW_CONFIG)
}

export function saveUserThemeToLocal(value: unknown): void {
  saveToLocal(ELEMENT_THEME_USER_CONFIG, value)
}

export function loadUserThemeFromLocal<T = unknown>(): T | null {
  return loadFromLocal<T>(ELEMENT_THEME_USER_CONFIG)
}
