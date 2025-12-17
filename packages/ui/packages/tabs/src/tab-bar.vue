<script>
import { arrayFind } from 'element-legacy/src/utils/util'

export default {
  name: 'TabBar',

  inject: ['rootTabs'],

  props: {
    tabs: Array,
  },

  computed: {
    barStyle: {
      get() {
        const style = {}
        let offset = 0
        let tabSize = 0
        const sizeName = ['top', 'bottom'].includes(this.rootTabs.tabPosition) ? 'width' : 'height'
        const sizeDir = sizeName === 'width' ? 'x' : 'y'
        const firstUpperCase = (str) => {
          return str.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase())
        }
        this.tabs.every((tab, index) => {
          const $el = arrayFind(this.$parent.$refs.tabs || [], t => t.id.replace('tab-', '') === tab.paneName)
          if (!$el) { return false }

          if (!tab.active) {
            offset += $el[`client${firstUpperCase(sizeName)}`]
            return true
          }
          else {
            tabSize = $el[`client${firstUpperCase(sizeName)}`]
            const tabStyles = window.getComputedStyle($el)
            if (sizeName === 'width' && this.tabs.length > 1) {
              tabSize -= Number.parseFloat(tabStyles.paddingLeft) + Number.parseFloat(tabStyles.paddingRight)
            }
            if (sizeName === 'width') {
              offset += Number.parseFloat(tabStyles.paddingLeft)
            }
            return false
          }
        })

        const transform = `translate${firstUpperCase(sizeDir)}(${offset}px)`
        style[sizeName] = `${tabSize}px`
        style.transform = transform
        style.msTransform = transform
        style.webkitTransform = transform

        return style
      },
    },
  },
}
</script>

<template>
  <div class="el-tabs__active-bar" :class="`is-${rootTabs.tabPosition}`" :style="barStyle" />
</template>
