const w = window

export default function getTimezone(): string | undefined {
  if (w.Intl?.DateTimeFormat) {
    return new w.Intl.DateTimeFormat().resolvedOptions().timeZone
  }
  return undefined
}
