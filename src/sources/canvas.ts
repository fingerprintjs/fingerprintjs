export interface CanvasFingerprint {
  winding: boolean
  geometry: string
  text: string
}

// https://www.browserleaks.com/canvas#how-does-it-work
export default function getCanvasFingerprint(): CanvasFingerprint {
  const [canvas, context] = makeCanvasContext()
  if (!isSupported(canvas, context)) {
    return { winding: false, geometry: '', text: '' }
  }

  return {
    winding: doesSupportWinding(context),
    geometry: makeGeometryImage(canvas, context),
    // Text is unstable:
    // https://github.com/fingerprintjs/fingerprintjs/issues/583
    // https://github.com/fingerprintjs/fingerprintjs/issues/103
    // Therefore it's extracted into a separate image.
    text: makeTextImage(canvas, context),
  }
}

function makeCanvasContext() {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return [canvas, canvas.getContext('2d')] as const
}

function isSupported(
  canvas: HTMLCanvasElement,
  context?: CanvasRenderingContext2D | null,
): context is CanvasRenderingContext2D {
  // TODO: look into: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
  return !!(context && canvas.toDataURL)
}

function doesSupportWinding(context: CanvasRenderingContext2D) {
  // https://web.archive.org/web/20170825024655/http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
  // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
  context.rect(0, 0, 10, 10)
  context.rect(2, 2, 6, 6)
  return !context.isPointInPath(5, 5, 'evenodd')
}

function makeTextImage(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
  // Resizing the canvas cleans it
  canvas.width = 240
  canvas.height = 60

  context.textBaseline = 'alphabetic'
  context.fillStyle = '#f60'
  context.fillRect(100, 1, 62, 20)

  context.fillStyle = '#069'
  // It's important to use explicit built-in fonts in order to exclude the affect of font preferences
  // (there is a separate entropy source for them).
  context.font = '11pt "Times New Roman"'
  // The choice of emojis has a gigantic impact on rendering performance (especially in FF).
  // Some newer emojis cause it to slow down 50-200 times.
  // There must be no text to the right of the emoji, see https://github.com/fingerprintjs/fingerprintjs/issues/574
  // A bare emoji shouldn't be used because the canvas will change depending on the script encoding:
  // https://github.com/fingerprintjs/fingerprintjs/issues/66
  // Escape sequence shouldn't be used too because Terser will turn it into a bare unicode.
  const printedText = `Cwm fjordbank gly ${String.fromCharCode(55357, 56835) /* 😃 */}`
  context.fillText(printedText, 2, 15)
  context.fillStyle = 'rgba(102, 204, 0, 0.2)'
  context.font = '18pt Arial'
  context.fillText(printedText, 4, 45)

  return save(canvas)
}

function makeGeometryImage(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
  // Resizing the canvas cleans it
  canvas.width = 122
  canvas.height = 110

  // Canvas blending
  // https://web.archive.org/web/20170826194121/http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
  // http://jsfiddle.net/NDYV8/16/
  context.globalCompositeOperation = 'multiply'
  for (const [color, x, y] of [
    ['#f2f', 40, 40],
    ['#2ff', 80, 40],
    ['#ff2', 60, 80],
  ] as const) {
    context.fillStyle = color
    context.beginPath()
    context.arc(x, y, 40, 0, Math.PI * 2, true)
    context.closePath()
    context.fill()
  }

  // Canvas winding
  // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
  // http://jsfiddle.net/NDYV8/19/
  context.fillStyle = '#f9c'
  context.arc(60, 60, 60, 0, Math.PI * 2, true)
  context.arc(60, 60, 20, 0, Math.PI * 2, true)
  context.fill('evenodd')

  return save(canvas)
}

function save(canvas: HTMLCanvasElement) {
  // TODO: look into: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
  return canvas.toDataURL()
}
