import { isChromium, isChromium86OrNewer } from '../utils/browser'

export default function getLanguages(): string[][] {
  const n = navigator
  const result: string[][] = []

  const language = n.language || n.userLanguage || n.browserLanguage || n.systemLanguage
  if (language !== undefined) {
    result.push([language])
  }

  if (Array.isArray(n.languages)) {
    // Starting from Chromium 86, there is only a single value in `navigator.language` in Incognito mode:
    // the value of `navigator.language`. Therefore the value is ignored in this browser.
    if (!(isChromium() && isChromium86OrNewer())) {
      result.push(n.languages)
    }
  } else if (typeof n.languages === 'string') {
    const languages = n.languages as string
    if (languages) {
      result.push(languages.split(','))
    }
  }

  return result
}
