import { withIframe } from '../utils/dom'

// We use m or w because these two characters take up the maximum width.
// And we use a LLi so that the same matching fonts can get separated.
const testString = 'mmMwWLliI0O&1'

// We test using 48px font size, we may use any size. I guess larger the better.
const textSize = '48px'

// A font will be compared against all the three default fonts.
// And if for any default fonts it doesn't match, then that font is available.
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

// kudos to http://www.lalit.org/lab/javascript-css-font-detect/
export default function getFonts(): Promise<string[]> {
  // Running the script in an iframe makes it not affect the page look and not be affected by the page CSS. See:
  // https://github.com/fingerprintjs/fingerprintjs/issues/592
  // https://github.com/fingerprintjs/fingerprintjs/issues/628
  return withIframe(async (_, { document }) => {
    const holder = document.body
    holder.style.fontSize = textSize

    // div to load spans for the default fonts and the fonts to detect
    const spansContainer = document.createElement('div')
    spansContainer.style.setProperty('visibility', 'hidden', 'important')

    const defaultWidth: Partial<Record<string, number>> = {}
    const defaultHeight: Partial<Record<string, number>> = {}

    // creates a span where the fonts will be loaded
    const createSpan = (fontFamily: string) => {
      const span = document.createElement('span')
      const { style } = span
      style.position = 'absolute'
      style.top = '0'
      style.left = '0'
      style.fontFamily = fontFamily
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

    // get the default width for the three base fonts
    for (let index = 0; index < baseFonts.length; index++) {
      defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth // width for the default font
      defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight // height for the default font
    }

    // check available fonts
    return fontList.filter((font) => isFontAvailable(fontsSpans[font]))
  })
}
