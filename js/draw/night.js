import { buildColorRamp } from '../colors.js'
import { CENTER, R, config, state } from '../globals.js'
import { computed } from '../math.js'
import { DrawContext } from '../shapes.js'

export const cNight = buildColorRamp([
  [0, '#17162e'],
  [3, '#17162e'],
  [6, '#112140'],
  [13, '#0d243b'],
  [17, '#112140'],
  [24, '#17162e'],
])

/** @param {DrawContext} draw */
export const nightSector = (draw) =>
  draw.sector(
    CENTER,
    CENTER,
    CENTER,
    computed.angles.sunset,
    computed.angles.sunrise
  )

/** @param {DrawContext} draw */
export function drawNightSun(draw) {
  nightSector(draw).clip((mask) =>
    mask
      .circle(...computed.cartesian.sun, config.sunMainR)
      .fill(cNight(computed.combined.sun))
      .stroke('white', 3)
  )
}

/** @param {DrawContext} draw */
export function drawNight(draw) {
  nightSector(draw).clip((mask) => {
    mask.fill(cNight(computed.combined.sun))
  })
}
