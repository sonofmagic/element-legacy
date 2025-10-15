import type { VueConstructor } from 'vue'
import ElCarouselItem from '../carousel/src/item.vue'

type InstallableCarouselItem = typeof ElCarouselItem & {
  install: (vue: VueConstructor) => void
}

const _CarouselItem = ElCarouselItem as InstallableCarouselItem

/* istanbul ignore next */
_CarouselItem.install = function install(Vue: VueConstructor) {
  Vue.component(_CarouselItem.name, _CarouselItem)
}

export default _CarouselItem
