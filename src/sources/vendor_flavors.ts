/**
 * Checks for browser-specific (not engine specific) global variables to tell browsers with the same engine apart.
 * Only somewhat popular browsers are considered.
 */
export default function getVendorFlavors(): string[] {
  const flavors: string[] = []

  for (const key of [
    // Blink and some browsers on iOS
    'chrome',

    // Safari on macOS
    'safari',

    // Chrome on iOS (checked in 85 on 13 and 87 on 14)
    '__crWeb',
    '__gCrWeb',

    // Yandex Browser on iOS, macOS and Android (checked in 21.2 on iOS 14, macOS and Android)
    'yandex',

    // Yandex Browser on iOS (checked in 21.2 on 14)
    '__yb',
    '__ybro',

    // Firefox on iOS (checked in 32 on 14)
    '__firefox__',

    // Edge on iOS (checked in 46 on 14)
    '__edgeTrackingPreventionStatistics',
    'webkit',

    // Opera Touch on iOS (checked in 2.6 on 14)
    'oprt',

    // Samsung Internet on Android (checked in 11.1)
    'samsungAr',

    // UC Browser on Android (checked in 12.10 and 13.0)
    'ucweb',
    'UCShellJava',

    // Puffin on Android (checked in 9.0)
    'puffinDevice',

    // UC on iOS and Opera on Android have no specific global variables
    // Edge for Android isn't checked
  ]) {
    const value = (window as unknown as Record<string, unknown>)[key]
    if (value && typeof value === 'object') {
      flavors.push(key)
    }
  }

  return flavors.sort()
}
