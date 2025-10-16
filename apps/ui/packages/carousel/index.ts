import type { VueConstructor } from 'vue'
import Carousel from './src/main.vue'

type InstallableCarousel = typeof Carousel & {
  install: (vue: VueConstructor) => void
}

const _Carousel = Carousel as InstallableCarousel

/* istanbul ignore next */
_Carousel.install = function install(Vue: VueConstructor) {
  Vue.component(_Carousel.name, _Carousel)
}

export default _Carousel
