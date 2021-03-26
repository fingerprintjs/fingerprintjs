// We use m or w because these two characters take up the maximum width.
// And we use a LLi so that the same matching fonts can get separated.
const testString = 'mmMwWLliI0O&1'

// We test using 48px font size, we may use any size. I guess larger the better.
const textSize = '48px'

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

const spanContainerStyle = {
  display: 'block',

  // We need this CSS as in some weird browser this span elements shows up for a microsecond which creates
  // a bad user experience
  position: 'absolute',
  left: '-9999px',
  top: '0',
}

const fontSpanStyle = {
  // CSS font reset to reset external styles
  'font-style': 'normal',
  'font-weight': 'normal',
  'letter-spacing': 'normal',
  'line-break': 'auto',
  'line-height': 'normal',
  'text-transform': 'none',
  'text-align': 'left',
  'text-decoration': 'none',
  'white-space': 'normal',
  'word-break': 'normal',
  'word-spacing': 'normal',

  'font-size': textSize,
  display: 'inline-block',
  position: 'absolute',
  left: '0',
  top: '0',
}

// kudos to http://www.lalit.org/lab/javascript-css-font-detect/
export default function getFonts(): string[] {
  const d = document
  const holder = d.body

  // div to load spans for the default fonts and the fonts to detect
  const spansContainer = d.createElement('div')
  setStyles(spansContainer, spanContainerStyle)

  const defaultWidth: Partial<Record<string, number>> = {}
  const defaultHeight: Partial<Record<string, number>> = {}

  // creates a span where the fonts will be loaded
  const createSpan = (fontFamily: string) => {
    const span = d.createElement('span')
    setStyles(span, fontSpanStyle)
    setStyle(span, 'font-family', fontFamily)
    span.textContent = testString
    spansContainer.appendChild(span)
    return span
  }

  // creates a span and load the font to detect and a base font for fallback
  const createSpanWithFonts = (fontToDetect: string, baseFont: string) => {
    return createSpan(`'${fontToDetect}',${baseFont}`)
  }

  // creates spans for the base fonts and adds them to baseFontsDiv
  const initializeBaseFontsSpans = () => {
    return baseFonts.map(createSpan)
  }

  // creates spans for the fonts to detect and adds them to fontsDiv
  const initializeFontsSpans = () => {
    // Stores {fontName : [spans for that font]}
    const spans: Record<string, HTMLSpanElement[]> = {}

    for (const font of fontList) {
      spans[font] = baseFonts.map((baseFont) => createSpanWithFonts(font, baseFont))
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

  // create spans for fonts to detect
  const fontsSpans = initializeFontsSpans()

  // add all the spans to the DOM
  holder.appendChild(spansContainer)

  try {
    // get the default width for the three base fonts
    for (let index = 0; index < baseFonts.length; index++) {
      defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth // width for the default font
      defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight // height for the default font
    }

    // check available fonts
    return fontList.filter((font) => isFontAvailable(fontsSpans[font]))
  } finally {
    // remove spans from DOM
    holder.removeChild(spansContainer)
  }
}

function setStyle(element: HTMLElement, property: string, value: string) {
  element.style.setProperty(property, value, 'important')
}

function setStyles(element: HTMLElement, styles: Record<string, string>) {
  for (const property of Object.keys(fontSpanStyle)) {
    setStyle(element, property, styles[property])
  }
}
