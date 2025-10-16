import {
  ELEMENT_THEME_PREVIEW_CONFIG,
  ELEMENT_THEME_USER_CONFIG,
} from './constant'

export function saveToLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromLocal(key) {
  try {
    return JSON.parse(localStorage.getItem(key))
  }
  catch (e) {
    console.error(e)
    return null
  }
}

export function savePreviewToLocal(value) {
  saveToLocal(ELEMENT_THEME_PREVIEW_CONFIG, value)
}

export function loadPreviewFromLocal() {
  return loadFromLocal(ELEMENT_THEME_PREVIEW_CONFIG) || {}
}

export function removePreviewFromLocal() {
  return localStorage.removeItem(ELEMENT_THEME_PREVIEW_CONFIG)
}

export function saveUserThemeToLocal(value) {
  saveToLocal(ELEMENT_THEME_USER_CONFIG, value)
}

export function loadUserThemeFromLocal() {
  return loadFromLocal(ELEMENT_THEME_USER_CONFIG)
}
