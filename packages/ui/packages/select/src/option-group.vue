<script type="text/babel">
import Emitter from 'element-legacy/src/mixins/emitter'

export default {

  name: 'ElOptionGroup',
  mixins: [Emitter],

  componentName: 'ElOptionGroup',

  props: {
    label: String,
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      visible: true,
    }
  },

  watch: {
    disabled(val) {
      this.broadcast('ElOption', 'handleGroupDisabled', val)
    },
  },

  created() {
    this.$on('queryChange', this.queryChange)
  },

  mounted() {
    if (this.disabled) {
      this.broadcast('ElOption', 'handleGroupDisabled', this.disabled)
    }
  },

  methods: {
    queryChange() {
      this.visible = this.$children
        && Array.isArray(this.$children)
        && this.$children.some(option => option.visible === true)
    },
  },
}
</script>

<template>
  <ul v-show="visible" class="el-select-group__wrap">
    <li class="el-select-group__title">
      {{ label }}
    </li>
    <li>
      <ul class="el-select-group">
        <slot />
      </ul>
    </li>
  </ul>
</template>
