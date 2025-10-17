const VALUES_REG = /,(?![^(]*\))/
const PARTS_REG = /\s(?![^(]*\))/
const LENGTH_REG = /^\d+[a-z%]+$/i

export interface BoxShadowValue {
  inset?: boolean
  offsetX?: number | string
  offsetY?: number | string
  blurRadius?: number | string
  spreadRadius?: number | string
  color?: string
}

const isLength = (value: string | undefined): boolean => !!value && (value === '0' || LENGTH_REG.test(value))

const toPx = (value: string | number): string | number => (typeof value === 'number' && value !== 0 ? `${value}px` : value)

function toNum(value: string): number | string {
  if (!value.endsWith('px') && value !== '0') {
    return value
  }
  const parsed = Number.parseFloat(value)
  return Number.isNaN(parsed) ? value : parsed
}

function parseValue(str: string): BoxShadowValue {
  const parts = str.split(PARTS_REG)
  const inset = parts.includes('inset')
  const last = parts.slice(-1)[0]
  const color = !isLength(last) ? last : undefined

  const [offsetX, offsetY, blurRadius, spreadRadius] = parts
    .filter(part => part !== 'inset')
    .filter(part => part !== color)
    .map(toNum)

  return {
    inset,
    offsetX,
    offsetY,
    blurRadius,
    spreadRadius,
    color,
  }
}

function stringifyValue(value?: BoxShadowValue): string {
  const {
    inset,
    offsetX = 0,
    offsetY = 0,
    blurRadius = 0,
    spreadRadius,
    color,
  } = value || {}

  return [
    inset ? 'inset' : null,
    offsetX,
    offsetY,
    blurRadius,
    spreadRadius,
    color,
  ]
    .filter((item): item is string | number => item !== null && item !== undefined)
    .map(toPx)
    .map(item => `${item}`.trim())
    .join(' ')
}

export function parse(value: string): BoxShadowValue[] {
  return value.split(VALUES_REG).map(segment => segment.trim()).map(parseValue)
}

export function stringify(values: BoxShadowValue[]): string {
  return values.map(stringifyValue).join(', ')
}
