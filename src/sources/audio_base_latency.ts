export default function getAudioContextBaseLatency(): number | undefined {
  if (!window.AudioContext) {
    return undefined
  }

  return new AudioContext().baseLatency
}
