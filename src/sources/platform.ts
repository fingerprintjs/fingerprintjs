import { isDesktopWebKit, isIPad, isWebKit } from '../utils/browser'

export default function getPlatform(): string {
  // Android Chrome 86 and 87 and Android Firefox 80 and 84 don't mock the platform value when desktop mode is requested
  const { platform } = navigator

  // iOS mocks the platform value when desktop version is requested: https://github.com/fingerprintjs/fingerprintjs/issues/514
  // iPad uses desktop mode by default since iOS 13
  // The value is 'MacIntel' on M1 Macs
  // The value is 'iPhone' on iPod Touch
  if (platform === 'MacIntel') {
    if (isWebKit() && !isDesktopWebKit()) {
      return isIPad() ? 'iPad' : 'iPhone'
    }
  }

  return platform
}
