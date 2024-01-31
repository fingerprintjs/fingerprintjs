export default function getTimezoneName(): string | undefined {
  const DateTimeFormat = window.Intl?.DateTimeFormat
  if (!DateTimeFormat) {
    return undefined
  }
  return DateTimeFormat().resolvedOptions().timeZone
}
