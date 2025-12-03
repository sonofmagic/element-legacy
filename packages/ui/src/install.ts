import type Vue from 'vue'
import type { PluginFunction, PluginObject, VueConstructor } from 'vue'
import type { ComponentLike } from './components'
import type { ElementConfigContext } from './utils/config-provider'
import { componentList, InfiniteScroll, Loading, Message, MessageBox, Notification } from './components'
import locale from './locale'
import { CONFIG_PROVIDER_INJECTION_KEY, extractConfigFromOptions, getGlobalConfig, setGlobalConfig } from './utils/config-provider'

type I18nHandler = (...args: unknown[]) => unknown

export type InstallOptions = ElementConfigContext & {
  locale?: Record<string, unknown>
  i18n?: I18nHandler
}

type ElConfigAwareVue = Vue & {
  elConfig?: ElementConfigContext | null
}

declare global {
  interface Window {
    Vue?: VueConstructor<Vue>
  }
}

export const install: PluginFunction<InstallOptions> = (Vue, opts?: InstallOptions) => {
  const options: InstallOptions = opts ?? {}
  const {
    locale: userLocale,
    i18n: userI18n,
    ...rawConfig
  } = options

  const elementConfig = rawConfig as ElementConfigContext

  locale.use(userLocale)
  locale.i18n(userI18n)

  const initialConfig = extractConfigFromOptions({
    ...elementConfig,
    size: elementConfig.size ?? '',
    zIndex: elementConfig.zIndex ?? 2000,
  })
  setGlobalConfig(initialConfig)

  Vue.mixin({
    inject: {
      elConfig: { from: CONFIG_PROVIDER_INJECTION_KEY, default: null },
    },
    computed: {
      $elementConfig(this: ElConfigAwareVue): ElementConfigContext {
        return this.elConfig ?? getGlobalConfig()
      },
    },
  })

  componentList.forEach((component) => {
    const normalized = component as ComponentLike
    const componentName = normalized.name
    if (!componentName) {
      return
    }
    Vue.component(componentName, normalized as VueConstructor<Vue>)
  })

  Vue.use(InfiniteScroll)
  Vue.use(Loading.directive as PluginObject<unknown>)

  Vue.prototype.$loading = Loading.service
  Vue.prototype.$msgbox = MessageBox
  Vue.prototype.$alert = MessageBox.alert
  Vue.prototype.$confirm = MessageBox.confirm
  Vue.prototype.$prompt = MessageBox.prompt
  Vue.prototype.$notify = Notification
  Vue.prototype.$message = Message
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
