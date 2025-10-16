import type { VueConstructor } from 'vue'
import ColorPicker from './src/main.vue'

type InstallableColorPicker = typeof ColorPicker & {
  install: (vue: VueConstructor) => void
}

const _ColorPicker = ColorPicker as InstallableColorPicker

/* istanbul ignore next */
_ColorPicker.install = function install(Vue: VueConstructor) {
  Vue.component(_ColorPicker.name, _ColorPicker)
}

export default _ColorPicker
