<script>
export default {
  name: 'ElTabPane',

  componentName: 'ElTabPane',

  props: {
    label: String,
    labelContent: Function,
    name: String,
    closable: Boolean,
    disabled: Boolean,
    lazy: Boolean,
  },

  data() {
    return {
      index: null,
      loaded: false,
    }
  },

  computed: {
    isClosable() {
      return this.closable || this.$parent.closable
    },
    active() {
      const active = this.$parent.currentName === (this.name || this.index)
      if (active) {
        this.loaded = true
      }
      return active
    },
    paneName() {
      return this.name || this.index
    },
  },

  updated() {
    this.$parent.$emit('tab-nav-update')
  },
}
</script>

<template>
  <div
    v-if="(!lazy || loaded) || active"
    v-show="active"
    :id="`pane-${paneName}`"
    class="el-tab-pane"
    role="tabpanel"
    :aria-hidden="!active"
    :aria-labelledby="`tab-${paneName}`"
  >
    <slot />
  </div>
</template>
