import { formatDate, getWeekNumber, isDateObject, parseDate } from 'element-ui/src/utils/date-util'

export const DEFAULT_FORMATS = {
  date: 'yyyy-MM-dd',
  month: 'yyyy-MM',
  months: 'yyyy-MM',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  time: 'HH:mm:ss',
  week: 'yyyywWW',
  timerange: 'HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  monthrange: 'yyyy-MM',
  datetimerange: 'yyyy-MM-dd HH:mm:ss',
  year: 'yyyy',
  years: 'yyyy',
}

function dateFormatter(value: Date, format: string) {
  if (format === 'timestamp') {
    return value.getTime()
  }
  return formatDate(value, format)
}

function dateParser(text: string | number, format: string) {
  if (format === 'timestamp') {
    return new Date(Number(text))
  }
  return parseDate(text, format)
}

function rangeFormatter(value: Date[], format: string) {
  if (Array.isArray(value) && value.length === 2) {
    const [start, end] = value

    if (start && end) {
      return [dateFormatter(start, format), dateFormatter(end, format)]
    }
  }
  return ''
}

function rangeParser(array: string[] | string, format: string, separator: string) {
  const values = Array.isArray(array) ? array : array.split(separator)

  if (values.length === 2) {
    const [range1, range2] = values

    return [dateParser(range1, format), dateParser(range2, format)]
  }
  return []
}

export const TYPE_VALUE_RESOLVER_MAP = {
  default: {
    formatter(value: unknown) {
      if (!value) {
        return ''
      }
      return `${value}`
    },
    parser(text: unknown) {
      if (text === undefined || text === '') {
        return null
      }
      return text
    },
  },
  week: {
    formatter(value: Date, format: string) {
      const week = getWeekNumber(value)
      const month = value.getMonth()
      const trueDate = new Date(value)

      if (week === 1 && month === 11) {
        trueDate.setHours(0, 0, 0, 0)
        trueDate.setDate(trueDate.getDate() + 3 - (trueDate.getDay() + 6) % 7)
      }
      let date = formatDate(trueDate, format)

      date = /WW/.test(date)
        ? date.replace(/WW/, week < 10 ? `0${week}` : `${week}`)
        : date.replace(/W/, `${week}`)
      return date
    },
    parser(text: string, format: string) {
      return TYPE_VALUE_RESOLVER_MAP.date.parser(text, format)
    },
  },
  date: {
    formatter: dateFormatter,
    parser: dateParser,
  },
  datetime: {
    formatter: dateFormatter,
    parser: dateParser,
  },
  daterange: {
    formatter: rangeFormatter,
    parser: rangeParser,
  },
  monthrange: {
    formatter: rangeFormatter,
    parser: rangeParser,
  },
  datetimerange: {
    formatter: rangeFormatter,
    parser: rangeParser,
  },
  timerange: {
    formatter: rangeFormatter,
    parser: rangeParser,
  },
  time: {
    formatter: dateFormatter,
    parser: dateParser,
  },
  month: {
    formatter: dateFormatter,
    parser: dateParser,
  },
  year: {
    formatter: dateFormatter,
    parser: dateParser,
  },
  number: {
    formatter(value: number | string) {
      if (!value) {
        return ''
      }
      return `${value}`
    },
    parser(text: string) {
      const result = Number(text)

      if (!Number.isNaN(result)) {
        return result
      }
      else {
        return null
      }
    },
  },
  dates: {
    formatter(value: Date[], format: string) {
      return value.map(date => dateFormatter(date, format))
    },
    parser(value: string[] | string, format: string) {
      const values = typeof value === 'string' ? value.split(', ') : value

      return values.map(date => isDateObject(date) ? date : dateParser(date, format))
    },
  },
  months: {
    formatter(value: Date[], format: string) {
      return value.map(date => dateFormatter(date, format))
    },
    parser(value: string[] | string, format: string) {
      const values = typeof value === 'string' ? value.split(', ') : value

      return values.map(date => isDateObject(date) ? date : dateParser(date, format))
    },
  },
  years: {
    formatter(value: Date[], format: string) {
      return value.map(date => dateFormatter(date, format))
    },
    parser(value: string[] | string, format: string) {
      const values = typeof value === 'string' ? value.split(', ') : value

      return values.map(date => isDateObject(date) ? date : dateParser(date, format))
    },
  },
} as const

export function parseAsFormatAndType(value: any, customFormat: string | undefined, type: string, rangeSeparator = '-') {
  if (value === undefined || value === null || value === '') {
    return null
  }
  const resolver = TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP.default
  const format = customFormat || DEFAULT_FORMATS[type]
  return resolver.parser(value, format, rangeSeparator)
}

export function formatAsFormatAndType(value: any, customFormat: string | undefined, type: string) {
  if (value === undefined || value === null || value === '') {
    return null
  }
  const resolver = TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP.default
  const format = customFormat || DEFAULT_FORMATS[type]
  return resolver.formatter(value, format)
}

export function valueEquals(a: any, b: any) {
  const dateEquals = (left: any, right: any) => {
    const leftIsDate = isDateObject(left)
    const rightIsDate = isDateObject(right)

    if (leftIsDate && rightIsDate) {
      return left.getTime() === right.getTime()
    }
    if (!leftIsDate && !rightIsDate) {
      return left === right
    }
    return false
  }

  const aIsArray = Array.isArray(a)
  const bIsArray = Array.isArray(b)

  if (aIsArray && bIsArray) {
    if (a.length !== b.length) {
      return false
    }
    return a.every((item, index) => dateEquals(item, b[index]))
  }
  if (!aIsArray && !bIsArray) {
    return dateEquals(a, b)
  }
  return false
}

export function isString(val: unknown): val is string {
  return typeof val === 'string' || Object.prototype.toString.call(val) === '[object String]'
}

export function listablePropValidator(val: unknown) {
  return (
    val === null
    || val === undefined
    || isString(val)
    || (Array.isArray(val) && val.length === 2 && val.every(isString))
  )
}
