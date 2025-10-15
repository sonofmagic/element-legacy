import type { VueConstructor } from 'vue'
import Tree from './src/tree.vue'

type InstallableTree = typeof Tree & {
  install: (vue: VueConstructor) => void
}

const _Tree = Tree as InstallableTree

/* istanbul ignore next */
_Tree.install = function install(Vue: VueConstructor) {
  Vue.component(_Tree.name, _Tree)
}

export default _Tree
