import type { VueConstructor } from 'vue'
import ElTimelineItem from '../timeline/src/item.vue'

type InstallableElTimelineItem = typeof ElTimelineItem & {
  install: (vue: VueConstructor) => void
}

const _ElTimelineItem = ElTimelineItem as InstallableElTimelineItem

/* istanbul ignore next */
_ElTimelineItem.install = function install(Vue: VueConstructor) {
  Vue.component(_ElTimelineItem.name, _ElTimelineItem)
}

export default _ElTimelineItem
