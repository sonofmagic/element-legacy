import Picker from '../picker.vue';
import Panel from '../panel/time-select.vue';

export default {
  mixins: [Picker],

  name: 'ElTimeSelect',

  componentName: 'ElTimeSelect',

  props: {
    type: {
      type: String,
      default: 'time-select'
    }
  },

  beforeCreate() {
    this.panel = Panel;
  }
};
