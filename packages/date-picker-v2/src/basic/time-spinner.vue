<script lang="ts">
// @ts-nocheck
import ElScrollbar from 'element-ui/packages/scrollbar'
import RepeatClick from 'element-ui/src/directives/repeat-click'
import { getRangeHours, getRangeMinutes, modifyTime } from 'element-ui/src/utils/date-util'

const HOURS = Array.from({ length: 24 }, (_, index) => index)
const MINUTES = Array.from({ length: 60 }, (_, index) => index)
const SECONDS = Array.from({ length: 60 }, (_, index) => index)

export default {
  components: { ElScrollbar },

  directives: {
    repeatClick: RepeatClick,
  },

  props: {
    date: {},
    defaultValue: {}, // reserved for future use
    showSeconds: {
      type: Boolean,
      default: true,
    },
    arrowControl: Boolean,
    amPmMode: {
      type: String,
      default: '', // 'a': am/pm; 'A': AM/PM
    },
  },

  data() {
    return {
      selectableRange: [],
      currentScrollbar: 'hours',
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.adjustSpinners(true)
    })
  },

  computed: {
    hours() {
      return this.date.getHours()
    },
    minutes() {
      return this.date.getMinutes()
    },
    seconds() {
      return this.date.getSeconds()
    },
    hoursList() {
      return getRangeHours(this.selectableRange)
    },
    minutesList() {
      return getRangeMinutes(this.selectableRange, this.hours)
    },
    arrowHourList() {
      const hours = this.hours
      return [
        hours > 0 ? hours - 1 : undefined,
        hours,
        hours < 23 ? hours + 1 : undefined,
      ]
    },
    arrowMinuteList() {
      const minutes = this.minutes
      return [
        minutes > 0 ? minutes - 1 : undefined,
        minutes,
        minutes < 59 ? minutes + 1 : undefined,
      ]
    },
    arrowSecondList() {
      const seconds = this.seconds
      return [
        seconds > 0 ? seconds - 1 : undefined,
        seconds,
        seconds < 59 ? seconds + 1 : undefined,
      ]
    },
    availableHourValues() {
      return HOURS.filter(hour => !this.hoursList[hour])
    },
    availableMinuteValues() {
      return MINUTES.filter(minute => !!this.minutesList[minute])
    },
    hourOptions() {
      return HOURS
    },
    minuteOptions() {
      return MINUTES
    },
    secondOptions() {
      return SECONDS
    },
  },

  methods: {
    increase() {
      this.scrollDown(1)
    },

    decrease() {
      this.scrollDown(-1)
    },

    modifyDateField(type, value, emitSource) {
      let nextDate = this.date
      switch (type) {
        case 'hours':
          nextDate = modifyTime(this.date, value, this.minutes, this.seconds)
          break
        case 'minutes':
          nextDate = modifyTime(this.date, this.hours, value, this.seconds)
          break
        case 'seconds':
          nextDate = modifyTime(this.date, this.hours, this.minutes, value)
          break
      }
      this.$emit('change', nextDate, emitSource)
    },

    handleClick(type, value, disabled = false) {
      if (disabled) {
        return
      }
      this.modifyDateField(type, value, 'click')
      this.emitSelectRange(type)
      this.emitHoverPreview(type, value)
      this.$nextTick(() => {
        this.scrollToValue(type, value)
      })
    },

    emitSelectRange(type) {
      if (type === 'hours') {
        this.$emit('select-range', 0, 2)
      }
      else if (type === 'minutes') {
        this.$emit('select-range', 3, 5)
      }
      else if (type === 'seconds') {
        this.$emit('select-range', 6, 8)
      }
      this.currentScrollbar = type
    },

    scrollDown(step) {
      if (!step) {
        return
      }
      if (!this.currentScrollbar) {
        this.emitSelectRange('hours')
      }

      const type = this.currentScrollbar || 'hours'
      const values = this.getAvailableValues(type)
      if (!values.length) {
        return
      }

      const current = this.getCurrentValue(type)
      const currentIndex = values.indexOf(current)
      const direction = step > 0 ? 1 : -1
      const len = values.length

      if (currentIndex === -1) {
        const fallbackIndex = direction > 0 ? 0 : len - 1
        this.modifyDateField(type, values[fallbackIndex], 'scroll')
        this.$nextTick(() => {
          this.emitSelectRange(type)
          this.scrollToValue(type, values[fallbackIndex])
          this.emitHoverPreview(type, values[fallbackIndex])
        })
        return
      }

      let nextIndex = currentIndex
      let remaining = Math.abs(step)
      while (remaining > 0) {
        nextIndex = (nextIndex + direction + len) % len
        remaining--
      }

      this.modifyDateField(type, values[nextIndex], 'scroll')
      this.$nextTick(() => {
        this.emitSelectRange(type)
        this.scrollToValue(type, values[nextIndex])
        this.emitHoverPreview(type, values[nextIndex])
      })
    },

    getAvailableValues(type) {
      if (type === 'hours') {
        return this.availableHourValues
      }
      if (type === 'minutes') {
        return this.availableMinuteValues
      }
      return SECONDS
    },

    getCurrentValue(type) {
      if (type === 'hours') {
        return this.hours
      }
      if (type === 'minutes') {
        return this.minutes
      }
      return this.seconds
    },

    amPm(hour) {
      const shouldShowAmPm = this.amPmMode.toLowerCase() === 'a'
      if (!shouldShowAmPm) {
        return ''
      }
      const isCapital = this.amPmMode === 'A'
      let content = (hour < 12) ? ' am' : ' pm'
      if (isCapital) {
        content = content.toUpperCase()
      }
      return content
    },

    isHourDisabled(hour) {
      return !!this.hoursList[hour]
    },

    isMinuteDisabled(minute) {
      return !this.minutesList[minute]
    },

    formatHour(hour) {
      return (`0${this.amPmMode ? (hour % 12 || 12) : hour}`).slice(-2)
    },

    formatUnit(value) {
      return (`0${value}`).slice(-2)
    },

    adjustSpinners(instant = false) {
      this.scrollToValue('hours', this.hours, instant)
      this.scrollToValue('minutes', this.minutes, instant)
      if (this.showSeconds) {
        this.scrollToValue('seconds', this.seconds, instant)
      }
    },

    scrollToValue(type, value, instant = false) {
      const scrollbar = this.$refs[type]
      if (!scrollbar || !scrollbar.wrap) {
        return
      }
      const wrap = scrollbar.wrap
      const selector = `.el-time-spinner-v2__item[data-value="${value}"]`
      const target = wrap.querySelector(selector)
      if (!target) {
        return
      }
      const top = target.offsetTop
      if (instant) {
        if (typeof wrap.scrollTo === 'function') {
          try {
            wrap.scrollTo({ top })
          }
          catch (_error) {
            wrap.scrollTo(0, top)
          }
        }
        wrap.scrollTop = top
        return
      }

      if (typeof wrap.scrollTo === 'function') {
        try {
          wrap.scrollTo({ top, behavior: 'smooth' })
        }
        catch (_error) {
          wrap.scrollTo(0, top)
        }
      }
      else {
        wrap.scrollTop = top
      }
    },

    handleHover(type, value, disabled = false) {
      if (disabled || value === undefined) {
        return
      }
      this.emitHover(this.computePreviewDate(type, value))
    },

    emitHover(date) {
      this.$emit('hover', date)
    },

    emitHoverPreview(type, value) {
      this.emitHover(this.computePreviewDate(type, value))
    },

    computePreviewDate(type, value) {
      const hours = type === 'hours' ? value : this.hours
      const minutes = type === 'minutes' ? value : this.minutes
      const seconds = type === 'seconds' ? value : this.seconds
      return modifyTime(this.date, hours, minutes, seconds)
    },
  },
}
</script>

<template>
  <div class="el-time-spinner-v2" :class="{ 'has-seconds': showSeconds }">
    <template v-if="!arrowControl">
      <ElScrollbar
        ref="hours"
        class="el-time-spinner-v2__wrapper"
        view-class="el-time-spinner-v2__list"
        noresize
        tag="ul"
        @mouseenter.native="emitSelectRange('hours')"
        @mouseleave.native="emitHover(null)"
      >
        <li
          v-for="hour in hourOptions"
          :key="hour"
          class="el-time-spinner-v2__item"
          :data-value="hour"
          :class="{ active: hour === hours, disabled: isHourDisabled(hour) }"
          @click="handleClick('hours', hour, isHourDisabled(hour))"
          @mouseenter="handleHover('hours', hour, isHourDisabled(hour))"
        >
          {{ formatHour(hour) }}{{ amPm(hour) }}
        </li>
      </ElScrollbar>
      <ElScrollbar
        ref="minutes"
        class="el-time-spinner-v2__wrapper"
        view-class="el-time-spinner-v2__list"
        noresize
        tag="ul"
        @mouseenter.native="emitSelectRange('minutes')"
        @mouseleave.native="emitHover(null)"
      >
        <li
          v-for="minute in minuteOptions"
          :key="minute"
          class="el-time-spinner-v2__item"
          :data-value="minute"
          :class="{ active: minute === minutes, disabled: isMinuteDisabled(minute) }"
          @click="handleClick('minutes', minute, isMinuteDisabled(minute))"
          @mouseenter="handleHover('minutes', minute, isMinuteDisabled(minute))"
        >
          {{ formatUnit(minute) }}
        </li>
      </ElScrollbar>
      <ElScrollbar
        v-if="showSeconds"
        ref="seconds"
        class="el-time-spinner-v2__wrapper"
        view-class="el-time-spinner-v2__list"
        noresize
        tag="ul"
        @mouseenter.native="emitSelectRange('seconds')"
        @mouseleave.native="emitHover(null)"
      >
        <li
          v-for="second in secondOptions"
          :key="second"
          class="el-time-spinner-v2__item"
          :data-value="second"
          :class="{ active: second === seconds }"
          @click="handleClick('seconds', second)"
          @mouseenter="handleHover('seconds', second, false)"
        >
          {{ formatUnit(second) }}
        </li>
      </ElScrollbar>
    </template>
    <template v-if="arrowControl">
      <div
        class="el-time-spinner-v2__wrapper is-arrow"
        @mouseenter="emitSelectRange('hours')"
        @mouseleave="emitHover(null)"
      >
        <i v-repeat-click="decrease" class="el-time-spinner-v2__arrow el-icon-arrow-up" />
        <i v-repeat-click="increase" class="el-time-spinner-v2__arrow el-icon-arrow-down" />
        <ul class="el-time-spinner-v2__list">
          <li
            v-for="(hour, key) in arrowHourList"
            :key="key"
            class="el-time-spinner-v2__item"
            :class="{ active: hour === hours, disabled: hour === undefined || isHourDisabled(hour) }"
            @click="hour === undefined || isHourDisabled(hour) ? undefined : handleClick('hours', hour)"
            @mouseenter="handleHover('hours', hour, hour === undefined || isHourDisabled(hour))"
          >
            {{ hour === undefined ? '' : `${formatHour(hour)}${amPm(hour)}` }}
          </li>
        </ul>
      </div>
      <div
        class="el-time-spinner-v2__wrapper is-arrow"
        @mouseenter="emitSelectRange('minutes')"
        @mouseleave="emitHover(null)"
      >
        <i v-repeat-click="decrease" class="el-time-spinner-v2__arrow el-icon-arrow-up" />
        <i v-repeat-click="increase" class="el-time-spinner-v2__arrow el-icon-arrow-down" />
        <ul class="el-time-spinner-v2__list">
          <li
            v-for="(minute, key) in arrowMinuteList"
            :key="key"
            class="el-time-spinner-v2__item"
            :class="{ active: minute === minutes, disabled: minute === undefined || isMinuteDisabled(minute) }"
            @click="minute === undefined || isMinuteDisabled(minute) ? undefined : handleClick('minutes', minute)"
            @mouseenter="handleHover('minutes', minute, minute === undefined || isMinuteDisabled(minute))"
          >
            {{ minute === undefined ? '' : formatUnit(minute) }}
          </li>
        </ul>
      </div>
      <div
        v-if="showSeconds"
        class="el-time-spinner-v2__wrapper is-arrow"
        @mouseenter="emitSelectRange('seconds')"
        @mouseleave="emitHover(null)"
      >
        <i v-repeat-click="decrease" class="el-time-spinner-v2__arrow el-icon-arrow-up" />
        <i v-repeat-click="increase" class="el-time-spinner-v2__arrow el-icon-arrow-down" />
        <ul class="el-time-spinner-v2__list">
          <li
            v-for="(second, key) in arrowSecondList"
            :key="key"
            class="el-time-spinner-v2__item"
            :class="{ active: second === seconds, disabled: second === undefined }"
            @click="second === undefined ? undefined : handleClick('seconds', second)"
            @mouseenter="handleHover('seconds', second, second === undefined)"
          >
            {{ second === undefined ? '' : formatUnit(second) }}
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>
