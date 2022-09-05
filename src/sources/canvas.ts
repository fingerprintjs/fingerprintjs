export interface CanvasFingerprint {
  winding: boolean
  geometry: string
  text: string
}

// https://www.browserleaks.com/canvas#how-does-it-work
export default function getCanvasFingerprint(): CanvasFingerprint {
  let winding = false
  let geometry: string
  let text: string

  const [canvas, context] = makeCanvasContext()
  if (!isSupported(canvas, context)) {
    geometry = text = '' // The value will be 'unsupported' in v3.4
  } else {
    winding = doesSupportWinding(context)

    renderTextImage(canvas, context)
    const textImage1 = canvasToString(canvas)
    const textImage2 = canvasToString(canvas) // It's slightly faster to double-encode the text image

    // Some browsers add a noise to the canvas: https://github.com/fingerprintjs/fingerprintjs/issues/791
    // The canvas is excluded from the fingerprint in this case
    if (textImage1 !== textImage2) {
      geometry = text = 'unstable'
    } else {
      text = textImage1

      // Text is unstable:
      // https://github.com/fingerprintjs/fingerprintjs/issues/583
      // https://github.com/fingerprintjs/fingerprintjs/issues/103
      // Therefore it's extracted into a separate image.
      renderGeometryImage(canvas, context)
      geometry = canvasToString(canvas)
    }
  }

  return { winding, geometry, text }
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
  return !!(context && canvas.toDataURL)
}

function doesSupportWinding(context: CanvasRenderingContext2D) {
  // https://web.archive.org/web/20170825024655/http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
  // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
  context.rect(0, 0, 10, 10)
  context.rect(2, 2, 6, 6)
  return !context.isPointInPath(5, 5, 'evenodd')
}

function renderTextImage(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
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
}

function renderGeometryImage(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
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
  // https://web.archive.org/web/20130913061632/http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
  // http://jsfiddle.net/NDYV8/19/
  context.fillStyle = '#f9c'
  context.arc(60, 60, 60, 0, Math.PI * 2, true)
  context.arc(60, 60, 20, 0, Math.PI * 2, true)
  context.fill('evenodd')
}

function canvasToString(canvas: HTMLCanvasElement) {
  return canvas.toDataURL()
}
