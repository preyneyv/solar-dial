import { DrawContext } from './shapes.js'
import { _ } from './utils.js'

export const DIM = 400
export const CENTER = DIM / 2
export const R = (DIM / 2) * 0.9

export const state = {
  now: new Date(),
  sunset: new Date(),
  sunrise: new Date(),
}

export const config = {
  inner: R * 0.45,
  sunPathLength: R * 0.6,
  sunGlow: R * 0.7,
  sunMainR: R * 0.07,
  keypointR: R * 0.02,
}

/**  @type {HTMLCanvasElement} */
export const canvas = _('#watch-face')
export const ctx = canvas.getContext('2d')
if (!ctx) throw new Error("Couldn't get main rendering context")
