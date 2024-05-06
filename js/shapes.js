import { DIM } from './globals.js'

export class BaseShape {
  _z = 0

  /** @type {Partial<CanvasRenderingContext2D>} */
  _style = {}

  /** @param {CanvasRenderingContext2D} ctx */
  draw(ctx) {
    console.warn(`draw() not implemented for ${this.constructor.name}`)
  }

  /** @param {CanvasRenderingContext2D} ctx */
  render(ctx) {
    ctx.save()
    Object.assign(ctx, this._style)

    this.draw(ctx)

    ctx.restore()
  }

  /** @param {number} z */
  z(z) {
    this._z = z
    return this
  }

  /** @param {Partial<CanvasRenderingContext2D>} partialStyle */
  style(partialStyle = {}) {
    this._style = { ...this._style, ...partialStyle }
    return this
  }

  /** @param {number} opacity */
  opacity(opacity) {
    this.style({ globalAlpha: opacity })
    return this
  }
}

export class Shape extends BaseShape {
  _fill = false
  _stroke = false

  /** @type {(draw: DrawContext) => void} */
  _clip = null

  /** @param {CanvasRenderingContext2D} ctx */
  render(ctx) {
    ctx.save()
    Object.assign(ctx, this._style)

    ctx.beginPath()
    this.draw(ctx)

    if (this._clip) {
      ctx.clip()
      const queue = new DrawContext()
      this._clip(queue)
      queue._render(ctx)
    } else {
      if (this._fill) ctx.fill()
      if (this._stroke) ctx.stroke()
    }

    ctx.restore()
  }

  /** @param {string | undefined} style */
  fill(style = undefined) {
    this._fill = true
    if (style !== undefined) this.style({ fillStyle: style })
    return this
  }

  /**
   * @param {string | undefined} style
   * @param {string | undefined} width
   */
  stroke(style = undefined, width = undefined) {
    this._stroke = true
    if (style !== undefined) this.style({ strokeStyle: style })
    if (width !== undefined) this.style({ lineWidth: width })
    return this
  }

  /** @param {(draw: DrawContext) => void} callback */
  clip(callback) {
    this._clip = callback
    return this
  }
}

export class Arc extends Shape {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   * @param {number} start
   * @param {number} end
   * @param {boolean} isCounterClockwise
   */
  constructor(x, y, radius, start, end, isCounterClockwise = false) {
    super()
    this.x = x
    this.y = y
    this.radius = radius
    this.start = start
    this.end = end
    this.isCounterClockwise = isCounterClockwise
  }

  /** @type {Shape['draw']} */
  async draw(ctx) {
    ctx.arc(
      this.x,
      this.y,
      this.radius,
      this.start,
      this.end,
      this.isCounterClockwise
    )
  }
}

export class Sector extends Shape {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   * @param {number} start
   * @param {number} end
   * @param {boolean} isCounterClockwise
   */
  constructor(x, y, radius, start, end, isCounterClockwise = false) {
    super()
    this.x = x
    this.y = y
    this.radius = radius
    this.start = start
    this.end = end
    this.isCounterClockwise = isCounterClockwise
  }

  /** @type {Shape['draw']} */
  async draw(ctx) {
    ctx.moveTo(this.x, this.y)
    ctx.arc(
      this.x,
      this.y,
      this.radius,
      this.start,
      this.end,
      this.isCounterClockwise
    )
    ctx.lineTo(this.x, this.y)
  }
}

export class Circle extends Arc {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   */
  constructor(x, y, radius) {
    super(x, y, radius, 0, Math.PI * 2)
  }
}

export class Layer extends BaseShape {
  /** @type {OffscreenCanvas[]} */
  static #buffers = []
  static #bufDepth = 0

  /**
   *
   * @param {(buffer: OffscreenCanvas) => void} callback
   */
  static #acquireBuffer(callback) {
    const buffers = Layer.#buffers
    const depth = Layer.#bufDepth
    if (!buffers[depth]) {
      buffers.push(new OffscreenCanvas(DIM, DIM))
    }
    const buffer = buffers[depth]
    Layer.#bufDepth++
    callback(buffer)
    Layer.#bufDepth--
  }

  /**
   * @param {(layer: DrawContext) => void} callback
   */
  constructor(callback) {
    super()
    this.callback = callback
  }

  /** @type {BaseShape['draw']} */
  async draw(ctx) {
    const queue = new DrawContext()
    this.callback(queue)

    Layer.#acquireBuffer((buffer) => {
      const subctx = buffer.getContext('2d')
      subctx.clearRect(0, 0, buffer.width, buffer.height)
      queue._render(subctx)
      ctx.drawImage(buffer, 0, 0)
    })
  }
}

export class Rectangle extends Shape {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   */
  constructor(x, y, w, h) {
    super()
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }

  /** @type {Shape['draw']} */
  draw(ctx) {
    ctx.rect(this.x, this.y, this.w, this.h)
  }
}

export class Line extends Shape {
  /**
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   */
  constructor(x1, y1, x2, y2) {
    super()
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
  }

  /** @type {Shape['draw']} */
  draw(ctx) {
    ctx.moveTo(this.x1, this.y1)
    ctx.lineTo(this.x2, this.y2)
  }
}

export class Text extends BaseShape {
  _fill = false
  _stroke = false

  /**
   * @param {string} text
   * @param {number} x
   * @param {number} y
   * @param {string | undefined} font
   */
  constructor(text, x, y, font) {
    super()
    this.text = text
    this.x = x
    this.y = y
    this.font = font

    this.style({
      textAlign: 'center',
      textBaseline: 'middle',
    })

    if (this.font) this.style({ font })
  }

  /** @type {BaseShape['draw']} */
  draw(ctx) {
    ctx.translate(this.x + 2, this.y)
    ctx.rotate(-Math.PI / 2)

    this._fill && ctx.fillText(this.text, 0, 0)
    this._stroke && ctx.strokeText(this.text, 0, 0)
  }

  /** @param {string | undefined} style */
  fill(style = undefined) {
    this._fill = true
    if (style !== undefined) this.style({ fillStyle: style })
    return this
  }

  /**
   * @param {string | undefined} style
   * @param {string | undefined} width
   */
  stroke(style = undefined, width = undefined) {
    this._stroke = true
    if (style !== undefined) this.style({ strokeStyle: style })
    if (width !== undefined) this.style({ lineWidth: width })
    return this
  }
}

export class Custom extends Shape {
  /**
   * @param {(ctx: CanvasRenderingContext2D) => void} callback
   */
  constructor(callback) {
    super()
    this.draw = callback
  }
}

export class DrawContext {
  /** @type {BaseShape[]} */
  #queue = []

  /**
   * @template T
   * @param {T} ShapeClass
   * @returns {(...args: ConstructorParameters<T>) => InstanceType<T>}
   */
  #makeShapeWrapper(ShapeClass) {
    return (...args) => {
      const shape = new ShapeClass(...args)
      this.#queue.push(shape)
      return shape
    }
  }

  arc = this.#makeShapeWrapper(Arc)
  circle = this.#makeShapeWrapper(Circle)
  custom = this.#makeShapeWrapper(Custom)
  layer = this.#makeShapeWrapper(Layer)
  line = this.#makeShapeWrapper(Line)
  rect = this.#makeShapeWrapper(Rectangle)
  sector = this.#makeShapeWrapper(Sector)
  text = this.#makeShapeWrapper(Text)

  /**
   * Make a rectangle that fills the whole context
   */
  fill(color) {
    return this.rect(0, 0, DIM, DIM).fill(color)
  }

  _empty() {
    this.#queue = []
  }

  /**
   * Render shapes in the queue back-to-front (higher z index on top of lower)
   * @param {CanvasRenderingContext2D} ctx
   */
  _render(ctx) {
    this.#queue
      .sort((a, b) => (a._z || 0) - (b._z || 0))
      .map((shape) => shape.render(ctx))
  }
}
