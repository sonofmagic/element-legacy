## DatePicker v2

Use Date Picker for date input.

### Pick a Date

The basic day picker.

:::demo The measurement is determined by the `type` attribute. You can enable quick options via `picker-options.shortcuts`, and disable specific dates with `disabledDate`.

```html
<template>
  <div class="block">
    <span class="demonstration">Default</span>
    <el-date-picker-v2 v-model="basicDate" type="date" placeholder="Pick a day" />
  </div>
  <div class="block">
    <span class="demonstration">With shortcuts</span>
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

### Pick Date & Time

:::demo Select both date and time with DatePicker v2.
```html
<template>
  <el-date-picker-v2
    v-model="datetimeValue"
    type="datetime"
    placeholder="Select date and time"
  />
</template>

<script>
  export default {
    data() {
      return {
        datetimeValue: '',
      }
    },
  }
</script>
```
:::

### Date Range

:::demo When in range mode, the left and right panels are linked by default. Use `unlink-panels` if you want them to flip months independently.

```html
<template>
  <div class="block">
    <span class="demonstration">Default</span>
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

### Multiple Dates

:::demo Set `type="dates"` to allow users to pick multiple dates at once.

```html
<template>
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
