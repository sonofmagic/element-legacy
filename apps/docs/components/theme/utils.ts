import type { ThemeConfig } from './constant'

export const isEmptyObject = (obj: Record<string, unknown> = {}): boolean => (JSON.stringify(obj) === '{}')

export function getThemeConfigObject(config: string): ThemeConfig | false {
  try {
    const conf = JSON.parse(config) as ThemeConfig
    const { global, local } = conf
    if (!isEmptyObject(global) || !isEmptyObject(local)) {
      return conf
    }
    return false
  }
  catch {
    return false
  }
}

export function updateDomHeadStyle(id: string, styleContent: string): void {
  let styleTag = document.getElementById(id) as HTMLStyleElement | null
  if (!styleTag) {
    styleTag = document.createElement('style')
    styleTag.setAttribute('id', id)
    document.head.appendChild(styleTag)
  }
  styleTag.textContent = styleContent.replace(/@font-face\{[^}]+\}/, '')
}
