import { isAndroid, isWebKit } from '../utils/browser'
import { selectorToElement } from '../utils/dom'
import { countTruthy } from '../utils/data'
import { wait } from '../utils/async'

const decodeBase64 = atob // Just for better minification

/**
 * Only single element selector are supported (no operators like space, +, >, etc).
 * `embed` and `position: fixed;` will be considered as blocked anyway because it always has no offsetParent.
 * Avoid `iframe` and anything with `[src=]` because they produce excess HTTP requests.
 *
 * The "inappropriate" selectors are obfuscated. See https://github.com/fingerprintjs/fingerprintjs/issues/734.
 *
 * See docs/content_blockers.md to learn how to make the list
 */
export const filters = {
  abpIndo: [
    '#Iklan-Melayang',
    '#Kolom-Iklan-728',
    '#SidebarIklan-wrapper',
    decodeBase64('YVt0aXRsZT0iN25hZ2EgcG9rZXIiIGld'),
    '[title="ALIENBOLA" i]',
  ],
  abpvn: [
    '#quangcaomb',
    decodeBase64('Lmlvc0Fkc2lvc0Fkcy1sYXlvdXQ='),
    '.quangcao',
    decodeBase64('W2hyZWZePSJodHRwczovL3I4OC52bi8iXQ=='),
    decodeBase64('W2hyZWZePSJodHRwczovL3piZXQudm4vIl0='),
  ],
  adBlockFinland: [
    '.mainostila',
    decodeBase64('LnNwb25zb3JpdA=='),
    '.ylamainos',
    decodeBase64('YVtocmVmKj0iL2NsaWNrdGhyZ2guYXNwPyJd'),
    decodeBase64('YVtocmVmXj0iaHR0cHM6Ly9hcHAucmVhZHBlYWsuY29tL2FkcyJd'),
  ],
  adBlockPersian: ['#navbar_notice_50', '.kadr', 'TABLE[width="140px"]', '#divAgahi', decodeBase64('I2FkMl9pbmxpbmU=')],
  adBlockWarningRemoval: [
    '#adblock-honeypot',
    '.adblocker-root',
    '.wp_adblock_detect',
    decodeBase64('LmhlYWRlci1ibG9ja2VkLWFk'),
    decodeBase64('I2FkX2Jsb2NrZXI='),
  ],
  adGuardAnnoyances: ['amp-embed[type="zen"]', '.hs-sosyal', '#cookieconsentdiv', 'div[class^="app_gdpr"]', '.as-oil'],
  adGuardBase: [
    '.BetterJsPopOverlay',
    decodeBase64('I2FkXzMwMFgyNTA='),
    decodeBase64('I2Jhbm5lcmZsb2F0MjI='),
    decodeBase64('I2FkLWJhbm5lcg=='),
    decodeBase64('I2NhbXBhaWduLWJhbm5lcg=='),
  ],
  adGuardChinese: [
    decodeBase64('LlppX2FkX2FfSA=='),
    decodeBase64('YVtocmVmKj0iL29kMDA1LmNvbSJd'),
    decodeBase64('YVtocmVmKj0iLmh0aGJldDM0LmNvbSJd'),
    '.qq_nr_lad',
    '#widget-quan',
  ],
  adGuardFrench: [
    decodeBase64('I2Jsb2NrLXZpZXdzLWFkcy1zaWRlYmFyLWJsb2NrLWJsb2Nr'),
    '#pavePub',
    decodeBase64('LmFkLWRlc2t0b3AtcmVjdGFuZ2xl'),
    '.mobile_adhesion',
    '.widgetadv',
  ],
  adGuardGerman: [
    decodeBase64('LmJhbm5lcml0ZW13ZXJidW5nX2hlYWRfMQ=='),
    decodeBase64('LmJveHN0YXJ0d2VyYnVuZw=='),
    decodeBase64('LndlcmJ1bmcz'),
    decodeBase64('YVtocmVmXj0iaHR0cDovL3d3dy5laXMuZGUvaW5kZXgucGh0bWw/cmVmaWQ9Il0='),
    decodeBase64('YVtocmVmXj0iaHR0cHM6Ly93d3cudGlwaWNvLmNvbS8/YWZmaWxpYXRlSWQ9Il0='),
  ],
  adGuardJapanese: [
    '#kauli_yad_1',
    decodeBase64('YVtocmVmXj0iaHR0cDovL2FkMi50cmFmZmljZ2F0ZS5uZXQvIl0='),
    decodeBase64('Ll9wb3BJbl9pbmZpbml0ZV9hZA=='),
    decodeBase64('LmFkZ29vZ2xl'),
    decodeBase64('LmFkX3JlZ3VsYXIz'),
  ],
  adGuardMobile: [
    decodeBase64('YW1wLWF1dG8tYWRz'),
    decodeBase64('LmFtcF9hZA=='),
    'amp-embed[type="24smi"]',
    '#mgid_iframe1',
    decodeBase64('I2FkX2ludmlld19hcmVh'),
  ],
  adGuardRussian: [
    decodeBase64('YVtocmVmXj0iaHR0cHM6Ly9hZC5sZXRtZWFkcy5jb20vIl0='),
    decodeBase64('LnJlY2xhbWE='),
    'div[id^="smi2adblock"]',
    decodeBase64('ZGl2W2lkXj0iQWRGb3hfYmFubmVyXyJd'),
    decodeBase64('I2FkX3NxdWFyZQ=='),
  ],
  adGuardSocial: [
    decodeBase64('YVtocmVmXj0iLy93d3cuc3R1bWJsZXVwb24uY29tL3N1Ym1pdD91cmw9Il0='),
    decodeBase64('YVtocmVmXj0iLy90ZWxlZ3JhbS5tZS9zaGFyZS91cmw/Il0='),
    '.etsy-tweet',
    '#inlineShare',
    '.popup-social',
  ],
  adGuardSpanishPortuguese: [
    '#barraPublicidade',
    '#Publicidade',
    '#publiEspecial',
    '#queTooltip',
    decodeBase64('W2hyZWZePSJodHRwOi8vYWRzLmdsaXNwYS5jb20vIl0='),
  ],
  adGuardTrackingProtection: [
    '#qoo-counter',
    decodeBase64('YVtocmVmXj0iaHR0cDovL2NsaWNrLmhvdGxvZy5ydS8iXQ=='),
    decodeBase64('YVtocmVmXj0iaHR0cDovL2hpdGNvdW50ZXIucnUvdG9wL3N0YXQucGhwIl0='),
    decodeBase64('YVtocmVmXj0iaHR0cDovL3RvcC5tYWlsLnJ1L2p1bXAiXQ=='),
    '#top100counter',
  ],
  adGuardTurkish: [
    '#backkapat',
    decodeBase64('I3Jla2xhbWk='),
    decodeBase64('YVtocmVmXj0iaHR0cDovL2Fkc2Vydi5vbnRlay5jb20udHIvIl0='),
    decodeBase64('YVtocmVmXj0iaHR0cDovL2l6bGVuemkuY29tL2NhbXBhaWduLyJd'),
    decodeBase64('YVtocmVmXj0iaHR0cDovL3d3dy5pbnN0YWxsYWRzLm5ldC8iXQ=='),
  ],
  bulgarian: [
    decodeBase64('dGQjZnJlZW5ldF90YWJsZV9hZHM='),
    '#ea_intext_div',
    '.lapni-pop-over',
    '#xenium_hot_offers',
    decodeBase64('I25ld0Fk'),
  ],
  easyList: [
    decodeBase64('I0FEX0NPTlRST0xfMjg='),
    decodeBase64('LnNlY29uZC1wb3N0LWFkcy13cmFwcGVy'),
    '.universalboxADVBOX03',
    decodeBase64('LmFkdmVydGlzZW1lbnQtNzI4eDkw'),
    decodeBase64('LnNxdWFyZV9hZHM='),
  ],
  easyListChina: [
    decodeBase64('YVtocmVmKj0iLndlbnNpeHVldGFuZy5jb20vIl0='),
    decodeBase64('LmFwcGd1aWRlLXdyYXBbb25jbGljayo9ImJjZWJvcy5jb20iXQ=='),
    decodeBase64('LmZyb250cGFnZUFkdk0='),
    '#taotaole',
    '#aafoot.top_box',
  ],
  easyListCookie: [
    '#AdaCompliance.app-notice',
    '.text-center.rgpd',
    '.panel--cookie',
    '.js-cookies-andromeda',
    '.elxtr-consent',
  ],
  easyListCzechSlovak: [
    '#onlajny-stickers',
    decodeBase64('I3Jla2xhbW5pLWJveA=='),
    decodeBase64('LnJla2xhbWEtbWVnYWJvYXJk'),
    '.sklik',
    decodeBase64('W2lkXj0ic2tsaWtSZWtsYW1hIl0='),
  ],
  easyListDutch: [
    decodeBase64('I2FkdmVydGVudGll'),
    decodeBase64('I3ZpcEFkbWFya3RCYW5uZXJCbG9jaw=='),
    '.adstekst',
    decodeBase64('YVtocmVmXj0iaHR0cHM6Ly94bHR1YmUubmwvY2xpY2svIl0='),
    '#semilo-lrectangle',
  ],
  easyListGermany: [
    decodeBase64('I0FkX1dpbjJkYXk='),
    decodeBase64('I3dlcmJ1bmdzYm94MzAw'),
    decodeBase64('YVtocmVmXj0iaHR0cDovL3d3dy5yb3RsaWNodGthcnRlaS5jb20vP3NjPSJd'),
    decodeBase64('I3dlcmJ1bmdfd2lkZXNreXNjcmFwZXJfc2NyZWVu'),
    decodeBase64('YVtocmVmXj0iaHR0cDovL2xhbmRpbmcucGFya3BsYXR6a2FydGVpLmNvbS8/YWc9Il0='),
  ],
  easyListItaly: [
    decodeBase64('LmJveF9hZHZfYW5udW5jaQ=='),
    '.sb-box-pubbliredazionale',
    decodeBase64('YVtocmVmXj0iaHR0cDovL2FmZmlsaWF6aW9uaWFkcy5zbmFpLml0LyJd'),
    decodeBase64('YVtocmVmXj0iaHR0cHM6Ly9hZHNlcnZlci5odG1sLml0LyJd'),
    decodeBase64('YVtocmVmXj0iaHR0cHM6Ly9hZmZpbGlhemlvbmlhZHMuc25haS5pdC8iXQ=='),
  ],
  easyListLithuania: [
    decodeBase64('LnJla2xhbW9zX3RhcnBhcw=='),
    decodeBase64('LnJla2xhbW9zX251b3JvZG9z'),
    decodeBase64('aW1nW2FsdD0iUmVrbGFtaW5pcyBza3lkZWxpcyJd'),
    decodeBase64('aW1nW2FsdD0iRGVkaWt1b3RpLmx0IHNlcnZlcmlhaSJd'),
    decodeBase64('aW1nW2FsdD0iSG9zdGluZ2FzIFNlcnZlcmlhaS5sdCJd'),
  ],
  estonian: [decodeBase64('QVtocmVmKj0iaHR0cDovL3BheTRyZXN1bHRzMjQuZXUiXQ==')],
  fanboyAnnoyances: [
    '#feedback-tab',
    '#taboola-below-article',
    '.feedburnerFeedBlock',
    '.widget-feedburner-counter',
    '[title="Subscribe to our blog"]',
  ],
  fanboyAntiFacebook: ['.util-bar-module-firefly-visible'],
  fanboyEnhancedTrackers: [
    '.open.pushModal',
    '#issuem-leaky-paywall-articles-zero-remaining-nag',
    '#sovrn_container',
    'div[class$="-hide"][zoompage-fontsize][style="display: block;"]',
    '.BlockNag__Card',
  ],
  fanboySocial: [
    '.td-tags-and-social-wrapper-box',
    '.twitterContainer',
    '.youtube-social',
    'a[title^="Like us on Facebook"]',
    'img[alt^="Share on Digg"]',
  ],
  frellwitSwedish: [
    decodeBase64('YVtocmVmKj0iY2FzaW5vcHJvLnNlIl1bdGFyZ2V0PSJfYmxhbmsiXQ=='),
    decodeBase64('YVtocmVmKj0iZG9rdG9yLXNlLm9uZWxpbmsubWUiXQ=='),
    'article.category-samarbete',
    decodeBase64('ZGl2LmhvbGlkQWRz'),
    'ul.adsmodern',
  ],
  greekAdBlock: [
    decodeBase64('QVtocmVmKj0iYWRtYW4ub3RlbmV0LmdyL2NsaWNrPyJd'),
    decodeBase64('QVtocmVmKj0iaHR0cDovL2F4aWFiYW5uZXJzLmV4b2R1cy5nci8iXQ=='),
    decodeBase64('QVtocmVmKj0iaHR0cDovL2ludGVyYWN0aXZlLmZvcnRobmV0LmdyL2NsaWNrPyJd'),
    'DIV.agores300',
    'TABLE.advright',
  ],
  hungarian: [
    '#cemp_doboz',
    '.optimonk-iframe-container',
    decodeBase64('LmFkX19tYWlu'),
    decodeBase64('W2NsYXNzKj0iR29vZ2xlQWRzIl0='),
    '#hirdetesek_box',
  ],
  iDontCareAboutCookies: [
    '.alert-info[data-block-track*="CookieNotice"]',
    '.ModuleTemplateCookieIndicator',
    '.o--cookies--container',
    '.cookie-msg-info-container',
    '#cookies-policy-sticky',
  ],
  icelandicAbp: [decodeBase64('QVtocmVmXj0iL2ZyYW1ld29yay9yZXNvdXJjZXMvZm9ybXMvYWRzLmFzcHgiXQ==')],
  latvian: [
    decodeBase64(
      'YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiAxMjBweDsgaGVpZ2h0OiA0M' +
        'HB4OyBvdmVyZmxvdzogaGlkZGVuOyBwb3NpdGlvbjogcmVsYXRpdmU7Il0=',
    ),
    decodeBase64(
      'YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiA4OHB4OyBoZWlnaHQ6IDMxc' +
        'Hg7IG92ZXJmbG93OiBoaWRkZW47IHBvc2l0aW9uOiByZWxhdGl2ZTsiXQ==',
    ),
  ],
  listKr: [
    decodeBase64('YVtocmVmKj0iLy9hZC5wbGFuYnBsdXMuY28ua3IvIl0='),
    decodeBase64('I2xpdmVyZUFkV3JhcHBlcg=='),
    decodeBase64('YVtocmVmKj0iLy9hZHYuaW1hZHJlcC5jby5rci8iXQ=='),
    decodeBase64('aW5zLmZhc3R2aWV3LWFk'),
    '.revenue_unit_item.dable',
  ],
  listeAr: [
    decodeBase64('LmdlbWluaUxCMUFk'),
    '.right-and-left-sponsers',
    decodeBase64('YVtocmVmKj0iLmFmbGFtLmluZm8iXQ=='),
    decodeBase64('YVtocmVmKj0iYm9vcmFxLm9yZyJd'),
    decodeBase64('YVtocmVmKj0iZHViaXp6bGUuY29tL2FyLz91dG1fc291cmNlPSJd'),
  ],
  listeFr: [
    decodeBase64('YVtocmVmXj0iaHR0cDovL3Byb21vLnZhZG9yLmNvbS8iXQ=='),
    decodeBase64('I2FkY29udGFpbmVyX3JlY2hlcmNoZQ=='),
    decodeBase64('YVtocmVmKj0id2Vib3JhbWEuZnIvZmNnaS1iaW4vIl0='),
    '.site-pub-interstitiel',
    'div[id^="crt-"][data-criteo-id]',
  ],
  officialPolish: [
    '#ceneo-placeholder-ceneo-12',
    decodeBase64('W2hyZWZePSJodHRwczovL2FmZi5zZW5kaHViLnBsLyJd'),
    decodeBase64('YVtocmVmXj0iaHR0cDovL2Fkdm1hbmFnZXIudGVjaGZ1bi5wbC9yZWRpcmVjdC8iXQ=='),
    decodeBase64('YVtocmVmXj0iaHR0cDovL3d3dy50cml6ZXIucGwvP3V0bV9zb3VyY2UiXQ=='),
    decodeBase64('ZGl2I3NrYXBpZWNfYWQ='),
  ],
  ro: [
    decodeBase64('YVtocmVmXj0iLy9hZmZ0cmsuYWx0ZXgucm8vQ291bnRlci9DbGljayJd'),
    'a[href^="/magazin/"]',
    decodeBase64('YVtocmVmXj0iaHR0cHM6Ly9ibGFja2ZyaWRheXNhbGVzLnJvL3Ryay9zaG9wLyJd'),
    decodeBase64('YVtocmVmXj0iaHR0cHM6Ly9ldmVudC4ycGVyZm9ybWFudC5jb20vZXZlbnRzL2NsaWNrIl0='),
    decodeBase64('YVtocmVmXj0iaHR0cHM6Ly9sLnByb2ZpdHNoYXJlLnJvLyJd'),
  ],
  ruAd: [
    decodeBase64('YVtocmVmKj0iLy9mZWJyYXJlLnJ1LyJd'),
    decodeBase64('YVtocmVmKj0iLy91dGltZy5ydS8iXQ=='),
    decodeBase64('YVtocmVmKj0iOi8vY2hpa2lkaWtpLnJ1Il0='),
    '#pgeldiz',
    '.yandex-rtb-block',
  ],
  thaiAds: [
    'a[href*=macau-uta-popup]',
    decodeBase64('I2Fkcy1nb29nbGUtbWlkZGxlX3JlY3RhbmdsZS1ncm91cA=='),
    decodeBase64('LmFkczMwMHM='),
    '.bumq',
    '.img-kosana',
  ],
  webAnnoyancesUltralist: [
    '#mod-social-share-2',
    '#social-tools',
    decodeBase64('LmN0cGwtZnVsbGJhbm5lcg=='),
    '.zergnet-recommend',
    '.yt.btn-link.btn-md.btn',
  ],
}

type Options = {
  debug?: boolean
}

/**
 * The order of the returned array means nothing (it's always sorted alphabetically).
 *
 * Notice that the source is slightly unstable.
 * Safari provides a 2-taps way to disable all content blockers on a page temporarily.
 * Also content blockers can be disabled permanently for a domain, but it requires 4 taps.
 * So empty array shouldn't be treated as "no blockers", it should be treated as "no signal".
 * If you are a website owner, don't make your visitors want to disable content blockers.
 */
export default async function getDomBlockers({ debug }: Options = {}): Promise<string[] | undefined> {
  if (!isApplicable()) {
    return undefined
  }

  const filterNames = Object.keys(filters) as Array<keyof typeof filters>
  const allSelectors = ([] as string[]).concat(...filterNames.map((filterName) => filters[filterName]))
  const blockedSelectors = await getBlockedSelectors(allSelectors)

  if (debug) {
    printDebug(blockedSelectors)
  }

  const activeBlockers = filterNames.filter((filterName) => {
    const selectors = filters[filterName]
    const blockedCount = countTruthy(selectors.map((selector) => blockedSelectors[selector]))
    return blockedCount > selectors.length * 0.6
  })
  activeBlockers.sort()

  return activeBlockers
}

export function isApplicable(): boolean {
  // Safari (desktop and mobile) and all Android browsers keep content blockers in both regular and private mode
  return isWebKit() || isAndroid()
}

export async function getBlockedSelectors<T extends string>(selectors: readonly T[]): Promise<{ [K in T]?: true }> {
  const d = document
  const root = d.createElement('div')
  const elements = new Array<HTMLElement>(selectors.length)
  const blockedSelectors: { [K in T]?: true } = {} // Set() isn't used just in case somebody need older browser support

  forceShow(root)

  // First create all elements that can be blocked. If the DOM steps below are done in a single cycle,
  // browser will alternate tree modification and layout reading, that is very slow.
  for (let i = 0; i < selectors.length; ++i) {
    const element = selectorToElement(selectors[i])
    const holder = d.createElement('div') // Protects from unwanted effects of `+` and `~` selectors of filters
    forceShow(holder)
    holder.appendChild(element)
    root.appendChild(holder)
    elements[i] = element
  }

  // document.body can be null while the page is loading
  while (!d.body) {
    await wait(50)
  }
  d.body.appendChild(root)

  try {
    // Then check which of the elements are blocked
    for (let i = 0; i < selectors.length; ++i) {
      if (!elements[i].offsetParent) {
        blockedSelectors[selectors[i]] = true
      }
    }
  } finally {
    // Then remove the elements
    root.parentNode?.removeChild(root)
  }

  return blockedSelectors
}

function forceShow(element: HTMLElement) {
  element.style.setProperty('display', 'block', 'important')
}

function printDebug(blockedSelectors: { [K in string]?: true }) {
  let message = 'DOM blockers debug:\n```'
  for (const filterName of Object.keys(filters) as Array<keyof typeof filters>) {
    message += `\n${filterName}:`
    for (const selector of filters[filterName]) {
      message += `\n  ${selector} ${blockedSelectors[selector] ? '🚫' : '➡️'}`
    }
  }
  // console.log is ok here because it's under a debug clause
  // eslint-disable-next-line no-console
  console.log(`${message}\n\`\`\``)
}
