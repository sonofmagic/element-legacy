import { defineComponent } from 'vue'
import TimeRangePanel from '../panel/time-range.vue'
import TimePanel from '../panel/time.vue'
import Picker from '../picker.vue'

export default defineComponent({
  name: 'ElTimePicker',

  mixins: [Picker],

  props: {
    isRange: Boolean,
    arrowControl: Boolean,
  },

  data() {
    return {
      type: '',
    }
  },

  watch: {
    isRange(isRange) {
      if (this.picker) {
        this.unmountPicker()
        this.type = isRange ? 'timerange' : 'time'
        this.panel = isRange ? TimeRangePanel : TimePanel
        this.mountPicker()
      }
      else {
        this.type = isRange ? 'timerange' : 'time'
        this.panel = isRange ? TimeRangePanel : TimePanel
      }
    },
  },

  created() {
    this.type = this.isRange ? 'timerange' : 'time'
    this.panel = this.isRange ? TimeRangePanel : TimePanel
  },
})
