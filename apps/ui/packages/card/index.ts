import type { VueConstructor } from 'vue'
import Card from './src/main.vue'

type InstallableCard = typeof Card & {
  install: (vue: VueConstructor) => void
}

const _Card = Card as InstallableCard

/* istanbul ignore next */
_Card.install = function install(Vue: VueConstructor) {
  Vue.component(_Card.name, _Card)
}

export default _Card
