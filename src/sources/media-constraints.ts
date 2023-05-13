/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getSupportedConstraints
 */
export default async function getSupportedMediaConstraints() {
  if (!navigator?.mediaDevices?.getSupportedConstraints) {
    return undefined
  }
  return navigator.mediaDevices.getSupportedConstraints()
}
