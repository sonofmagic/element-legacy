<script>
import { getStyleDisplayName, getStyleDisplayValue } from '../utils/utils'
import ColorPicker from './color-picker'
import Mixin from './mixin.vue'

export default {
  components: {
    ColorPicker,
  },
  mixins: [Mixin],
  data() {
    return {
      pickerColor: '',
    }
  },
  computed: {
    golbalColor() {
      return this.golbalValue.color
    },
    displayValue() {
      return getStyleDisplayValue(this.mergedValue, this.golbalColor)
    },
    golbalColorList() {
      return this.isGlobal
        ? []
        : Object.keys(this.golbalColor).map(c => (
            {
              label: getStyleDisplayName(this.golbalColor[c]),
              value: this.golbalColor[c].value,
              variable: c,
            }
          ))
    },
  },
  watch: {
    displayValue: {
      immediate: true,
      handler(value) {
        if (value.startsWith('#')) {
          this.pickerColor = value
        }
      },
    },
  },
  methods: {
    onInputClick() {
      this.$refs.colorPicker && this.$refs.colorPicker.handleTrigger()
    },
    onPickerChange(e) {
      this.onChange(e.variable || e)
    },
  },
}
</script>

<template>
  <section :key="displayName" class="config">
    <div class="config-label">
      <el-tooltip :content="displayName" placement="top">
        <span>{{ displayKeyName }}</span>
      </el-tooltip>
    </div>
    <div class="config-content">
      <div class="content-80">
        <el-input
          slot="reference"
          size="medium"
          :value="displayValue"
          readonly
          @click.native="onInputClick"
        />
      </div>
      <div class="content-20">
        <ColorPicker
          ref="colorPicker"
          v-model="pickerColor"
          size="medium"
          class="colorPicker"
          :colorList="golbalColorList"
          @change="onPickerChange"
        />
      </div>
    </div>
  </section>
</template>

<style>
input {
  cursor: pointer;
}
.colorPicker {
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
