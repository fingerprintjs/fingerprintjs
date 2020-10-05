import { UAParser } from 'ua-parser-js'

/*
 * Sometimes tests need to know what browser they run in to make proper assertions.
 * Karma doesn't provide this information.
 * The browser detect functions in the `src` directory can't be used because they are objects of testing.
 * Therefore a popular third party library is used to detect browser.
 * The library isn't used in the main code because some visitors tamper user agent while test the environments don't.
 */

export function isEdgeHTML() {
  return new UAParser().getEngine().name === 'EdgeHTML'
}
