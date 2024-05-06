export const _ = (q) => document.querySelector(q)

/**
 * convert the provided time to an angle (00:00 = 0rad)
 * @param {number} combined
 */
export function combinedToAngle(combined) {
  const ratio = combined / 24
  return ratio * 2 * Math.PI
}

/**
 *
 * @param {Date} date
 */
export function dateToCombined(date) {
  const [h, m] = [date.getHours(), date.getMinutes()]
  const combined = h + m / 60
  return combined
}

export function dateToAngle(date) {
  return combinedToAngle(dateToCombined(date))
}

export function time(h, m) {
  const d = new Date()
  d.setHours(h)
  d.setMinutes(m)
  return d
}

/** @param {Date} date */
export function formatTime(date) {
  const h = date.getHours() % 12
  return [h || 12, (date.getMinutes() + '').padStart(2, '0')].join(':')
}
