<script>
import { chain, isNumber, multiply, padStart, reduce } from 'element-legacy/src/utils/lodash'

export default {
  name: 'ElStatistic',
  props: {
    decimalSeparator: {
      type: String,
      default: '.',
    },
    groupSeparator: {
      type: String,
      default: '',
    },
    precision: {
      type: Number,
      default: null,
    },
    value: {
      type: [String, Number, Date],
      default: '',
    },
    prefix: {
      type: String,
      default: '',
    },
    suffix: {
      type: String,
      default: '',
    },
    title: {
      type: [String, Number],
      default: '',
    },
    timeIndices: {
      type: Boolean,
      default: false,
    },
    valueStyle: {
      type: Object,
      default() {
        return {}
      },
    },
    format: {
      type: String,
      default: 'HH:mm:ss:SSS',
    },
    rate: {
      type: Number,
      default: 1000,
    },
  },
  data() {
    return {
      disposeValue: '',
      timeTask: null,
      REFRESH_INTERVAL: 1000 / 30,
    }
  },
  watch: {
    value() {
      this.branch()
    },
    groupSeparator() {
      this.dispose()
    },
    mulriple() {
      this.dispose()
    },
  },
  created() {
    this.branch()
  },
  methods: {
    branch() {
      const { timeIndices, countDown, dispose } = this
      if (timeIndices) {
        countDown(this.value.valueOf() || this.value)
      }
      else {
        dispose()
      }
    },
    magnification(num, mulriple = 1000, groupSeparator = ',') {
      // magnification factor
      const level = String(mulriple).length
      return num.replace(new RegExp(`(\\d)(?=(\\d{${level - 1}})+$)`, 'g'), `$1${groupSeparator}`)
    },
    dispose() {
      let { value, rate, groupSeparator } = this
      if (!isNumber(value)) { return false }
      if (this.precision) {
        value = value.toFixed(this.precision)
      }
      let [integer, decimal] = String(value).split('.')
      // 1000 multiplying power
      if (groupSeparator) {
        integer = this.magnification(integer, rate, groupSeparator)
      }
      const result = `${integer}${decimal ? this.decimalSeparator + decimal : ''}`
      this.disposeValue = result
      return result
    },
    diffDate(minuend, subtrahend) {
      return Math.max(minuend - subtrahend, 0)
    },
    suspend(isStop) {
      if (isStop) {
        if (this.timeTask) {
          clearInterval(this.timeTask)
          this.timeTask = null
        }
      }
      else {
        this.branch()
      }
      return this.disposeValue
    },
    formatTimeStr(time) {
      const { format } = this
      const escapeRegex = /\[[^\]]*\]/g
      const keepList = (format.match(escapeRegex) || []).map(str => str.slice(1, -1))
      const timeUnits = [
        ['Y', 1000 * 60 * 60 * 24 * 365], // years
        ['M', 1000 * 60 * 60 * 24 * 30], // months
        ['D', 1000 * 60 * 60 * 24], // days
        ['H', 1000 * 60 * 60], // hours
        ['m', 1000 * 60], // minutes
        ['s', 1000], // seconds
        ['S', 1], // million seconds
      ]
      const formatText = reduce(
        timeUnits,
        (con, item) => {
          const name = item[0]
          return con.replace(new RegExp(`${name}+`, 'g'), (match) => {
            const sum = chain(time).divide(item[1]).floor(0).value()
            time -= multiply(sum, item[1])
            return padStart(String(sum), String(match).length, 0)
          })
        },
        format,
      )
      let index = 0
      return formatText.replace(escapeRegex, () => {
        const match = keepList[index]
        index += 1
        return match
      })
    },
    stopTime(time) {
      let result = true // stop
      if (time) {
        this.$emit('change', time)
        result = false
      }
      else {
        result = true
        this.suspend(true)
        this.$emit('finish', true)
      }
      return result
    },
    countDown(timeVlaue) {
      const { REFRESH_INTERVAL, timeTask, diffDate, formatTimeStr, stopTime, suspend } = this
      if (timeTask) { return }
      const than = this
      this.timeTask = setInterval(() => {
        const diffTiem = diffDate(timeVlaue, Date.now())
        than.disposeValue = formatTimeStr(diffTiem)
        stopTime(diffTiem)
      }, REFRESH_INTERVAL)
      this.$once('hook:beforeDestroy', () => {
        suspend(true)
      })
    },
  },
}
</script>

<template>
  <div class="el-statistic">
    <div v-if="title || $slots.title" class="head">
      <slot name="title">
        <span class="title">
          {{ title }}
        </span>
      </slot>
    </div>
    <div class="con">
      <span v-if="prefix || $slots.prefix" class="prefix">
        <slot name="prefix">
          {{ prefix }}
        </slot>
      </span>
      <span class="number" :style="valueStyle">
        <slot name="formatter"> {{ disposeValue }}</slot>
      </span>
      <span v-if="suffix || $slots.suffix" class="suffix">
        <slot name="suffix">
          {{ suffix }}
        </slot>
      </span>
    </div>
  </div>
</template>
