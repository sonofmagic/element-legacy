import type { VueConstructor } from 'vue'
import Timeline from './src/main.vue'

type InstallableTimeline = typeof Timeline & {
  install: (vue: VueConstructor) => void
}

const _Timeline = Timeline as InstallableTimeline

/* istanbul ignore next */
_Timeline.install = function install(Vue: VueConstructor) {
  Vue.component(_Timeline.name, _Timeline)
}

export default _Timeline
