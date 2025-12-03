<script>
import emitter from 'element-ui/src/mixins/emitter'
import Focus from 'element-ui/src/mixins/focus'
import Migrating from 'element-ui/src/mixins/migrating'

export default {
  name: 'ElSwitch',
  mixins: [Focus('input'), Migrating, emitter],
  inject: {
    elForm: {
      default: '',
    },
  },
  props: {
    value: {
      type: [Boolean, String, Number],
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 40,
    },
    activeIconClass: {
      type: String,
      default: '',
    },
    inactiveIconClass: {
      type: String,
      default: '',
    },
    activeText: String,
    inactiveText: String,
    activeColor: {
      type: String,
      default: '',
    },
    inactiveColor: {
      type: String,
      default: '',
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: true,
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
    validateEvent: {
      type: Boolean,
      default: true,
    },
    id: String,
  },
  data() {
    return {
      coreWidth: this.width,
    }
  },
  computed: {
    checked() {
      return this.value === this.activeValue
    },
    switchDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    },
  },
  watch: {
    checked() {
      this.$refs.input.checked = this.checked
      if (this.activeColor || this.inactiveColor) {
        this.setBackgroundColor()
      }
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', [this.value])
      }
    },
  },
  created() {
    if (!~[this.activeValue, this.inactiveValue].indexOf(this.value)) {
      this.$emit('input', this.inactiveValue)
    }
  },
  mounted() {
    /* istanbul ignore if */
    this.coreWidth = this.width || 40
    if (this.activeColor || this.inactiveColor) {
      this.setBackgroundColor()
    }
    this.$refs.input.checked = this.checked
  },
  methods: {
    handleChange(event) {
      const val = this.checked ? this.inactiveValue : this.activeValue
      this.$emit('input', val)
      this.$emit('change', val)
      this.$nextTick(() => {
        // set input's checked property
        // in case parent refuses to change component's value
        if (this.$refs.input) {
          this.$refs.input.checked = this.checked
        }
      })
    },
    setBackgroundColor() {
      const newColor = this.checked ? this.activeColor : this.inactiveColor
      this.$refs.core.style.borderColor = newColor
      this.$refs.core.style.backgroundColor = newColor
    },
    switchValue() {
      !this.switchDisabled && this.handleChange()
    },
    getMigratingConfig() {
      return {
        props: {
          'on-color': 'on-color is renamed to active-color.',
          'off-color': 'off-color is renamed to inactive-color.',
          'on-text': 'on-text is renamed to active-text.',
          'off-text': 'off-text is renamed to inactive-text.',
          'on-value': 'on-value is renamed to active-value.',
          'off-value': 'off-value is renamed to inactive-value.',
          'on-icon-class': 'on-icon-class is renamed to active-icon-class.',
          'off-icon-class': 'off-icon-class is renamed to inactive-icon-class.',
        },
      }
    },
  },
}
</script>

<template>
  <div
    class="el-switch"
    :class="{ 'is-disabled': switchDisabled, 'is-checked': checked }"
    role="switch"
    :aria-checked="checked"
    :aria-disabled="switchDisabled"
    @click.prevent="switchValue"
  >
    <input
      :id="id"
      ref="input"
      class="el-switch__input"
      type="checkbox"
      :name="name"
      :true-value="activeValue"
      :false-value="inactiveValue"
      :disabled="switchDisabled"
      @change="handleChange"
      @keydown.enter="switchValue"
    >
    <span
      v-if="inactiveIconClass || inactiveText" class="el-switch__label el-switch__label--left"
      :class="[!checked ? 'is-active' : '']"
    >
      <i v-if="inactiveIconClass" :class="[inactiveIconClass]" />
      <span v-if="!inactiveIconClass && inactiveText" :aria-hidden="checked">{{ inactiveText }}</span>
    </span>
    <span ref="core" class="el-switch__core" :style="{ width: `${coreWidth}px` }" />
    <span
      v-if="activeIconClass || activeText" class="el-switch__label el-switch__label--right"
      :class="[checked ? 'is-active' : '']"
    >
      <i v-if="activeIconClass" :class="[activeIconClass]" />
      <span v-if="!activeIconClass && activeText" :aria-hidden="!checked">{{ activeText }}</span>
    </span>
  </div>
</template>
