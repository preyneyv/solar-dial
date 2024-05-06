import { CENTER, R, canvas, config, state } from '../globals.js'
import { computed } from '../math.js'
import { DrawContext } from '../shapes.js'
import { formatTime } from '../utils.js'

/** @param {DrawContext} draw */
export function drawDial(draw) {
  draw.circle(...computed.cartesian.dial, config.inner).clip((mask) => {
    mask
      .custom((ctx) => {
        ctx.translate(CENTER, CENTER)
        ctx.rotate(-Math.PI / 2)
        ctx.translate(-CENTER, -CENTER)
        ctx.drawImage(canvas, 0, 0)
      })
      .style({ filter: 'blur(20px)' })
    mask.fill('#ffffff0a')
  })
  draw
    .text(
      formatTime(state.now),
      computed.cartesian.dial[0] + R * 0.025,
      computed.cartesian.dial[1],
      `${R * 0.23}px Nunito`
    )
    .fill('white')
}
