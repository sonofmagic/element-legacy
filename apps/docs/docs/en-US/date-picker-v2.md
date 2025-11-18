## DatePicker v2

Use Date Picker for date input.

### Pick a Date

The basic day picker.

:::demo The measurement is determined by the `type` attribute. You can enable quick options via `picker-options.shortcuts`, and disable specific dates with `disabledDate`.

```html
<template>
  <div class="block">
    <span class="demonstration">Default</span>
    <div class="demonstration">Value: {{ basicDate }}</div>
    <el-date-picker-v2 v-model="basicDate" type="date" placeholder="Pick a day" />
  </div>
  <div class="block">
    <span class="demonstration">With shortcuts</span>
    <div class="demonstration">Value: {{ quickDate }}</div>
    <el-date-picker-v2
      v-model="quickDate"
      align="right"
      type="date"
      placeholder="Pick a day"
      :picker-options="pickerOptions"
    />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        basicDate: '',
        quickDate: '',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [
            {
              text: 'Today',
              onClick(picker) {
                picker.$emit('pick', new Date())
              },
            },
            {
              text: 'Yesterday',
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24)
                picker.$emit('pick', date)
              },
            },
            {
              text: 'A week ago',
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', date)
              },
            },
          ],
        },
      }
    },
  }
</script>
```

:::

### Compact Layout

:::demo Evenly split the space to place four pickers on one row and let them shrink when space is tight.

```html
<template>
  <div
    class="demo-date-picker-inline"
    style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px;"
  >
    <el-date-picker-v2 v-model="inlineDate1" type="date" placeholder="Pick a day" style="width: 100%" />
    <el-date-picker-v2 v-model="inlineDate2" type="date" placeholder="Pick a day" style="width: 100%" />
    <el-date-picker-v2 v-model="inlineDate3" type="date" placeholder="Pick a day" style="width: 100%" />
    <el-date-picker-v2 v-model="inlineDate4" type="date" placeholder="Pick a day" style="width: 100%" />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        inlineDate1: '',
        inlineDate2: '',
        inlineDate3: '',
        inlineDate4: '',
      }
    },
  }
</script>
```

:::

### Pick Date & Time Range

:::demo Select date and time ranges with DatePicker v2, laid out four per row. You can set default start and end times via `default-time`.
```html
<template>
  <div
    class="demo-date-picker-inline"
    style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px;"
  >
    <el-date-picker-v2
      v-model="datetimeRange1"
      type="datetimerange"
      align="right"
      unlink-panels
      range-separator="to"
      start-placeholder="Start"
      end-placeholder="End"
      :default-time="['00:00:00', '23:59:59']"
      :picker-options="pickerOptions"
      style="width: 100%"
    />
    <el-date-picker-v2
      v-model="datetimeRange2"
      type="datetimerange"
      align="right"
      unlink-panels
      range-separator="to"
      start-placeholder="Start"
      end-placeholder="End"
      :default-time="['08:00:00', '18:00:00']"
      :picker-options="pickerOptions"
      style="width: 100%"
    />
    <el-date-picker-v2
      v-model="datetimeRange3"
      type="datetimerange"
      align="right"
      unlink-panels
      range-separator="to"
      start-placeholder="Start"
      end-placeholder="End"
      :default-time="['12:00:00', '23:59:59']"
      :picker-options="pickerOptions"
      style="width: 100%"
    />
    <el-date-picker-v2
      v-model="datetimeRange4"
      type="datetimerange"
      align="right"
      unlink-panels
      range-separator="to"
      start-placeholder="Start"
      end-placeholder="End"
      :default-time="['00:00:00', '12:00:00']"
      :picker-options="pickerOptions"
      style="width: 100%"
    />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        datetimeRange1: [],
        datetimeRange2: [],
        datetimeRange3: [],
        datetimeRange4: [],
        pickerOptions: {
          shortcuts: [
            {
              text: 'Last hour',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: 'Today so far',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setHours(0, 0, 0, 0)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: 'Last 3 days',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
                picker.$emit('pick', [start, end])
              },
            },
          ],
        },
      }
    },
  }
</script>
```
:::

### Time Spinner

:::demo The `time-spinner` panel powers the time selection of DatePicker v2 and can also be used on its own. The example below toggles the seconds column and the arrow-control interaction.

```html
<template>
  <div class="block time-spinner-demo">
    <p class="demonstration">Current time: {{ textValue }}</p>
    <div class="time-spinner-demo__panel">
      <el-time-spinner-v2
        ref="basicSpinner"
        :date="currentDate"
        :show-seconds="showSeconds"
        :arrow-control="arrowControl"
        @change="handleChange"
      />
    </div>
    <div class="time-spinner-demo__controls">
      <label class="time-spinner-demo__control">
        <span class="time-spinner-demo__label">Show seconds</span>
        <el-switch v-model="showSeconds" @change="syncSpinner" />
      </label>
      <label class="time-spinner-demo__control">
        <span class="time-spinner-demo__label">Arrow control</span>
        <el-switch v-model="arrowControl" @change="syncSpinner" />
      </label>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      const now = new Date()
      return {
        currentDate: new Date(now.getTime()),
        showSeconds: true,
        arrowControl: false,
      }
    },
    computed: {
      textValue() {
        const value = this.currentDate
        return `${this.pad(value.getHours())}:${this.pad(value.getMinutes())}:${this.pad(value.getSeconds())}`
      },
    },
    methods: {
      pad(value) {
        return String(value).padStart(2, '0')
      },
      handleChange(value) {
        this.currentDate = value
      },
      syncSpinner() {
        this.$nextTick(() => {
          this.$refs.basicSpinner && this.$refs.basicSpinner.adjustSpinners(true)
        })
      },
    },
  }
</script>

<style>
.time-spinner-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-spinner-demo__panel {
  max-width: 320px;
}

.time-spinner-demo__controls {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.time-spinner-demo__control {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.time-spinner-demo__label {
  font-size: 14px;
  color: var(--el-text-color-primary);
}
</style>
```

:::

:::demo Provide `selectableRange` for `time-spinner` to disable unwanted options. The example only allows two working-hour ranges; every other item is automatically disabled.

```html
<template>
  <div class="block time-spinner-range-demo">
    <p class="demonstration">Current time: {{ formatted }}</p>
    <div class="time-spinner-range-demo__panel">
      <el-time-spinner-v2
        ref="restrictedSpinner"
        :date="restrictedDate"
        :show-seconds="false"
        @change="handleRestrictedChange"
      />
    </div>
    <el-alert
      class="time-spinner-range-demo__tip"
      type="info"
      :closable="false"
      title="Selectable ranges: 09:30-11:30, 13:30-17:00"
    />
  </div>
</template>

<script>
  function withTime(base, hours, minutes) {
    const cloned = new Date(base.getTime())
    cloned.setHours(hours, minutes, 0, 0)
    return cloned
  }

  export default {
    data() {
      const today = new Date()
      return {
        baseDate: today,
        restrictedDate: withTime(today, 9, 30),
      }
    },
    computed: {
      formatted() {
        const { restrictedDate } = this
        return `${this.pad(restrictedDate.getHours())}:${this.pad(restrictedDate.getMinutes())}`
      },
    },
    mounted() {
      this.$nextTick(this.updateSelectableRange)
    },
    methods: {
      pad(value) {
        return String(value).padStart(2, '0')
      },
      withTime,
      handleRestrictedChange(value) {
        this.restrictedDate = value
      },
      updateSelectableRange() {
        const ranges = [
          [this.withTime(this.baseDate, 9, 30), this.withTime(this.baseDate, 11, 30)],
          [this.withTime(this.baseDate, 13, 30), this.withTime(this.baseDate, 17, 0)],
        ]
        if (this.$refs.restrictedSpinner) {
          this.$refs.restrictedSpinner.selectableRange = ranges
        }
      },
    },
  }
</script>

<style>
.time-spinner-range-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-spinner-range-demo__panel {
  max-width: 320px;
}

.time-spinner-range-demo__tip {
  max-width: 320px;
}
</style>
```

:::

### Date Range

:::demo When in range mode, the left and right panels are linked by default. Use `unlink-panels` if you want them to flip months independently.

```html
<template>
  <div class="block">
    <span class="demonstration">Default</span>
    <div class="demonstration">Value: {{ rangeValue }}</div>
    <el-date-picker-v2
      v-model="rangeValue"
      type="daterange"
      range-separator="to"
      start-placeholder="Start date"
      end-placeholder="End date"
    />
  </div>
  <div class="block">
    <span class="demonstration">With shortcuts</span>
    <div class="demonstration">Value: {{ rangeQuickValue }}</div>
    <el-date-picker-v2
      v-model="rangeQuickValue"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="to"
      start-placeholder="Start date"
      end-placeholder="End date"
      :picker-options="pickerOptions"
    />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        rangeValue: '',
        rangeQuickValue: '',
        pickerOptions: {
          shortcuts: [
            {
              text: 'Last week',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: 'Last month',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: 'Last 3 months',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, end])
              },
            },
          ],
        },
      }
    },
  }
</script>
```

:::

### Date & Time Range

:::demo Use `datetimerange` to pick both dates and time ranges, and configure default times with `default-time`.

```html
<template>
  <p class="demonstration">Value: {{ datetimeRange }}</p>
  <el-date-picker-v2
    v-model="datetimeRange"
    type="datetimerange"
    align="right"
    unlink-panels
    range-separator="to"
    start-placeholder="Start time"
    end-placeholder="End time"
    :default-time="['00:00:00', '23:59:59']"
    :picker-options="pickerOptions"
  />
</template>

<script>
  export default {
    data() {
      return {
        datetimeRange: [],
        pickerOptions: {
          shortcuts: [
            {
              text: 'Last hour',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: 'Today so far',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setHours(0, 0, 0, 0)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: 'Last 3 days',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
                picker.$emit('pick', [start, end])
              },
            },
          ],
        },
      }
    },
  }
</script>
```

:::

### Overflow Tooltip

Hover to reveal the full value whenever it exceeds the visible width.

:::demo Restrict the input width and use a long display format to demonstrate the automatic tooltip on overflow.

```html
<template>
  <div class="demo-date-picker-tooltip">
    <p class="demonstration">Single: {{ tooltipSingle }}</p>
    <el-date-picker-v2
      v-model="tooltipSingle"
      type="datetime"
      format="yyyy-MM-dd HH:mm:ss"
      value-format="yyyy-MM-dd HH:mm:ss"
      placeholder="Pick date & time"
    />
    <p class="demonstration">Range: {{ tooltipRangeDisplay }}</p>
    <el-date-picker-v2
      v-model="tooltipRange"
      type="datetimerange"
      format="yyyy-MM-dd HH:mm:ss"
      value-format="yyyy-MM-dd HH:mm:ss"
      range-separator="to"
      start-placeholder="Start time"
      end-placeholder="End time"
    />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tooltipSingle: '2023-09-01 08:30:00',
        tooltipRange: ['2023-09-01 08:30:00', '2023-09-12 21:45:00'],
      }
    },
    computed: {
      tooltipRangeDisplay() {
        if (!Array.isArray(this.tooltipRange)) {
          return ''
        }
        const [start, end] = this.tooltipRange
        return `${start || ''} to ${end || ''}`
      },
    },
  }
</script>

<style>
  .demo-date-picker-tooltip .el-date-editor-v2 {
    width: 160px;
  }

  .demo-date-picker-tooltip .el-range-editor-v2 {
    width: 320px;
  }
</style>
```

:::

### Partial Range Defaults

:::demo When only the end value is filled, the start panel now opens around that same month so you can quickly confirm or adjust the range.

```html
<template>
  <div class="demo-date-picker-partial">
    <p class="demonstration">Value: {{ partialRangeDisplay }}</p>
    <el-date-picker-v2
      v-model="partialRange"
      type="datetimerange"
      format="yyyy-MM-dd HH:mm:ss"
      value-format="yyyy-MM-dd HH:mm:ss"
      range-separator="to"
      start-placeholder="Start time"
      end-placeholder="End time"
    />
    <div class="demo-date-picker-partial__actions">
      <el-button size="mini" @click="clearStart">Clear start</el-button>
      <el-button size="mini" @click="fillBoth">Fill both</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        partialRange: [null, '2023-09-01 00:45:00'],
      }
    },
    computed: {
      partialRangeDisplay() {
        if (!Array.isArray(this.partialRange)) {
          return ''
        }
        const [start, end] = this.partialRange
        return `${start || '--'} to ${end || '--'}`
      },
    },
    methods: {
      clearStart() {
        const [, end] = Array.isArray(this.partialRange) ? this.partialRange : []
        this.partialRange = [null, end || '2023-09-01 00:45:00']
      },
      fillBoth() {
        this.partialRange = ['2023-08-31 18:00:00', '2023-09-01 00:45:00']
      },
    },
  }
</script>

<style>
  .demo-date-picker-partial .el-range-editor-v2 {
    width: 320px;
  }

  .demo-date-picker-partial__actions {
    margin-top: 12px;
    display: flex;
    gap: 8px;
  }
</style>
```

:::

### Same-Day End Time

:::demo Keep the start value set and pick an end time on the same day — available times remain selectable instead of being fully disabled.

```html
<template>
  <div class="demo-date-picker-sameday">
    <p class="demonstration">Value: {{ sameDayRangeDisplay }}</p>
    <el-date-picker-v2
      v-model="sameDayRange"
      type="datetimerange"
      format="yyyy-MM-dd HH:mm:ss"
      value-format="yyyy-MM-dd HH:mm:ss"
      range-separator="to"
      start-placeholder="Start time"
      end-placeholder="End time"
      :default-time="['08:00:00', '18:00:00']"
    />
    <div class="demo-date-picker-sameday__actions">
      <el-button size="mini" @click="clearEnd">Clear end</el-button>
      <el-button size="mini" @click="restoreRange">Restore</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        sameDayRange: ['2023-09-01 08:30:00', null],
      }
    },
    computed: {
      sameDayRangeDisplay() {
        if (!Array.isArray(this.sameDayRange)) {
          return ''
        }
        const [start, end] = this.sameDayRange
        return `${start || '--'} to ${end || '--'}`
      },
    },
    methods: {
      clearEnd() {
        const [start] = Array.isArray(this.sameDayRange) ? this.sameDayRange : []
        this.sameDayRange = [start || '2023-09-01 08:30:00', null]
      },
      restoreRange() {
        this.sameDayRange = ['2023-09-01 08:30:00', '2023-09-01 12:15:00']
      },
    },
  }
</script>

<style>
  .demo-date-picker-sameday .el-range-editor-v2 {
    width: 320px;
  }

  .demo-date-picker-sameday__actions {
    margin-top: 12px;
    display: flex;
    gap: 8px;
  }
</style>
```

:::

### Multiple Dates

:::demo Set `type="dates"` to allow users to pick multiple dates at once.

```html
<template>
  <p class="demonstration">Value: {{ multipleDates }}</p>
  <el-date-picker-v2
    v-model="multipleDates"
    type="dates"
    placeholder="Pick one or more dates"
  />
</template>

<script>
  export default {
    data() {
      return {
        multipleDates: [],
      }
    },
  }
</script>
```

:::

### Pick a Month

:::demo Pick a single month.

```html
<template>
  <p class="demonstration">Value: {{ monthValue }}</p>
  <el-date-picker-v2
    v-model="monthValue"
    type="month"
    placeholder="Pick a month"
  />
</template>

<script>
  export default {
    data() {
      return {
        monthValue: '',
      }
    },
  }
</script>
```

:::

### Month Range

Pick a month range in one go.

:::demo When in range mode, the left and right panels are linked by default. Use `unlink-panels` if you want them to switch years independently.

```html
<template>
  <div class="block">
    <span class="demonstration">Default</span>
    <div class="demonstration">Value: {{ monthRange }}</div>
    <el-date-picker-v2
      v-model="monthRange"
      type="monthrange"
      range-separator="to"
      start-placeholder="Start month"
      end-placeholder="End month"
    />
  </div>
  <div class="block">
    <span class="demonstration">With shortcuts</span>
    <div class="demonstration">Value: {{ monthRangeQuick }}</div>
    <el-date-picker-v2
      v-model="monthRangeQuick"
      type="monthrange"
      align="right"
      unlink-panels
      range-separator="to"
      start-placeholder="Start month"
      end-placeholder="End month"
      :picker-options="pickerOptions"
    />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        monthRange: '',
        monthRangeQuick: '',
        pickerOptions: {
          shortcuts: [
            {
              text: 'This month',
              onClick(picker) {
                picker.$emit('pick', [new Date(), new Date()])
              },
            },
            {
              text: 'Year to date',
              onClick(picker) {
                const end = new Date()
                const start = new Date(new Date().getFullYear(), 0)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: 'Last 6 months',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setMonth(start.getMonth() - 6)
                picker.$emit('pick', [start, end])
              },
            },
          ],
        },
      }
    },
  }
</script>
```

:::

### Pick a Year

:::demo Pick a single year.

```html
<template>
  <p class="demonstration">Value: {{ yearValue }}</p>
  <el-date-picker-v2
    v-model="yearValue"
    type="year"
    placeholder="Pick a year"
  />
</template>

<script>
  export default {
    data() {
      return {
        yearValue: '',
      }
    },
  }
</script>
```

:::

### Year Range

:::demo Use `type="yearrange"` to pick a range of years.

```html
<template>
  <div class="block">
    <span class="demonstration">Default</span>
    <div class="demonstration">Value: {{ yearRange }}</div>
    <el-date-picker-v2
      v-model="yearRange"
      type="yearrange"
      range-separator="to"
      start-placeholder="Start year"
      end-placeholder="End year"
    />
  </div>
  <div class="block">
    <span class="demonstration">With shortcuts</span>
    <div class="demonstration">Value: {{ yearRangeQuick }}</div>
    <el-date-picker-v2
      v-model="yearRangeQuick"
      type="yearrange"
      align="right"
      unlink-panels
      range-separator="to"
      start-placeholder="Start year"
      end-placeholder="End year"
      :picker-options="pickerOptions"
    />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        yearRange: [],
        yearRangeQuick: [],
        pickerOptions: {
          shortcuts: [
            {
              text: 'Last 5 years',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setFullYear(start.getFullYear() - 4)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: 'Last 10 years',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setFullYear(start.getFullYear() - 9)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: 'Since 2000',
              onClick(picker) {
                const end = new Date()
                const start = new Date(2000, 0, 1)
                picker.$emit('pick', [start, end])
              },
            },
          ],
        },
      }
    },
  }
</script>
```

:::

### Multiple Months

:::demo Set `type="months"` to allow selecting more than one month.

```html
<template>
  <p class="demonstration">Value: {{ multipleMonths }}</p>
  <el-date-picker-v2
    v-model="multipleMonths"
    type="months"
    placeholder="Pick one or more months"
  />
</template>

<script>
  export default {
    data() {
      return {
        multipleMonths: [],
      }
    },
  }
</script>
```

:::

### Multiple Years

:::demo Set `type="years"` to choose multiple years.

```html
<template>
  <p class="demonstration">Value: {{ multipleYears }}</p>
  <el-date-picker-v2
    v-model="multipleYears"
    type="years"
    placeholder="Pick one or more years"
  />
</template>

<script>
  export default {
    data() {
      return {
        multipleYears: [],
      }
    },
  }
</script>
```

:::

### Date Formats

Use `format` to control displayed text's format in the input box. Use `value-format` to control binding value's format.

By default, the component accepts and emits a `Date` object. Below are supported format strings, using UTC 2017-01-02 03:04:05 as an example:

:::warning
Pay attention to capitalization
:::

| format      | meaning              | note                                                               | example       |
| ----------- | -------------------- | ------------------------------------------------------------------ | ------------- |
| `yyyy`      | year                 |                                                                    | 2017          |
| `M`         | month                | no leading 0                                                       | 1             |
| `MM`        | month                |                                                                    | 01            |
| `MMM`       | month                |                                                                    | Jan           |
| `MMMM`      | month                |                                                                    | January       |
| `W`         | week                 | only for week picker's `format`; no leading 0                      | 1             |
| `WW`        | week                 | only for week picker's `format`                                    | 01            |
| `d`         | day                  | no leading 0                                                       | 2             |
| `dd`        | day                  |                                                                    | 02            |
| `H`         | hour                 | 24-hour clock; no leading 0                                        | 3             |
| `HH`        | hour                 | 24-hour clock                                                      | 03            |
| `h`         | hour                 | 12-hour clock; must be used with `A` or `a`; no leading 0          | 3             |
| `hh`        | hour                 | 12-hour clock; must be used with `A` or `a`                        | 03            |
| `m`         | minute               | no leading 0                                                       | 4             |
| `mm`        | minute               |                                                                    | 04            |
| `s`         | second               | no leading 0                                                       | 5             |
| `ss`        | second               |                                                                    | 05            |
| `A`         | AM/PM                | only for `format`, uppercased                                      | AM            |
| `a`         | am/pm                | only for `format`, lowercased                                      | am            |
| `timestamp` | JS timestamp         | only for `value-format`; binding value will be a `number`          | 1483326245000 |
| `[MM]`      | No escape characters | To escape characters, wrap them in square brackets (e.g. [A] [MM]) | MM            |

:::demo

```html
<template>
  <div class="block">
    <span class="demonstration">Emits Date object</span>
    <div class="demonstration">Value: {{ value1 }}</div>
    <el-date-picker-v2 v-model="value1" type="date" placeholder="Pick a Date" format="yyyy/MM/dd"> </el-date-picker-v2>
  </div>
  <div class="block">
    <span class="demonstration">Use value-format</span>
    <div class="demonstration">Value: {{ value2 }}</div>
    <el-date-picker-v2
      v-model="value2"
      type="date"
      placeholder="Pick a Date"
      format="yyyy/MM/dd"
      value-format="yyyy-MM-dd"
    >
    </el-date-picker-v2>
  </div>
  <div class="block">
    <span class="demonstration">Timestamp</span>
    <div class="demonstration">Value：{{ value3 }}</div>
    <el-date-picker-v2 v-model="value3" type="date" placeholder="Pick a Date" format="yyyy/MM/dd" value-format="timestamp">
    </el-date-picker-v2>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value1: '',
        value2: '',
        value3: '',
      }
    },
  }
</script>
```

:::

### Default time for start date and end date

When picking a date range, you can assign the time part for start date and end date.

:::demo By default, the time part of start date and end date are both `00:00:00`. Setting `default-time` can change their time respectively. It accepts an array of up to two strings with the format of `12:00:00`. The first string sets the time for the start date, and the second for the end date.

```html
<template>
  <div class="block">
    <p>Component value：{{ value }}</p>
    <el-date-picker-v2
      v-model="value"
      type="daterange"
      start-placeholder="Start date"
      end-placeholder="End date"
      :default-time="['00:00:00', '23:59:59']"
    >
    </el-date-picker-v2>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value: '',
      }
    },
  }
</script>
```

:::

### Attributes

| Attribute         | Description                                                                                  | Type                                      | Accepted Values                                                                                                                      | Default              |
| ----------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------- |
| value / v-model   | binding value                                                                                | date(DatePicker) / array(DateRangePicker) | —                                                                                                                                     | —                    |
| readonly          | whether the DatePicker is read only                                                          | boolean                                   | —                                                                                                                                     | false                |
| disabled          | whether the DatePicker is disabled                                                           | boolean                                   | —                                                                                                                                     | false                |
| editable          | whether the input is editable                                                                | boolean                                   | —                                                                                                                                     | true                 |
| clearable         | whether to show clear button                                                                 | boolean                                   | —                                                                                                                                     | true                 |
| size              | size of Input                                                                                | string                                    | large/small/mini                                                                                                                      | —                    |
| placeholder       | placeholder in non-range mode                                                               | string                                    | —                                                                                                                                     | —                    |
| start-placeholder | placeholder for the start date in range mode                                                | string                                    | —                                                                                                                                     | —                    |
| end-placeholder   | placeholder for the end date in range mode                                                  | string                                    | —                                                                                                                                     | —                    |
| type              | type of the picker                                                                          | string                                    | year/month/date/dates/months/years week/datetime/datetimerange/daterange/monthrange                                                  | date                 |
| format            | format of displayed value in the input box                                                  | string                                    | refer to [Date Formats](#/en-US/component/date-picker-v2#date-formats)                                                               | yyyy-MM-dd           |
| align             | alignment                                                                                   | string                                    | left, center, right                                                                                                                   | left                 |
| popper-class      | Custom class name for the DatePicker's dropdown                                              | string                                    | —                                                                                                                                     | —                    |
| picker-options    | additional options, check the table below                                                    | object                                    | —                                                                                                                                     | {}                   |
| range-separator   | range separator                                                                              | string                                    | —                                                                                                                                     | '-'                  |
| default-value     | optional, default date of the calendar                                                       | Date                                      | anything accepted by `new Date()`                                                                                                     | —                    |
| default-time      | when picking a date range, sets the time value for start and end date                        | string[]                                  | array of up to two strings, each like `12:00:00`. The first controls start time, the second controls end time. Defaults to `00:00:00` | —                    |
| value-format      | optional, format of binding value. If not specified, the binding value will be a Date object | string                                    | refer to [Date Formats](#/en-US/component/date-picker-v2#date-formats)                                                               | —                    |
| name              | same as `name` in native input                                                               | string                                    | —                                                                                                                                     | —                    |
| unlink-panels     | unlink two date-panels in range-picker                                                       | boolean                                   | —                                                                                                                                     | false                |
| prefix-icon       | Custom prefix icon class                                                                     | string                                    | —                                                                                                                                     | el-icon-date         |
| clear-icon        | Custom clear icon class                                                                      | string                                    | —                                                                                                                                     | el-icon-circle-close |
| validate-event    | whether to trigger form validation                                                           | boolean                                   | -                                                                                                                                     | true                 |
| append-to-body    | whether to append DatePicker itself to body                                                  | boolean                                   | —                                                                                                                                     | true                 |

### Picker Options

| Attribute      | Description                                                                                           | Type                           | Accepted Values | Default |
| -------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------ | --------------- | ------- |
| shortcuts      | a { text, onClick } object array to set shortcut options, check the table below                       | object[]                       | —               | —       |
| disabledDate   | a function determining if a date is disabled with that date as its parameter. Should return a Boolean | function                       | —               | —       |
| cellClassName  | set custom className                                                                                  | Function(Date)                 | —               | —       |
| firstDayOfWeek | first day of week                                                                                     | Number                         | 1 to 7          | 7       |
| onPick         | a callback that triggers when the selected date is changed. Only for `daterange` and `datetimerange`. | Function({ maxDate, minDate }) | -               | -       |

### shortcuts

| Attribute | Description                                                                                                                                                                                     | Type     | Accepted Values | Default |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------------- | ------- |
| text      | title of the shortcut                                                                                                                                                                           | string   | —               | —       |
| onClick   | callback function, triggers when the shortcut is clicked, with the `vm` as its parameter. You can change the picker value by emitting the `pick` event. Example: `vm.$emit('pick', new Date())` | function | —               | —       |

### Events

| Event Name | Description                           | Parameters                |
| ---------- | ------------------------------------- | ------------------------- |
| change     | triggers when user confirms the value | component's binding value |
| blur       | triggers when Input blurs             | component instance        |
| focus      | triggers when Input focuses           | component instance        |

### Methods

| Method | Description               | Parameters |
| ------ | ------------------------- | ---------- |
| focus  | focus the Input component | —          |

### Slots

| Name            | Description                    |
| --------------- | ------------------------------ |
| range-separator | custom range separator content |
