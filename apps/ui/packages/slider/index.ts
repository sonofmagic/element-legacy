import type { VueConstructor } from 'vue'
import Slider from './src/main.vue'

type InstallableSlider = typeof Slider & {
  install: (vue: VueConstructor) => void
}

const _Slider = Slider as InstallableSlider

/* istanbul ignore next */
_Slider.install = function install(Vue: VueConstructor) {
  Vue.component(_Slider.name, _Slider)
}

export default _Slider
