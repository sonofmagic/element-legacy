import Vue from 'element-ui/src/utils/vue'
import { computed, inject } from 'vue'

export interface ElementConfigContext {
  size?: string
  zIndex?: number
  namespace?: string
  button?: {
    autoInsertSpace?: boolean
  }
  message?: {
    max?: number
  }
}

export const CONFIG_PROVIDER_INJECTION_KEY = 'elConfigProvider'

const defaultConfig: ElementConfigContext = {
  size: '',
  zIndex: 2000,
  namespace: undefined,
  button: {
    autoInsertSpace: false,
  },
  message: {},
}

function normalizeConfig(config?: ElementConfigContext | null): ElementConfigContext {
  return {
    size: config?.size ?? defaultConfig.size,
    zIndex: config?.zIndex ?? defaultConfig.zIndex,
    namespace: config?.namespace ?? defaultConfig.namespace,
    button: {
      ...defaultConfig.button,
      ...(config?.button ?? {}),
    },
    message: {
      ...defaultConfig.message,
      ...(config?.message ?? {}),
    },
  }
}

export function mergeConfig(
  baseConfig?: ElementConfigContext | null,
  overrideConfig?: ElementConfigContext | null,
): ElementConfigContext {
  const merged = normalizeConfig(baseConfig)

  if (overrideConfig) {
    if (overrideConfig.size !== undefined) {
      merged.size = overrideConfig.size
    }

    if (overrideConfig.zIndex !== undefined) {
      merged.zIndex = overrideConfig.zIndex
    }

    if (overrideConfig.namespace !== undefined) {
      merged.namespace = overrideConfig.namespace
    }

    if (overrideConfig.button) {
      merged.button = {
        ...merged.button,
        ...overrideConfig.button,
      }
    }

    if (overrideConfig.message) {
      merged.message = {
        ...merged.message,
        ...overrideConfig.message,
      }
    }
  }

  return merged
}

let globalConfig: ElementConfigContext = normalizeConfig()

export function getGlobalConfig(): ElementConfigContext {
  return globalConfig
}

export function setGlobalConfig(config?: ElementConfigContext | null): ElementConfigContext {
  globalConfig = mergeConfig(config ?? globalConfig)
  return globalConfig
}

export function extractConfigFromOptions(config?: ElementConfigContext | null): ElementConfigContext | undefined {
  if (!config) {
    return undefined
  }

  const picked: ElementConfigContext = {}

  if (config.size !== undefined) {
    picked.size = config.size
  }

  if (config.zIndex !== undefined) {
    picked.zIndex = config.zIndex
  }

  if (config.namespace !== undefined) {
    picked.namespace = config.namespace
  }

  if (config.button !== undefined) {
    picked.button = config.button
  }

  if (config.message !== undefined) {
    picked.message = config.message
  }

  return picked
}

export function useGlobalConfig() {
  const injectedConfig = inject<ElementConfigContext | null>(CONFIG_PROVIDER_INJECTION_KEY, null)

  return computed(() => {
    if (injectedConfig) {
      return mergeConfig(getGlobalConfig(), injectedConfig)
    }
    return getGlobalConfig()
  })
}

let hasWarnedElementPrototype = false

function setupDeprecatedElementPrototypeAccessor() {
  if (Object.getOwnPropertyDescriptor(Vue.prototype, '$ELEMENT')) {
    return
  }

  Object.defineProperty(Vue.prototype, '$ELEMENT', {
    configurable: true,
    enumerable: false,
    get() {
      if (!hasWarnedElementPrototype) {
        // eslint-disable-next-line no-console
        console.warn('[Element Legacy] $ELEMENT is deprecated. Use ConfigProvider / injected config instead.')
        hasWarnedElementPrototype = true
      }
      return globalConfig
    },
    set(value) {
      if (!hasWarnedElementPrototype) {
        // eslint-disable-next-line no-console
        console.warn('[Element Legacy] $ELEMENT setter is deprecated. Use ConfigProvider props to set global config.')
        hasWarnedElementPrototype = true
      }
      globalConfig = mergeConfig(value)
    },
  })
}

setupDeprecatedElementPrototypeAccessor()
