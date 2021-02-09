/**
 * navigator.cookieEnabled cannot detect custom or nuanced cookie blocking configurations. For example, when blocking
 * cookies via the Advanced Privacy Settings in IE9, it always returns true. And there have been issues in the past with
 * site-specific exceptions. Don't rely on it.
 *
 * @see https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cookies.js Taken from here
 */
export default function areCookiesEnabled(): boolean {
  const d = document

  // Taken from here: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cookies.js
  // navigator.cookieEnabled cannot detect custom or nuanced cookie blocking configurations. For example, when blocking
  // cookies via the Advanced Privacy Settings in IE9, it always returns true. And there have been issues in the past
  // with site-specific exceptions. Don't rely on it.

  // try..catch because some in situations `document.cookie` is exposed but throws a
  // SecurityError if you try to access it; e.g. documents created from data URIs
  // or in sandboxed iframes (depending on flags/context)
  try {
    // Create cookie
    d.cookie = 'cookietest=1; SameSite=Strict;'
    const result = d.cookie.indexOf('cookietest=') !== -1
    // Delete cookie
    d.cookie = 'cookietest=1; SameSite=Strict; expires=Thu, 01-Jan-1970 00:00:01 GMT'
    return result
  } catch (e) {
    return false
  }
}
