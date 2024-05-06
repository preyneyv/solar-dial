import { drawDay } from './draw/day.js'
import { drawDial } from './draw/dial.js'
import { drawHUD } from './draw/hud.js'
import { drawNight } from './draw/night.js'
import { CENTER, DIM, R, ctx, state } from './globals.js'
import { runComputations } from './math.js'
import { DrawContext } from './shapes.js'
import { _, time } from './utils.js'

function renderNewFrame(newState) {
  ctx.clearRect(0, 0, DIM, DIM)

  Object.assign(state, newState)
  runComputations()

  // rotate canvas so 0rad is at the bottom
  ctx.save()
  ctx.translate(CENTER, CENTER)
  ctx.rotate(Math.PI / 2)
  ctx.translate(-CENTER, -CENTER)

  const draw = new DrawContext()

  draw.circle(CENTER, CENTER, R).clip((mask) => {
    drawDay(mask)
    drawNight(mask)
    mask.layer((l) => drawHUD(l))
  })

  drawDial(draw)

  draw._render(ctx)

  ctx.restore()
  requestAnimationFrame(() =>
    renderNewFrame({ now: new Date(newState.now.getTime() + 20000) })
  )
}

renderNewFrame({
  now: new Date(),
  // now: time(17, 0),
  sunrise: time(6, 38),
  sunset: time(20, 10),
})
