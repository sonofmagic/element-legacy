<script>
import Popper from 'element-ui/src/utils/vue-popper'

export default {
  name: 'ElDropdownMenu',

  componentName: 'ElDropdownMenu',

  mixins: [Popper],

  inject: ['dropdown'],

  props: {
    visibleArrow: {
      type: Boolean,
      default: true,
    },
    arrowOffset: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      size: this.dropdown.dropdownSize,
    }
  },

  watch: {
    'dropdown.placement': {
      immediate: true,
      handler(val) {
        this.currentPlacement = val
      },
    },
  },

  created() {
    this.$on('updatePopper', () => {
      if (this.showPopper) { this.updatePopper() }
    })
    this.$on('visible', (val) => {
      this.showPopper = val
    })
  },

  mounted() {
    this.dropdown.popperElm = this.popperElm = this.$el
    this.referenceElm = this.dropdown.$el
    // compatible with 2.6 new v-slot syntax
    // issue link https://github.com/ElemeFE/element/issues/14345
    this.dropdown.initDomOperation()
  },
}
</script>

<template>
  <transition name="el-zoom-in-top" @after-leave="doDestroy">
    <ul v-show="showPopper" class="el-dropdown-menu el-popper" :class="[size && `el-dropdown-menu--${size}`]">
      <slot />
    </ul>
  </transition>
</template>
