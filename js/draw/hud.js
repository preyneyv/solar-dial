import { CENTER, R, config, ctx } from '../globals.js'
import { computed, polarToCartesian } from '../math.js'
import { DrawContext } from '../shapes.js'
import { drawDaySun } from './day.js'
import { drawNightSun } from './night.js'

/** @param {DrawContext} draw */
function drawSunPath(draw) {
  draw
    .layer((layer) => {
      layer.circle(CENTER, CENTER, config.sunPathLength).stroke('white', 2)

      const keypoints = [computed.cartesian.sunrise, computed.cartesian.sunset]
      keypoints.map((point) =>
        layer.circle(point[0], point[1], config.keypointR).fill('white').z(1)
      )
    })
    .opacity(0.5)

  const p1 = [CENTER, CENTER]
  const p2 = polarToCartesian(computed.angles.sun, R - 8)

  const grad = ctx.createLinearGradient(...p1, ...p2)
  grad.addColorStop(0.2, '#ffffff33')
  grad.addColorStop(0.7, '#ffffff')
  grad.addColorStop(1, '#ffffff00')

  draw.line(...p1, ...p2).stroke(grad, 2)
}

/** @param {DrawContext} draw */
function drawHourIntervals(draw) {
  draw
    .layer((layer) => {
      for (let hour = 0; hour < 24; hour++) {
        for (let minuteTick = 0; minuteTick < 6; minuteTick++) {
          const ratio = (hour + minuteTick / 6) / 24
          const angle = ratio * Math.PI * 2

          const isHour = minuteTick === 0
          const showText = isHour && hour % 2 === 0
          const length = isHour ? 18 : 12

          layer
            .line(
              ...polarToCartesian(angle, R - 4),
              ...polarToCartesian(angle, R - length)
            )
            .stroke('white', showText ? 3 : 2)
            .style({ lineCap: 'round' })
            .opacity(isHour ? 1 : 0.5)

          showText &&
            layer
              .text(
                ((hour || 24) + '').padStart(2, '0'),
                ...polarToCartesian(angle, R - length - 14),
                '14px Nunito'
              )
              .fill('white')
        }
      }
    })
    .opacity(0.5)
}

/** @type {DrawContext} */
export function drawHUD(draw) {
  drawHourIntervals(draw)
  drawSunPath(draw)

  drawDaySun(draw)
  drawNightSun(draw)
}
