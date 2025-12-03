<script lang="jsx">
export default {

  inject: ['elForm', 'elFormItem'],
  props: {
    isAutoWidth: Boolean,
    updateAll: Boolean,
  },

  data() {
    return {
      computedWidth: 0,
    }
  },

  watch: {
    computedWidth(val, oldVal) {
      if (this.updateAll) {
        this.elForm.registerLabelWidth(val, oldVal)
        this.elFormItem.updateComputedLabelWidth(val)
      }
    },
  },

  mounted() {
    this.updateLabelWidth('update')
  },

  updated() {
    this.updateLabelWidth('update')
  },

  beforeDestroy() {
    this.updateLabelWidth('remove')
  },

  methods: {
    getLabelWidth() {
      if (this.$el && this.$el.firstElementChild) {
        const computedWidth = window.getComputedStyle(this.$el.firstElementChild).width
        return Math.ceil(Number.parseFloat(computedWidth))
      }
      else {
        return 0
      }
    },
    updateLabelWidth(action = 'update') {
      if (this.$slots.default && this.isAutoWidth && this.$el.firstElementChild) {
        if (action === 'update') {
          this.computedWidth = this.getLabelWidth()
        }
        else if (action === 'remove') {
          this.elForm.deregisterLabelWidth(this.computedWidth)
        }
      }
    },
  },

  render() {
    const slots = this.$slots.default
    if (!slots) { return null }
    if (this.isAutoWidth) {
      const autoLabelWidth = this.elForm.autoLabelWidth
      const style = {}
      if (autoLabelWidth && autoLabelWidth !== 'auto') {
        const marginLeft = Number.parseInt(autoLabelWidth, 10) - this.computedWidth
        if (marginLeft) {
          style.marginLeft = `${marginLeft}px`
        }
      }
      return (
        <div class="el-form-item__label-wrap" style={style}>
          { slots }
        </div>
      )
    }
    else {
      return slots[0]
    }
  },
}
</script>
