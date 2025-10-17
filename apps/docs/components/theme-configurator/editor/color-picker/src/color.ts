interface HSV {
  h: number
  s: number
  v: number
}

interface RGB {
  r: number
  g: number
  b: number
}

function hsv2hsl(hue: number, sat: number, val: number): [number, number, number] {
  const originalHue = hue
  const computedHue = (2 - sat) * val
  const denominator = computedHue < 1 ? computedHue : 2 - computedHue
  const saturation = (sat * val / (denominator || 1)) || 0
  const lightness = computedHue / 2
  return [originalHue, saturation, lightness]
}

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
function isOnePointZero(n: number | string): boolean {
  return typeof n === 'string' && n.includes('.') && Number.parseFloat(n) === 1
}

function isPercentage(n: number | string): boolean {
  return typeof n === 'string' && n.includes('%')
}

// Take input from [0, n] and return it as [0, 1]
function bound01(value: number | string, max: number): number {
  let val: number | string = value
  if (isOnePointZero(val)) {
    val = '100%'
  }

  const processPercent = isPercentage(val)
  let numeric = Math.min(max, Math.max(0, Number.parseFloat(String(val))))

  // Automatically convert percentage into number
  if (processPercent) {
    numeric = Number.parseInt(String(numeric * max), 10) / 100
  }

  // Handle floating point rounding errors
  if (Math.abs(numeric - max) < 0.000001) {
    return 1
  }

  const parsedMax = Number(max)
  // Convert into [0, 1] range if it isn't already
  return (numeric % max) / parsedMax
}

const INT_HEX_MAP: Record<number, string> = { 10: 'A', 11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F' }

function toHex({ r, g, b }: RGB): string {
  const hexOne = function (value: number): string {
    const clamped = Math.min(Math.round(value), 255)
    const high = Math.floor(clamped / 16)
    const low = clamped % 16
    const highStr = INT_HEX_MAP[high] ?? high.toString(16).toUpperCase()
    const lowStr = INT_HEX_MAP[low] ?? low.toString(16).toUpperCase()
    return `${highStr}${lowStr}`
  }

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return ''
  }

  return `#${hexOne(r)}${hexOne(g)}${hexOne(b)}`
}

const HEX_INT_MAP: Record<string, number> = { A: 10, B: 11, C: 12, D: 13, E: 14, F: 15 }

function parseHexChannel(hex: string): number {
  if (hex.length === 2) {
    const highChar = hex.charAt(0).toUpperCase()
    const lowChar = hex.charAt(1).toUpperCase()
    const high = HEX_INT_MAP[highChar] ?? Number.parseInt(highChar, 16)
    const low = HEX_INT_MAP[lowChar] ?? Number.parseInt(lowChar, 16)
    return high * 16 + low
  }

  const char = hex[hex.length - 1]?.toUpperCase() ?? '0'
  return HEX_INT_MAP[char] ?? Number.parseInt(char, 16)
}

function hsl2hsv(hue: number, sat: number, light: number): HSV {
  let saturation = sat / 100
  let luminance = light / 100
  let smin = saturation
  const lmin = Math.max(luminance, 0.01)
  luminance *= 2
  saturation *= luminance <= 1 ? luminance : 2 - luminance
  smin *= lmin <= 1 ? lmin : 2 - lmin
  const v = (luminance + saturation) / 2
  const sv = luminance === 0 ? (2 * smin) / (lmin + smin) : (2 * saturation) / (luminance + saturation)

  return {
    h: hue,
    s: sv * 100,
    v: v * 100,
  }
}

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
function rgb2hsv(rValue: number, gValue: number, bValue: number): HSV {
  const r = bound01(rValue, 255)
  const g = bound01(gValue, 255)
  const b = bound01(bValue, 255)

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h: number
  const v = max

  const d = max - min
  const s = max === 0 ? 0 : d / max

  if (max === min) {
    h = 0 // achromatic
  }
  else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return { h: h * 360, s: s * 100, v: v * 100 }
}

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hsv2rgb(hValue: number, sValue: number, vValue: number): RGB {
  const h = bound01(hValue, 360) * 6
  const s = bound01(sValue, 100)
  const v = bound01(vValue, 100)

  const i = Math.floor(h)
  const f = h - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)
  const mod = i % 6
  const rValues = [v, q, p, p, t, v] as const
  const gValues = [t, v, v, q, p, p] as const
  const bValues = [p, p, t, v, v, q] as const
  const r = rValues[mod] ?? v
  const g = gValues[mod] ?? v
  const b = bValues[mod] ?? v

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

interface ColorUpdateMap {
  [key: string]: unknown
}

export default class Color {
  private _hue: number
  private _saturation: number
  private _value: number
  private _alpha: number
  enableAlpha: boolean
  format: string
  value: string

  constructor(options: ColorUpdateMap = {}) {
    this._hue = 0
    this._saturation = 100
    this._value = 100
    this._alpha = 100

    this.enableAlpha = false
    this.format = 'hex'
    this.value = ''

    const self = this as unknown as Record<string, unknown>
    Object.keys(options).forEach((option) => {
      if (Object.prototype.hasOwnProperty.call(options, option)) {
        self[option] = options[option]
      }
    })

    this.doOnChange()
  }

  set(prop: string | ColorUpdateMap, value?: number | string): void {
    if (arguments.length === 1 && typeof prop === 'object' && prop !== null) {
      Object.keys(prop).forEach((p) => {
        if (Object.prototype.hasOwnProperty.call(prop, p)) {
          this.set(p, (prop as ColorUpdateMap)[p] as number | string)
        }
      })

      return
    }

    if (typeof prop === 'string') {
      const self = this as unknown as Record<string, unknown>
      self[`_${prop}`] = value
      this.doOnChange()
    }
  }

  get(prop: string): unknown {
    const self = this as unknown as Record<string, unknown>
    return self[`_${prop}`]
  }

  toRgb(): RGB {
    return hsv2rgb(this._hue, this._saturation, this._value)
  }

  fromString(value: string): void {
    if (!value) {
      this._hue = 0
      this._saturation = 100
      this._value = 100

      this.doOnChange()
      return
    }

    const fromHSV = (h: number, s: number, v: number): void => {
      this._hue = Math.max(0, Math.min(360, h))
      this._saturation = Math.max(0, Math.min(100, s))
      this._value = Math.max(0, Math.min(100, v))

      this.doOnChange()
    }

    if (value.includes('hsl')) {
      const parts = value.replace(/hsla|hsl|\(|\)/g, '')
        .split(/\s|,/g)
        .filter(val => val !== '')
        .map((val, index) => (index > 2 ? Number.parseFloat(val) : Number.parseInt(val, 10)))

      if (parts.length === 4) {
        const alpha = parts[3] ?? 0
        this._alpha = Math.floor(Number(alpha) * 100)
      }
      else if (parts.length === 3) {
        this._alpha = 100
      }
      if (parts.length >= 3) {
        const [h, s, l] = parts
        const { h: hue, s: sat, v: val } = hsl2hsv(h as number, s as number, l as number)
        fromHSV(hue, sat, val)
      }
    }
    else if (value.includes('hsv')) {
      const parts = value.replace(/hsva|hsv|\(|\)/g, '')
        .split(/\s|,/g)
        .filter(val => val !== '')
        .map((val, index) => (index > 2 ? Number.parseFloat(val) : Number.parseInt(val, 10)))

      if (parts.length === 4) {
        const alpha = parts[3] ?? 0
        this._alpha = Math.floor(Number(alpha) * 100)
      }
      else if (parts.length === 3) {
        this._alpha = 100
      }
      if (parts.length >= 3) {
        fromHSV(parts[0] as number, parts[1] as number, parts[2] as number)
      }
    }
    else if (value.includes('rgb')) {
      const parts = value.replace(/rgba|rgb|\(|\)/g, '')
        .split(/\s|,/g)
        .filter(val => val !== '')
        .map((val, index) => (index > 2 ? Number.parseFloat(val) : Number.parseInt(val, 10)))

      if (parts.length === 4) {
        const alpha = parts[3] ?? 0
        this._alpha = Math.floor(Number(alpha) * 100)
      }
      else if (parts.length === 3) {
        this._alpha = 100
      }
      if (parts.length >= 3) {
        const [r, g, b] = parts
        if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number') {
          const { h, s, v } = rgb2hsv(r, g, b)
          fromHSV(h, s, v)
        }
      }
    }
    else if (value.includes('#')) {
      const hex = value.replace('#', '').trim()
      let r: number | undefined
      let g: number | undefined
      let b: number | undefined

      if (hex.length === 3) {
        const rChar = hex.charAt(0)
        const gChar = hex.charAt(1)
        const bChar = hex.charAt(2)
        r = parseHexChannel(rChar + rChar)
        g = parseHexChannel(gChar + gChar)
        b = parseHexChannel(bChar + bChar)
      }
      else if (hex.length === 6 || hex.length === 8) {
        r = parseHexChannel(hex.substring(0, 2))
        g = parseHexChannel(hex.substring(2, 4))
        b = parseHexChannel(hex.substring(4, 6))
      }

      if (hex.length === 8) {
        this._alpha = Math.floor(parseHexChannel(hex.substring(6)) / 255 * 100)
      }
      else if (hex.length === 3 || hex.length === 6) {
        this._alpha = 100
      }

      if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number') {
        const { h, s, v } = rgb2hsv(r, g, b)
        fromHSV(h, s, v)
      }
    }
  }

  compare(color: Color): boolean {
    return Math.abs(color._hue - this._hue) < 2
      && Math.abs(color._saturation - this._saturation) < 1
      && Math.abs(color._value - this._value) < 1
      && Math.abs(color._alpha - this._alpha) < 1
  }

  doOnChange(): void {
    const { _hue, _saturation, _value, _alpha, format } = this

    if (this.enableAlpha) {
      switch (format) {
        case 'hsl': {
          const hsl = hsv2hsl(_hue, _saturation / 100, _value / 100)
          this.value = `hsla(${_hue}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%, ${_alpha / 100})`
          break
        }
        case 'hsv': {
          this.value = `hsva(${_hue}, ${Math.round(_saturation)}%, ${Math.round(_value)}%, ${_alpha / 100})`
          break
        }
        default: {
          const { r, g, b } = hsv2rgb(_hue, _saturation, _value)
          this.value = `rgba(${r}, ${g}, ${b}, ${_alpha / 100})`
          break
        }
      }
    }
    else {
      switch (format) {
        case 'hsl': {
          const hsl = hsv2hsl(_hue, _saturation / 100, _value / 100)
          this.value = `hsl(${_hue}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%)`
          break
        }
        case 'hsv': {
          this.value = `hsv(${_hue}, ${Math.round(_saturation)}%, ${Math.round(_value)}%)`
          break
        }
        case 'rgb': {
          const { r, g, b } = hsv2rgb(_hue, _saturation, _value)
          this.value = `rgb(${r}, ${g}, ${b})`
          break
        }
        default: {
          this.value = toHex(hsv2rgb(_hue, _saturation, _value))
        }
      }
    }
  }
}
