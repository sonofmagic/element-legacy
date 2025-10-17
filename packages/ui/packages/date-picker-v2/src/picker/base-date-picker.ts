import type { Component, PropOptions } from 'vue'
import { defineComponent } from 'vue'
import DateRangePanel from '../panel/date-range.vue'
import DatePanel from '../panel/date.vue'
import MonthRangePanel from '../panel/month-range.vue'
import Picker from '../picker.vue'

function getPanel(type: string): Component {
  if (type === 'daterange' || type === 'datetimerange') {
    return DateRangePanel
  }
  else if (type === 'monthrange') {
    return MonthRangePanel
  }
  return DatePanel
}

export const datePickerBaseProps = {
  type: {
    type: String,
    default: 'date',
  } as PropOptions<string>,
  timeArrowControl: Boolean,
}

export default defineComponent({
  name: 'ElDatePickerV2Base',

  mixins: [Picker],

  props: datePickerBaseProps,

  watch: {
    type(type: string) {
      if (this.picker) {
        this.unmountPicker()
        this.panel = getPanel(type)
        this.mountPicker()
      }
      else {
        this.panel = getPanel(type)
      }
    },
  },

  created() {
    this.panel = getPanel(this.type)
  },
})
