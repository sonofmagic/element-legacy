import themeEditor from '../../../i18n/theme-editor.json'

export type ThemeConfigScope = 'global' | 'local'

export interface ThemeVariableConfig extends Record<string, unknown> {
  key: string
  value: string
  name?: string
}

export interface ThemeComponentConfig {
  name: string
  config: ThemeVariableConfig[]
  [key: string]: unknown
}

export interface UserThemeConfig {
  global: Record<string, string>
  local: Record<string, string>
}

interface ThemeEditorSection {
  [key: string]: string
}

interface ThemeEditorEntry {
  lang: string
  [key: string]: string | ThemeEditorSection | undefined
}

const themeEditorEntries = themeEditor as ThemeEditorEntry[]

function deepClone<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(item => deepClone(item)) as unknown as T
  }
  if (value && typeof value === 'object') {
    const cloned: Record<string, unknown> = {}
    Object.keys(value as Record<string, unknown>).forEach((key) => {
      cloned[key] = deepClone((value as Record<string, unknown>)[key])
    })
    return cloned as T
  }
  return value
}

export function filterConfigType(name: string): ThemeConfigScope {
  switch (name) {
    case 'color':
    case 'typography':
    case 'border':
      return 'global'
    default:
      return 'local'
  }
}

export function filterGlobalValue(
  defaultConfig: ThemeComponentConfig[],
  userConfig: UserThemeConfig,
): Record<string, Record<string, ThemeVariableConfig>> {
  const valueObject: Record<string, Record<string, ThemeVariableConfig>> = {}
  const globalArr: ThemeComponentConfig['name'][] = ['color', 'typography', 'border']

  globalArr.forEach((groupName) => {
    const group = defaultConfig.find(config => config.name === groupName)
    if (!group) {
      return
    }
    const configObj: Record<string, ThemeVariableConfig> = {}
    group.config.forEach((item) => {
      configObj[item.key] = deepClone(item)
    })
    valueObject[groupName] = configObj
    Object.keys(configObj).forEach((key) => {
      const userValue = userConfig.global[key]
      const item = configObj[key]
      if (item && userValue !== undefined) {
        item.value = userValue
      }
    })
  })

  return valueObject
}

export function getStyleDisplayValue(
  displayValue: string,
  global: Record<string, ThemeVariableConfig>,
): string {
  if (displayValue.startsWith('$')) {
    const reference = global[displayValue]
    return reference ? reference.value : displayValue
  }
  return displayValue
}

function getLang(): string {
  return window.location.hash.replace('#', '').split('/')[1] || 'zh-CN'
}

function getNameFromI18N(section: string): ThemeEditorSection {
  const lang = getLang()
  const entry = themeEditorEntries.find(config => config.lang === lang)
  const data = entry?.[section]
  if (typeof data === 'object' && data !== null) {
    return data as ThemeEditorSection
  }
  return {}
}

export function getVariableDisplayName(key: string): string {
  const variableNames = getNameFromI18N('variable-name')
  return variableNames[key] || key
}

export function getStyleDisplayName(config: ThemeVariableConfig, componentName: string): string {
  const displayNameMap = getNameFromI18N('display-name')
  if (config.name) {
    return getVariableDisplayName(config.key.replace('$--', ''))
  }
  let displayName = config.key.replace(`$--${componentName}-`, '')
  Object.keys(displayNameMap).forEach((name) => {
    const replacement = displayNameMap[name]
    if (replacement) {
      displayName = displayName.replace(name, replacement)
    }
  })
  displayName = displayName.replace(/-/g, ' ')
  return displayName.trim()
}

export function getActionDisplayName(key: string): string {
  const actionMap = getNameFromI18N('action')
  return actionMap[key] || key
}
