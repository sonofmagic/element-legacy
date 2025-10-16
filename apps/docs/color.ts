export function tintColor(hex: string, tint: number): string {
  const color = hex.replace('#', '')
  let red = Number.parseInt(color.slice(0, 2), 16)
  let green = Number.parseInt(color.slice(2, 4), 16)
  let blue = Number.parseInt(color.slice(4, 6), 16)

  if (tint === 0) { // when primary color is in its rgb space
    return [red, green, blue].join(',')
  }

  red += Math.round(tint * (255 - red))
  green += Math.round(tint * (255 - green))
  blue += Math.round(tint * (255 - blue))

  const redHex = red.toString(16)
  const greenHex = green.toString(16)
  const blueHex = blue.toString(16)

  return `#${redHex}${greenHex}${blueHex}`
}
