import { state, config, R, CENTER } from './globals.js'
import { combinedToAngle, dateToAngle, dateToCombined } from './utils.js'

export function polarToCartesian(angle, magnitude) {
  return [
    Math.cos(angle) * magnitude + CENTER,
    Math.sin(angle) * magnitude + CENTER,
  ]
}

export function getSunPos() {
  return polarToCartesian(computed.sunAngle, config.sunPathLength)
}

export const computed = {
  combined: { sun: 0 },
  angles: {
    sun: 0,
    sunset: 0,
    sunrise: 0,
  },
  cartesian: {
    sun: [0, 0],
    sunset: [0, 0],
    sunrise: [0, 0],
    dial: [0, 0],
  },
}

export function runComputations() {
  computed.combined.sun = dateToCombined(state.now)

  computed.angles.sun = combinedToAngle(computed.combined.sun)
  computed.angles.sunrise = dateToAngle(state.sunrise)
  computed.angles.sunset = dateToAngle(state.sunset)

  computed.cartesian.sun = polarToCartesian(
    computed.angles.sun,
    config.sunPathLength
  )
  computed.cartesian.sunrise = polarToCartesian(
    computed.angles.sunrise,
    config.sunPathLength
  )
  computed.cartesian.sunset = polarToCartesian(
    computed.angles.sunset,
    config.sunPathLength
  )
  computed.cartesian.dial = polarToCartesian(
    computed.angles.sun,
    -config.inner / 2
  )
}
