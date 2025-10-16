<script lang="ts">
// @ts-nocheck
import Locale from 'element-ui/src/mixins/locale'
import { clearMilliseconds, clearTime, formatDate, isDate, limitTimeRange, timeWithinRange } from 'element-ui/src/utils/date-util'
import TimeSpinner from '../basic/time-spinner.vue'

export default {

  components: {
    TimeSpinner,
  },
  mixins: [Locale],

  props: {
    visible: Boolean,
    timeArrowControl: Boolean,
  },

  data() {
    return {
      popperClass: '',
      format: 'HH:mm:ss',
      value: '',
      defaultValue: null,
      date: new Date(),
      oldValue: new Date(),
      selectableRange: [],
      selectionRange: [0, 2],
      disabled: false,
      arrowControl: false,
      needInitAdjust: true,
    }
  },

  computed: {
    showSeconds() {
      return (this.format || '').includes('ss')
    },
    useArrow() {
      return this.arrowControl || this.timeArrowControl || false
    },
    amPmMode() {
      if ((this.format || '').includes('A')) {
        return 'A'
      }
      if ((this.format || '').includes('a')) {
        return 'a'
      }
      return ''
    },
    displayedTime() {
      return isDate(this.date)
        ? formatDate(this.date, this.format || 'HH:mm:ss')
        : ''
    },
  },

  watch: {
    visible(val) {
      if (val) {
        this.oldValue = this.value
        this.$nextTick(() => {
          const spinner = this.$refs.spinner
          if (!spinner) {
            return
          }
          this.adjustSpinners(true)
          spinner.emitSelectRange('hours')
          this.needInitAdjust = false
        })
      }
      else {
        this.needInitAdjust = true
        this.$emit('dodestroy')
      }
    },

    value(newVal) {
      let date
      if (newVal instanceof Date) {
        date = limitTimeRange(newVal, this.selectableRange, this.format)
      }
      else if (!newVal) {
        date = this.defaultValue ? new Date(this.defaultValue) : clearTime(new Date())
      }

      this.date = date
      if (this.visible && this.needInitAdjust) {
        this.$nextTick(_ => this.adjustSpinners(true))
        this.needInitAdjust = false
      }
    },

    selectableRange(val) {
      this.$refs.spinner.selectableRange = val
    },

    defaultValue(val) {
      if (!isDate(this.value)) {
        this.date = val ? new Date(val) : new Date()
      }
    },
  },

  mounted() {
    this.$nextTick(() => this.handleConfirm(true, true))
    this.$emit('mounted')
  },

  methods: {
    handleCancel() {
      this.$emit('pick', this.oldValue, false)
    },

    handleChange(date, source) {
      // this.visible avoids edge cases, when use scrolls during panel closing animation
      if (this.visible) {
        this.date = clearMilliseconds(date)
        // if date is out of range, do not emit
        if (this.isValidValue(this.date)) {
          const payload = source === 'click'
            ? [this.date, true, 'click']
            : [this.date, true, 'preview']
          this.$emit('pick', ...payload)
        }
      }
    },

    setSelectionRange(start, end) {
      this.$emit('select-range', start, end)
      this.selectionRange = [start, end]
    },

    handleConfirm(visible = false, first) {
      if (first) {
        return
      }
      const date = clearMilliseconds(limitTimeRange(this.date, this.selectableRange, this.format))
      this.$emit('pick', date, visible, first)
    },

    handleKeydown(event) {
      const keyCode = event.keyCode
      const mapping = { 38: -1, 40: 1, 37: -1, 39: 1 }

      // Left or Right
      if (keyCode === 37 || keyCode === 39) {
        const step = mapping[keyCode]
        this.changeSelectionRange(step)
        event.preventDefault()
        return
      }

      // Up or Down
      if (keyCode === 38 || keyCode === 40) {
        const step = mapping[keyCode]
        this.$refs.spinner.scrollDown(step)
        event.preventDefault()
      }
    },

    isValidValue(date) {
      return timeWithinRange(date, this.selectableRange, this.format)
    },

    adjustSpinners(instant = false) {
      return this.$refs.spinner.adjustSpinners(instant)
    },

    changeSelectionRange(step) {
      const list = [0, 3].concat(this.showSeconds ? [6] : [])
      const mapping = ['hours', 'minutes'].concat(this.showSeconds ? ['seconds'] : [])
      const index = list.indexOf(this.selectionRange[0])
      const next = (index + step + list.length) % list.length
      this.$refs.spinner.emitSelectRange(mapping[next])
    },

    handleHover(date) {
      if (!this.visible) {
        this.$emit('hover-date', null)
        return
      }
      if (!date) {
        this.$emit('hover-date', null)
        return
      }
      const normalized = clearMilliseconds(limitTimeRange(date, this.selectableRange, this.format))
      if (!this.isValidValue(normalized)) {
        return
      }
      this.$emit('hover-date', normalized)
    },
  },
}
</script>

<template>
  <div
    v-show="visible"
    class="el-time-panel-v2"
    :class="popperClass"
  >
    <div class="el-time-panel-v2__current">
      {{ displayedTime }}
    </div>
    <div class="el-time-panel-v2__content" :class="{ 'has-seconds': showSeconds }">
      <TimeSpinner
        ref="spinner"
        :arrow-control="useArrow"
        :show-seconds="showSeconds"
        :am-pm-mode="amPmMode"
        :date="date"
        @change="handleChange"
        @select-range="setSelectionRange"
        @hover="handleHover"
      />
    </div>
  </div>
</template>
