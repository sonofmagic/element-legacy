import type { VNode } from 'vue'
import { defineComponent, h } from 'vue'
import BaseDatePicker, { datePickerBaseProps } from './base-date-picker'
import DateRangeSplit from './date-range-split.vue'

export default defineComponent({
  name: 'ElDatePickerV2',

  props: datePickerBaseProps,

  components: {
    BaseDatePicker,
    DateRangeSplit,
  },

  computed: {
    isSplitRange(): boolean {
      return this.type === 'daterange' || this.type === 'datetimerange'
    },
  },

  methods: {
    focus() {
      const inner: any = this.$refs.inner
      if (inner && typeof inner.focus === 'function') {
        inner.focus()
      }
    },

    blur() {
      const inner: any = this.$refs.inner
      if (inner && typeof inner.blur === 'function') {
        inner.blur()
      }
    },
  },

  render(): VNode {
    const component = this.isSplitRange ? DateRangeSplit : BaseDatePicker

    return h(component, {
      ref: 'inner',
      props: this.$props,
      attrs: this.$attrs,
      on: this.$listeners,
      scopedSlots: this.$scopedSlots,
    }, this.$slots.default)
  },
})
