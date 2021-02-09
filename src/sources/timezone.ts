export default function getTimezone(): string | undefined {
  const DateTimeFormat = window.Intl?.DateTimeFormat
  if (DateTimeFormat) {
    return new DateTimeFormat().resolvedOptions().timeZone
  }
  return undefined
}
