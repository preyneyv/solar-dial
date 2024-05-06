import { buildGradientRamp, lerp } from '../colors.js'
import { CENTER, R, config, ctx } from '../globals.js'
import { computed, polarToCartesian } from '../math.js'
import { DrawContext } from '../shapes.js'

const SKY_ANGLE = (1.5 / 24) * Math.PI * 2
const skyColors = buildGradientRamp([
  [0, ['#222146', '#17162e', '#131324', '#0d0e1c']],
  [3, ['#222146', '#17162e', '#131324', '#0d0e1c']],
  [5.5, ['#402c77', '#212f82', '#162552', '#17162e']],
  [6, ['#c17b4c', '#9a84b8ff', '#483f99ff', '#162552']],
  [6.7, ['#fbb94cff', '#c18fc6ff', '#4d7cbcff', '#4d7cbcff']],
  [9, ['#c9ffffff', '#5db0e8ff', '#2b75a0ff', '#0f73b7ff']],
  [13, ['#14a1ff', '#38b4fc', '#75d6ff', '#c9ffff']],
  [19, ['#c9ffffff', '#5db0e8ff', '#2b75a0ff', '#0f73b7ff']],
  [19.5, ['#fbb94cff', '#c18fc6ff', '#4d7cbcff', '#4d7cbcff']],
  [20, ['#c17b4c', '#9a84b8ff', '#483f99ff', '#162552']],
  [21, ['#402c77', '#212f82', '#162552', '#17162e']],
  [24, ['#222146', '#17162e', '#131324', '#0d0e1c']],
])

/** @param {DrawContext} draw */
export const daySector = (draw) =>
  draw.sector(
    CENTER,
    CENTER,
    CENTER,
    computed.angles.sunrise,
    computed.angles.sunset
  )

/** @param {DrawContext} draw */
export function drawDaySun(draw) {
  const sunIntensity = 1 - Math.abs(12 - computed.combined.sun) / 12
  // console.log(sunIntensity)
  const glowGrad = ctx.createRadialGradient(
    ...computed.cartesian.sun,
    0,
    ...computed.cartesian.sun,
    lerp(sunIntensity, 0.5, 1) * config.sunGlow
  )
  glowGrad.addColorStop(0.1, 'white')
  glowGrad.addColorStop(0.11, '#fffc99')
  glowGrad.addColorStop(0.14, '#fffc9977')
  glowGrad.addColorStop(1, '#fffc9900')

  const sunGrad = ctx.createRadialGradient(
    ...computed.cartesian.sun,
    0,
    ...computed.cartesian.sun,
    config.sunMainR * 1.2
  )
  sunGrad.addColorStop(0.8, 'white')
  sunGrad.addColorStop(1, '#fffc0000')

  daySector(draw).clip((mask) => {
    mask.circle(...computed.cartesian.sun, sunIntensity).fill(glowGrad)

    mask.circle(...computed.cartesian.sun, config.sunMainR * 1.2).fill(sunGrad)
  })
}

/** @param {DrawContext} draw */
export function drawDay(draw) {
  daySector(draw).clip((mask) => {
    const grad = ctx.createLinearGradient(
      ...polarToCartesian(SKY_ANGLE, R),
      ...polarToCartesian(SKY_ANGLE + Math.PI, R)
    )
    const colors = skyColors(computed.combined.sun)
    grad.addColorStop(0.43, colors[0])
    grad.addColorStop(0.55, colors[1])
    grad.addColorStop(0.8, colors[2])
    grad.addColorStop(1, colors[3])
    mask.fill(grad)
  })
}
