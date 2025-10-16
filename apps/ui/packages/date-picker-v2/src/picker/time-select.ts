import { defineComponent } from 'vue'
import Panel from '../panel/time-select.vue'
import Picker from '../picker.vue'

export default defineComponent({
  name: 'ElTimeSelect',

  mixins: [Picker],

  componentName: 'ElTimeSelect',

  props: {
    type: {
      type: String,
      default: 'time-select',
    },
  },

  beforeCreate() {
    this.panel = Panel
  },
})
