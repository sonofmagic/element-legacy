import type { VueConstructor } from 'vue'
import ConfigProvider from './src/index'

type InstallableConfigProvider = typeof ConfigProvider & {
  install: (vue: VueConstructor) => void
}

const _ConfigProvider = ConfigProvider as InstallableConfigProvider

/* istanbul ignore next */
_ConfigProvider.install = function install(Vue: VueConstructor) {
  Vue.component(_ConfigProvider.name, _ConfigProvider)
}

export default _ConfigProvider
