function makeCanvasContext() {
  const canvas = document.createElement('canvas')
  canvas.width = 240
  canvas.height = 140
  canvas.style.display = 'inline'
  return [canvas, canvas.getContext('2d')] as const
}

function isSupported(
  canvas: HTMLCanvasElement,
  context?: CanvasRenderingContext2D | null,
): context is CanvasRenderingContext2D {
  // TODO: look into: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
  return !!(context && canvas.toDataURL)
}

function save(canvas: HTMLCanvasElement) {
  // TODO: look into: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
  return canvas.toDataURL()
}

export interface CanvasFingerprint {
  winding: boolean
  data: string
}

// https://www.browserleaks.com/canvas#how-does-it-work
export default function getCanvasFingerprint(): CanvasFingerprint {
  const [canvas, context] = makeCanvasContext()
  if (!isSupported(canvas, context)) {
    return { winding: false, data: '' }
  }

  // detect browser support of canvas winding
  // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
  // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
  context.rect(0, 0, 10, 10)
  context.rect(2, 2, 6, 6)
  const winding = !context.isPointInPath(5, 5, 'evenodd')

  context.textBaseline = 'alphabetic'
  context.fillStyle = '#f60'
  context.fillRect(125, 1, 62, 20)
  context.fillStyle = '#069'
  // It's important to use explicit built-in fonts in order to exclude the affect of font preferences
  // (there is a separate entropy source for them).
  context.font = '11pt "Times New Roman"'
  // The choice of emojis has a gigantic impact on rendering performance (especially in FF)
  // Some newer emojis cause it to slow down 50-200 times
  // There must be no text to the right of the emoji, see https://github.com/fingerprintjs/fingerprintjs/issues/574
  const printedText = 'Cwm fjordbank gly \ud83d\ude03'
  context.fillText(printedText, 2, 15)
  context.fillStyle = 'rgba(102, 204, 0, 0.2)'
  context.font = '18pt Arial'
  context.fillText(printedText, 4, 45)

  // Canvas blending
  // http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
  // http://jsfiddle.net/NDYV8/16/
  context.globalCompositeOperation = 'multiply'
  context.fillStyle = 'rgb(255,0,255)'
  context.beginPath()
  context.arc(50, 50, 50, 0, Math.PI * 2, true)
  context.closePath()
  context.fill()
  context.fillStyle = 'rgb(0,255,255)'
  context.beginPath()
  context.arc(100, 50, 50, 0, Math.PI * 2, true)
  context.closePath()
  context.fill()
  context.fillStyle = 'rgb(255,255,0)'
  context.beginPath()
  context.arc(75, 100, 50, 0, Math.PI * 2, true)
  context.closePath()
  context.fill()
  context.fillStyle = 'rgb(255,0,255)'

  // Canvas winding
  // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
  // http://jsfiddle.net/NDYV8/19/
  context.arc(75, 75, 75, 0, Math.PI * 2, true)
  context.arc(75, 75, 25, 0, Math.PI * 2, true)
  context.fill('evenodd')

  return {
    winding,
    data: save(canvas),
  }
}
