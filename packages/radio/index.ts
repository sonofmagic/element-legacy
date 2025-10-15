import type { VueConstructor } from 'vue'
import Radio from './src/radio.vue'

type InstallableRadio = typeof Radio & {
  install: (vue: VueConstructor) => void
}

const _Radio = Radio as InstallableRadio

/* istanbul ignore next */
_Radio.install = function install(Vue: VueConstructor) {
  Vue.component(_Radio.name, _Radio)
}

export default _Radio
