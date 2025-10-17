import type { VueConstructor } from 'vue'
import ColorPicker from './src/main.vue'

type InstallableComponent = typeof ColorPicker & {
  install?: (vue: VueConstructor) => void
  name: string
}

const component = ColorPicker as InstallableComponent

/* istanbul ignore next */
component.install = function install(Vue: VueConstructor): void {
  Vue.component(component.name, component)
}

export default component
