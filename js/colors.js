/** @typedef {[number, number, number, number]} Color */

/**
 *
 * @param {string} hex
 * @returns {Color} [r, g, b, a]
 */
export function hexToRGBA(hex) {
  if (hex.startsWith('#')) hex = hex.slice(1)
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
    parseInt(hex.slice(6, 8) || 'ff', 16),
  ]
}

/**
 * @param {Color} color
 */
export function colorToString(color) {
  return `rgba(${color.join(',')})`
}

/**
 * @param {number} value
 * @param {number} a
 * @param {number} b
 * @returns
 */
export function lerp(value, a, b) {
  return a * (1 - value) + b * value
}

/**
 * @param {number} value
 * @param {Color} color1
 * @param {Color} color2
 * @returns {Color}
 */
export function colorInterpolate(value, color1, color2) {
  return color1.map((a, index) => lerp(value, a, color2[index]))
}

/**
 * @param {[number, string][]} keyframes
 */
export function buildColorRamp(keyframes) {
  /** @type {[number, Color][]} */
  const interpreted = keyframes.map(([value, color]) => [
    value,
    hexToRGBA(color),
  ])

  const size = interpreted.length

  return (value) => {
    let c2idx = interpreted.findIndex(([v]) => v >= value)
    let c1idx = c2idx - 1

    if (c2idx === -1) {
      c2idx = size - 1
      c1idx = size - 1
    } else if (c2idx === 0) {
      c1idx = 0
    }

    if (c1idx === c2idx) return colorToString(interpreted[c1idx][1])

    const [value1, color1] = interpreted[c1idx]
    const [value2, color2] = interpreted[c2idx]
    const ratio = (value - value1) / (value2 - value1)

    return colorToString(colorInterpolate(ratio, color1, color2))
  }
}

/**
 * @param {[number, string[]][]} keyframes
 */
export function buildGradientRamp(keyframes) {
  /** @type {[number, Color[]][]} */
  const interpreted = keyframes.map(([value, colors]) => [
    value,
    colors.map((color) => hexToRGBA(color)),
  ])

  const size = interpreted.length

  return (value) => {
    let c2idx = interpreted.findIndex(([v]) => v >= value)
    let c1idx = c2idx - 1

    if (c2idx === -1) {
      c2idx = size - 1
      c1idx = size - 1
    } else if (c2idx === 0) {
      c1idx = 0
    }

    if (c1idx === c2idx)
      return interpreted[c1idx][1].map((color) => colorToString(color))

    const [value1, colors1] = interpreted[c1idx]
    const [value2, colors2] = interpreted[c2idx]
    const ratio = (value - value1) / (value2 - value1)

    return colors1.map((color1, i) =>
      colorToString(colorInterpolate(ratio, color1, colors2[i]))
    )
  }
}
