<script lang="ts">
// @ts-nocheck
import ElInput from 'element-ui/packages/input'
import ElTooltip from 'element-ui/packages/tooltip'
import Emitter from 'element-ui/src/mixins/emitter'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import { isDateObject } from 'element-ui/src/utils/date-util'
import merge from 'element-ui/src/utils/merge'
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'
import Popper from 'element-ui/src/utils/vue-popper'
import Vue from 'vue'
import {
  DEFAULT_FORMATS,
  formatAsFormatAndType,
  listablePropValidator,
  parseAsFormatAndType,
  TYPE_VALUE_RESOLVER_MAP,
  valueEquals,
} from './utils/shared'

const NewPopper = {
  props: {
    appendToBody: Popper.props.appendToBody,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    arrowOffset: Popper.props.arrowOffset,
    transformOrigin: Popper.props.transformOrigin,
  },
  methods: Popper.methods,
  data() {
    return merge({ visibleArrow: true }, Popper.data)
  },
  beforeDestroy: Popper.beforeDestroy,
}

const HAVE_TRIGGER_TYPES = [
  'date',
  'datetime',
  'time',
  'time-select',
  'week',
  'month',
  'year',
  'daterange',
  'monthrange',
  'timerange',
  'datetimerange',
  'dates',
  'months',
  'years',
]
const PLACEMENT_MAP = {
  left: 'bottom-start',
  center: 'bottom',
  right: 'bottom-end',
}

export default {

  components: { ElInput, ElTooltip },

  directives: { Clickoutside },
  mixins: [Emitter, NewPopper],

  inject: {
    elForm: {
      default: '',
    },
    elFormItem: {
      default: '',
    },
  },

  props: {
    size: String,
    format: String,
    valueFormat: String,
    readonly: Boolean,
    placeholder: String,
    startPlaceholder: String,
    endPlaceholder: String,
    prefixIcon: String,
    clearIcon: {
      type: String,
      default: 'el-icon-circle-close',
    },
    name: {
      default: '',
      validator: listablePropValidator,
    },
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: true,
    },
    id: {
      default: '',
      validator: listablePropValidator,
    },
    popperClass: String,
    editable: {
      type: Boolean,
      default: true,
    },
    align: {
      type: String,
      default: 'left',
    },
    value: {},
    defaultValue: {},
    defaultTime: {},
    rangeSeparator: {
      default: '-',
    },
    pickerOptions: {},
    unlinkPanels: Boolean,
    validateEvent: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      pickerVisible: false,
      showClose: false,
      userInput: null,
      valueOnOpen: null, // value when picker opens, used to determine whether to emit change
      unwatchPickerOptions: null,
      hoverPlaceholder: '',
      singleInputOverflow: false,
      rangeInputOverflow: [false, false],
      referenceEl: null,
    }
  },

  computed: {
    ranged() {
      return this.type.includes('range')
    },

    reference() {
      const reference = this.$refs.reference
      return reference.$el || reference
    },

    refInput() {
      if (this.reference) {
        return [].slice.call(this.reference.querySelectorAll('input'))
      }
      return []
    },

    valueIsEmpty() {
      const val = this.value
      if (Array.isArray(val)) {
        for (let i = 0, len = val.length; i < len; i++) {
          if (val[i]) {
            return false
          }
        }
      }
      else {
        if (val) {
          return false
        }
      }
      return true
    },

    displayedPlaceholder() {
      if (this.ranged) {
        return this.placeholder
      }
      if (this.hoverPlaceholder && this.valueIsEmpty) {
        return this.hoverPlaceholder
      }
      return this.placeholder
    },

    triggerClass() {
      return this.prefixIcon || (this.type.includes('time') ? 'el-icon-time' : 'el-icon-date')
    },

    selectionMode() {
      if (this.type === 'week') {
        return 'week'
      }
      else if (this.type === 'month') {
        return 'month'
      }
      else if (this.type === 'year') {
        return 'year'
      }
      else if (this.type === 'dates') {
        return 'dates'
      }
      else if (this.type === 'months') {
        return 'months'
      }
      else if (this.type === 'years') {
        return 'years'
      }

      return 'day'
    },

    haveTrigger() {
      if (typeof this.showTrigger !== 'undefined') {
        return this.showTrigger
      }
      return HAVE_TRIGGER_TYPES.includes(this.type)
    },

    displayValue() {
      const formattedValue = formatAsFormatAndType(this.parsedValue, this.format, this.type, this.rangeSeparator)
      if (Array.isArray(this.userInput)) {
        return [
          this.userInput[0] || (formattedValue && formattedValue[0]) || '',
          this.userInput[1] || (formattedValue && formattedValue[1]) || '',
        ]
      }
      else if (this.userInput !== null) {
        return this.userInput
      }
      else if (formattedValue) {
        return (this.type === 'dates' || this.type === 'years' || this.type === 'months')
          ? formattedValue.join(', ')
          : formattedValue
      }
      else {
        return ''
      }
    },

    rangeDisplayValues() {
      if (Array.isArray(this.displayValue)) {
        return this.displayValue
      }
      return [this.displayValue, this.displayValue]
    },

    parsedValue() {
      if (!this.value) {
        return this.value
      } // component value is not set
      if (this.type === 'time-select') {
        return this.value
      } // time-select does not require parsing, this might change in next major version

      const valueIsDateObject = isDateObject(this.value) || (Array.isArray(this.value) && this.value.every(isDateObject))
      if (valueIsDateObject) {
        return this.value
      }

      if (this.valueFormat) {
        return parseAsFormatAndType(this.value, this.valueFormat, this.type, this.rangeSeparator) || this.value
      }

      // NOTE: deal with common but incorrect usage, should remove in next major version
      // user might provide string / timestamp without value-format, coerce them into date (or array of date)
      return Array.isArray(this.value) ? this.value.map(val => new Date(val)) : new Date(this.value)
    },

    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize
    },

    pickerSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size
    },

    pickerDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    },

    firstInputId() {
      const obj = {}
      let id
      if (this.ranged) {
        id = this.id && this.id[0]
      }
      else {
        id = this.id
      }
      if (id) {
        obj.id = id
      }
      return obj
    },

    secondInputId() {
      const obj = {}
      let id
      if (this.ranged) {
        id = this.id && this.id[1]
      }
      if (id) {
        obj.id = id
      }
      return obj
    },
  },

  watch: {
    pickerVisible(val) {
      if (this.readonly || this.pickerDisabled) {
        return
      }
      if (val) {
        this.showPicker()
        this.valueOnOpen = Array.isArray(this.value) ? [...this.value] : this.value
      }
      else {
        this.hidePicker()
        this.emitChange(this.value)
        this.userInput = null
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.blur')
        }
        this.$emit('blur', this)
        this.blur()
      }
    },
    parsedValue: {
      immediate: true,
      handler(val) {
        if (this.picker) {
          this.picker.value = val
        }
      },
    },
    defaultValue(val) {
      // NOTE: should eventually move to jsx style picker + panel ?
      if (this.picker) {
        this.picker.defaultValue = val
      }
    },
    value(val, oldVal) {
      if (!valueEquals(val, oldVal) && !this.pickerVisible && this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', val)
      }
    },
    displayValue() {
      this.updateOverflowStatus()
    },
    ranged() {
      this.$nextTick(() => {
        this.attachReferenceResize()
        this.updateOverflowStatus()
      })
    },
  },

  created() {
    // vue-popper
    this.popperOptions = {
      boundariesPadding: 0,
      gpuAcceleration: false,
    }
    this.placement = PLACEMENT_MAP[this.align] || PLACEMENT_MAP.left

    this.$on('fieldReset', this.handleFieldReset)
  },

  mounted() {
    this.attachReferenceResize()
    this.updateOverflowStatus()
  },

  beforeDestroy() {
    this.detachReferenceResize()
  },

  methods: {
    attachReferenceResize() {
      if (this.$isServer) {
        return
      }
      this.$nextTick(() => {
        const reference = this.reference
        if (!reference) {
          return
        }
        if (this.referenceEl === reference) {
          return
        }
        this.detachReferenceResize()
        this.referenceEl = reference
        addResizeListener(this.referenceEl, this.updateOverflowStatus)
      })
    },

    detachReferenceResize() {
      if (this.referenceEl) {
        removeResizeListener(this.referenceEl, this.updateOverflowStatus)
        this.referenceEl = null
      }
    },

    updateOverflowStatus() {
      if (this.$isServer) {
        return
      }
      this.$nextTick(() => {
        const inputs = this.refInput
        if (this.ranged) {
          const first = inputs[0] || null
          const second = inputs[1] || null
          this.rangeInputOverflow = [
            this.isInputOverflow(first),
            this.isInputOverflow(second),
          ]
        }
        else {
          const input = inputs[0] || null
          this.singleInputOverflow = this.isInputOverflow(input)
        }
      })
    },

    isInputOverflow(input) {
      if (!input) {
        return false
      }
      return input.scrollWidth > input.clientWidth
    },

    focus() {
      if (!this.ranged) {
        this.$refs.reference.focus()
      }
      else {
        this.handleFocus()
      }
    },

    blur() {
      this.refInput.forEach(input => input.blur())
    },

    // {parse, formatTo} Value deals maps component value with internal Date
    parseValue(value) {
      const isParsed = isDateObject(value) || (Array.isArray(value) && value.every(isDateObject))
      if (this.valueFormat && !isParsed) {
        return parseAsFormatAndType(value, this.valueFormat, this.type, this.rangeSeparator) || value
      }
      else {
        return value
      }
    },

    formatToValue(date) {
      const isFormattable = isDateObject(date) || (Array.isArray(date) && date.every(isDateObject))
      if (this.valueFormat && isFormattable) {
        return formatAsFormatAndType(date, this.valueFormat, this.type, this.rangeSeparator)
      }
      else {
        return date
      }
    },

    // {parse, formatTo} String deals with user input
    parseString(value) {
      const type = Array.isArray(value) ? this.type : this.type.replace('range', '')
      return parseAsFormatAndType(value, this.format, type)
    },

    formatToString(value) {
      const type = Array.isArray(value) ? this.type : this.type.replace('range', '')
      return formatAsFormatAndType(value, this.format, type)
    },

    handleMouseEnter() {
      this.updateOverflowStatus()
      if (this.readonly || this.pickerDisabled) {
        return
      }
      if (!this.valueIsEmpty && this.clearable) {
        this.showClose = true
      }
    },

    handleChange() {
      if (this.userInput) {
        const value = this.parseString(this.displayValue)
        if (value) {
          this.picker.value = value
          if (this.isValidValue(value)) {
            this.emitInput(value)
            this.userInput = null
          }
        }
      }
      if (this.userInput === '') {
        this.emitInput(null)
        this.emitChange(null)
        this.userInput = null
      }
    },

    handleStartInput(event) {
      if (this.userInput) {
        this.userInput = [event.target.value, this.userInput[1]]
      }
      else {
        this.userInput = [event.target.value, null]
      }
    },

    handleEndInput(event) {
      if (this.userInput) {
        this.userInput = [this.userInput[0], event.target.value]
      }
      else {
        this.userInput = [null, event.target.value]
      }
    },

    handleStartChange() {
      const value = this.parseString(this.userInput && this.userInput[0])
      if (value) {
        this.userInput = [this.formatToString(value), this.displayValue[1]]
        const newValue = [value, this.picker.value && this.picker.value[1]]
        this.picker.value = newValue
        if (this.isValidValue(newValue)) {
          this.emitInput(newValue)
          this.userInput = null
        }
      }
    },

    handleEndChange() {
      const value = this.parseString(this.userInput && this.userInput[1])
      if (value) {
        this.userInput = [this.displayValue[0], this.formatToString(value)]
        const newValue = [this.picker.value && this.picker.value[0], value]
        this.picker.value = newValue
        if (this.isValidValue(newValue)) {
          this.emitInput(newValue)
          this.userInput = null
        }
      }
    },

    handleClickIcon(event) {
      if (this.readonly || this.pickerDisabled) {
        return
      }
      if (this.showClose) {
        this.valueOnOpen = this.value
        event.stopPropagation()
        this.emitInput(null)
        this.emitChange(null)
        this.showClose = false
        if (this.picker && typeof this.picker.handleClear === 'function') {
          this.picker.handleClear()
        }
      }
      else {
        this.pickerVisible = !this.pickerVisible
      }
    },

    handleClose() {
      if (!this.pickerVisible) {
        return
      }
      this.pickerVisible = false
      this.hoverPlaceholder = ''

      if (this.type === 'dates' || this.type === 'years' || this.type === 'months') {
        // restore to former value
        const oldValue = parseAsFormatAndType(this.valueOnOpen, this.valueFormat, this.type, this.rangeSeparator) || this.valueOnOpen
        this.emitInput(oldValue)
      }
    },

    handleFieldReset(initialValue) {
      this.userInput = initialValue === '' ? null : initialValue
    },

    handleFocus() {
      const type = this.type

      if (HAVE_TRIGGER_TYPES.includes(type) && !this.pickerVisible) {
        this.pickerVisible = true
      }
      this.$emit('focus', this)
    },

    handleKeydown(event) {
      const keyCode = event.keyCode

      // ESC
      if (keyCode === 27) {
        this.pickerVisible = false
        event.stopPropagation()
        return
      }

      // Tab
      if (keyCode === 9) {
        if (!this.ranged) {
          this.handleChange()
          this.pickerVisible = this.picker.visible = false
          this.blur()
          event.stopPropagation()
        }
        else {
          // user may change focus between two input
          setTimeout(() => {
            if (!this.refInput.includes(document.activeElement)) {
              this.pickerVisible = false
              this.blur()
              event.stopPropagation()
            }
          }, 0)
        }
        return
      }

      // Enter
      if (keyCode === 13) {
        if (this.userInput === '' || this.isValidValue(this.parseString(this.displayValue))) {
          this.handleChange()
          this.pickerVisible = this.picker.visible = false
          this.blur()
        }
        event.stopPropagation()
        return
      }

      // if user is typing, do not let picker handle key input
      if (this.userInput) {
        event.stopPropagation()
        return
      }

      // delegate other keys to panel
      if (this.picker && this.picker.handleKeydown) {
        this.picker.handleKeydown(event)
      }
    },

    handleRangeClick() {
      const type = this.type

      if (HAVE_TRIGGER_TYPES.includes(type) && !this.pickerVisible) {
        this.pickerVisible = true
      }
      this.$emit('focus', this)
    },

    hidePicker() {
      if (this.picker) {
        this.picker.resetView && this.picker.resetView()
        this.pickerVisible = this.picker.visible = false
        this.destroyPopper()
      }
      this.hoverPlaceholder = ''
    },

    handlePanelHover(date) {
      const supportsPreview = !this.ranged && ['date', 'datetime', 'time'].includes(this.type)
      if (!supportsPreview) {
        this.hoverPlaceholder = ''
        return
      }
      if (!this.pickerVisible) {
        this.hoverPlaceholder = ''
        return
      }
      if (!date) {
        if (['datetime', 'time'].includes(this.type)) {
          return
        }
        this.hoverPlaceholder = ''
        return
      }
      if (this.userInput !== null) {
        return
      }
      this.hoverPlaceholder = this.formatToString(date)
    },

    showPicker() {
      if (this.$isServer) {
        return
      }
      if (!this.picker) {
        this.mountPicker()
      }
      this.hoverPlaceholder = ''

      this.picker.value = this.parsedValue
      this.picker.resetView && this.picker.resetView()

      this.pickerVisible = this.picker.visible = true

      this.updatePopper()

      this.$nextTick(() => {
        this.picker.adjustSpinners && this.picker.adjustSpinners(true)
      })
    },

    mountPicker() {
      this.picker = new Vue(this.panel).$mount()
      this.picker.defaultValue = this.defaultValue
      this.picker.defaultTime = this.defaultTime
      this.picker.popperClass = this.popperClass
      this.popperElm = this.picker.$el
      this.picker.width = this.reference.getBoundingClientRect().width
      this.picker.showTime = this.type === 'datetime' || this.type === 'datetimerange'
      this.picker.selectionMode = this.selectionMode
      this.picker.unlinkPanels = this.unlinkPanels
      this.picker.arrowControl = this.arrowControl || this.timeArrowControl || false
      this.$watch('format', (format) => {
        this.picker.format = format
      })

      const updateOptions = () => {
        const options = this.pickerOptions

        if (options && options.selectableRange) {
          let ranges = options.selectableRange
          const parser = TYPE_VALUE_RESOLVER_MAP.datetimerange.parser
          const format = DEFAULT_FORMATS.timerange

          ranges = Array.isArray(ranges) ? ranges : [ranges]
          this.picker.selectableRange = ranges.map(range => parser(range, format, this.rangeSeparator))
        }

        for (const option in options) {
          if (Object.prototype.hasOwnProperty.call(options, option)
          // 忽略 time-picker 的该配置项
            && option !== 'selectableRange') {
            this.picker[option] = options[option]
          }
        }

        // main format must prevail over undocumented pickerOptions.format
        if (this.format) {
          this.picker.format = this.format
        }
      }
      updateOptions()
      this.unwatchPickerOptions = this.$watch('pickerOptions', () => updateOptions(), { deep: true })
      this.$el.appendChild(this.picker.$el)
      this.picker.resetView && this.picker.resetView()

      this.picker.$on('dodestroy', this.doDestroy)
      this.picker.$on('pick', (date = '', visible = false, ...args) => {
        const [extra] = args
        const isPreview = extra === 'preview'

        if (isPreview) {
          if (!this.ranged && ['datetime', 'time'].includes(this.type)) {
            this.hoverPlaceholder = date ? this.formatToString(date) : ''
          }
          this.pickerVisible = this.picker.visible = true
          return
        }

        this.userInput = null
        this.hoverPlaceholder = ''
        this.pickerVisible = this.picker.visible = visible
        this.emitInput(date)
        this.picker.resetView && this.picker.resetView()
      })

      this.picker.$on('hover-date', this.handlePanelHover)

      this.picker.$on('select-range', (start, end, pos) => {
        if (this.refInput.length === 0) {
          return
        }
        if (!pos || pos === 'min') {
          this.refInput[0].setSelectionRange(start, end)
          this.refInput[0].focus()
        }
        else if (pos === 'max') {
          this.refInput[1].setSelectionRange(start, end)
          this.refInput[1].focus()
        }
      })
    },

    unmountPicker() {
      if (this.picker) {
        this.picker.$destroy()
        this.picker.$off()
        if (typeof this.unwatchPickerOptions === 'function') {
          this.unwatchPickerOptions()
        }
        this.picker.$el.parentNode.removeChild(this.picker.$el)
      }
      this.hoverPlaceholder = ''
    },

    emitChange(val) {
      // determine user real change only
      if (!valueEquals(val, this.valueOnOpen)) {
        this.$emit('change', val)
        this.valueOnOpen = val
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.change', val)
        }
      }
    },

    emitInput(val) {
      const formatted = this.formatToValue(val)
      if (!valueEquals(this.value, formatted)) {
        this.$emit('input', formatted)
      }
    },

    isValidValue(value) {
      if (!this.picker) {
        this.mountPicker()
      }
      if (this.picker.isValidValue) {
        return value && this.picker.isValidValue(value)
      }
      else {
        return true
      }
    },
  },
}
</script>

<template>
  <ElTooltip
    v-if="!ranged"
    effect="dark"
    placement="top"
    :disabled="!singleInputOverflow || !displayValue"
    :content="displayValue"
  >
    <ElInput
      v-bind="firstInputId"
      ref="reference"
      v-clickoutside="handleClose"
      class="el-date-editor-v2"
      :class="`el-date-editor-v2--${type}`"
      :readonly="!editable || readonly || type === 'dates' || type === 'week' || type === 'years' || type === 'months'"
      :disabled="pickerDisabled"
      :size="pickerSize"
      :name="name"
      :placeholder="displayedPlaceholder"
      :value="displayValue"
      :validateEvent="false"
      @focus="handleFocus"
      @keydown.native="handleKeydown"
      @input="value => userInput = value"
      @change="handleChange"
      @mouseenter.native="handleMouseEnter"
      @mouseleave.native="showClose = false"
    >
      <i
        v-if="haveTrigger"
        slot="suffix"
        class="el-input__icon"
        :class="[showClose ? `${clearIcon}` : '']"
        @click="handleClickIcon"
      />
    </ElInput>
  </ElTooltip>
  <div
    v-else
    ref="reference"
    v-clickoutside="handleClose"
    class="el-date-editor-v2 el-range-editor-v2 el-input__inner"
    :class="[
      `el-date-editor-v2--${type}`,
      pickerSize ? `el-range-editor-v2--${pickerSize}` : '',
      pickerDisabled ? 'is-disabled' : '',
      pickerVisible ? 'is-active' : '',
    ]"
    @click="handleRangeClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="showClose = false"
    @keydown="handleKeydown"
  >
    <ElTooltip
      effect="dark"
      placement="top"
      :disabled="!rangeInputOverflow[0] || !rangeDisplayValues[0]"
      :content="rangeDisplayValues[0]"
    >
      <input
        autocomplete="off"
        :placeholder="startPlaceholder"
        :value="rangeDisplayValues[0]"
        :disabled="pickerDisabled"
        v-bind="firstInputId"
        :readonly="!editable || readonly"
        :name="name && name[0]"
        class="el-range-input-v2"
        @input="handleStartInput"
        @change="handleStartChange"
        @focus="handleFocus"
      >
    </ElTooltip>
    <slot name="range-separator">
      <span class="el-range-separator-v2">{{ rangeSeparator }}</span>
    </slot>
    <ElTooltip
      effect="dark"
      placement="top"
      :disabled="!rangeInputOverflow[1] || !rangeDisplayValues[1]"
      :content="rangeDisplayValues[1]"
    >
      <input
        autocomplete="off"
        :placeholder="endPlaceholder"
        :value="rangeDisplayValues[1]"
        :disabled="pickerDisabled"
        v-bind="secondInputId"
        :readonly="!editable || readonly"
        :name="name && name[1]"
        class="el-range-input-v2"
        @input="handleEndInput"
        @change="handleEndChange"
        @focus="handleFocus"
      >
    </ElTooltip>
    <i
      v-if="haveTrigger"
      :class="[showClose ? `${clearIcon}` : '']"
      class="el-input__icon el-range-v2__close-icon"
      @click="handleClickIcon"
    />
  </div>
</template>
