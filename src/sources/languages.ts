const n = navigator

export default function getLanguages(): string[][] {
  const result: string[][] = []

  const language = n.language || n.userLanguage || n.browserLanguage || n.systemLanguage
  if (language !== undefined) {
    result.push([language])
  }

  if (Array.isArray(n.languages)) {
    result.push(n.languages)
  } else if (typeof n.languages === 'string') {
    const languages = n.languages as string
    if (languages) {
      result.push(languages.split(','))
    }
  }

  return result
}
