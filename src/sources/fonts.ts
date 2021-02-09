// We use m or w because these two characters take up the maximum width.
// And we use a LLi so that the same matching fonts can get separated.
const testString = 'mmMwWLliI0O&1'

// We test using 48px font size, we may use any size. I guess larger the better.
const testSize = '48px'

// A font will be compared against all the three default fonts.
// And if it doesn't match all 3 then that font is not available.
const baseFonts = ['monospace', 'sans-serif', 'serif'] as const

const fontList = [
  // This is android-specific font from "Roboto" family
  'sans-serif-thin',
  'ARNO PRO',
  'Agency FB',
  'Arabic Typesetting',
  'Arial Unicode MS',
  'AvantGarde Bk BT',
  'BankGothic Md BT',
  'Batang',
  'Bitstream Vera Sans Mono',
  'Calibri',
  'Century',
  'Century Gothic',
  'Clarendon',
  'EUROSTILE',
  'Franklin Gothic',
  'Futura Bk BT',
  'Futura Md BT',
  'GOTHAM',
  'Gill Sans',
  'HELV',
  'Haettenschweiler',
  'Helvetica Neue',
  'Humanst521 BT',
  'Leelawadee',
  'Letter Gothic',
  'Levenim MT',
  'Lucida Bright',
  'Lucida Sans',
  'Menlo',
  'MS Mincho',
  'MS Outlook',
  'MS Reference Specialty',
  'MS UI Gothic',
  'MT Extra',
  'MYRIAD PRO',
  'Marlett',
  'Meiryo UI',
  'Microsoft Uighur',
  'Minion Pro',
  'Monotype Corsiva',
  'PMingLiU',
  'Pristina',
  'SCRIPTINA',
  'Segoe UI Light',
  'Serifa',
  'SimHei',
  'Small Fonts',
  'Staccato222 BT',
  'TRAJAN PRO',
  'Univers CE 55 Medium',
  'Vrinda',
  'ZWAdobeF',
] as const

const fontSpanStyle = {
  // CSS font reset to reset external styles
  fontStyle: 'normal',
  fontWeight: 'normal',
  letterSpacing: 'normal',
  lineBreak: 'auto',
  lineHeight: 'normal',
  textTransform: 'none',
  textAlign: 'left',
  textDecoration: 'none',
  textShadow: 'none',
  whiteSpace: 'normal',
  wordBreak: 'normal',
  wordSpacing: 'normal',

  // We need this css as in some weird browser this span elements shows up for a microSec which creates
  // a bad user experience
  position: 'absolute',
  left: '-9999px',
  fontSize: testSize,
}

// kudos to http://www.lalit.org/lab/javascript-css-font-detect/
export default function getFonts(): string[] {
  const d = document
  const holder = d.body

  // div to load spans for the base fonts
  const baseFontsDiv = d.createElement('div')

  // div to load spans for the fonts to detect
  const fontsDiv = d.createElement('div')

  const defaultWidth: Partial<Record<string, number>> = {}
  const defaultHeight: Partial<Record<string, number>> = {}

  // creates a span where the fonts will be loaded
  const createSpan = () => {
    const span = d.createElement('span')
    span.textContent = testString

    for (const prop of Object.keys(fontSpanStyle) as Array<keyof typeof fontSpanStyle>) {
      span.style[prop] = fontSpanStyle[prop]
    }

    return span
  }

  // creates a span and load the font to detect and a base font for fallback
  const createSpanWithFonts = (fontToDetect: string, baseFont: string) => {
    const s = createSpan()
    s.style.fontFamily = `'${fontToDetect}',${baseFont}`
    return s
  }

  // creates spans for the base fonts and adds them to baseFontsDiv
  const initializeBaseFontsSpans = () => {
    return baseFonts.map((baseFont) => {
      const s = createSpan()
      s.style.fontFamily = baseFont
      baseFontsDiv.appendChild(s)
      return s
    })
  }

  // creates spans for the fonts to detect and adds them to fontsDiv
  const initializeFontsSpans = () => {
    // Stores {fontName : [spans for that font]}
    const spans: Record<string, HTMLSpanElement[]> = {}

    for (const font of fontList) {
      spans[font] = baseFonts.map((baseFont) => {
        const s = createSpanWithFonts(font, baseFont)
        fontsDiv.appendChild(s)
        return s
      })
    }

    return spans
  }

  // checks if a font is available
  const isFontAvailable = (fontSpans: HTMLElement[]) => {
    return baseFonts.some(
      (baseFont, baseFontIndex) =>
        fontSpans[baseFontIndex].offsetWidth !== defaultWidth[baseFont] ||
        fontSpans[baseFontIndex].offsetHeight !== defaultHeight[baseFont],
    )
  }

  // create spans for base fonts
  const baseFontsSpans = initializeBaseFontsSpans()

  // add the spans to the DOM
  holder.appendChild(baseFontsDiv)

  // get the default width for the three base fonts
  for (let index = 0, length = baseFonts.length; index < length; index++) {
    defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth // width for the default font
    defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight // height for the default font
  }

  // create spans for fonts to detect
  const fontsSpans = initializeFontsSpans()

  // add all the spans to the DOM
  holder.appendChild(fontsDiv)

  // check available fonts
  const available: string[] = []
  for (let i = 0, l = fontList.length; i < l; i++) {
    if (isFontAvailable(fontsSpans[fontList[i]])) {
      available.push(fontList[i])
    }
  }

  // remove spans from DOM
  holder.removeChild(fontsDiv)
  holder.removeChild(baseFontsDiv)
  return available
}
