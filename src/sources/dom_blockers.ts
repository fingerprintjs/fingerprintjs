import { isAndroid, isWebKit } from '../utils/browser'
import { selectorToElement } from '../utils/dom'
import { countTruthy } from '../utils/data'
import { wait } from '../utils/async'

type Filters = Record<string, string[]>

/**
 * Only single element selector are supported (no operators like space, +, >, etc).
 * `embed` and `position: fixed;` will be considered as blocked anyway because it always has no offsetParent.
 * Avoid `iframe` and anything with `[src=]` because they produce excess HTTP requests.
 *
 * The "inappropriate" selectors are obfuscated. See https://github.com/fingerprintjs/fingerprintjs/issues/734.
 * A function is used instead of a plain object to help tree-shaking.
 *
 * The function code is generated automatically. See docs/content_blockers.md to learn how to make the list.
 */
export function getFilters(): Filters {
  const fromB64 = atob // Just for better minification

  return {
    abpIndo: [
      '#Iklan-Melayang',
      '#Kolom-Iklan-728',
      '#SidebarIklan-wrapper',
      '[title="ALIENBOLA" i]',
      fromB64('I0JveC1CYW5uZXItYWRz'),
    ],
    abpvn: ['.quangcao', '#mobileCatfish', fromB64('LmNsb3NlLWFkcw=='), '[id^="bn_bottom_fixed_"]', '#pmadv'],
    adBlockFinland: [
      '.mainostila',
      fromB64('LnNwb25zb3JpdA=='),
      '.ylamainos',
      fromB64('YVtocmVmKj0iL2NsaWNrdGhyZ2guYXNwPyJd'),
      fromB64('YVtocmVmXj0iaHR0cHM6Ly9hcHAucmVhZHBlYWsuY29tL2FkcyJd'),
    ],
    adBlockPersian: [
      '#navbar_notice_50',
      '.kadr',
      'TABLE[width="140px"]',
      '#divAgahi',
      fromB64('YVtocmVmXj0iaHR0cDovL2cxLnYuZndtcm0ubmV0L2FkLyJd'),
    ],
    adBlockWarningRemoval: [
      '#adblock-honeypot',
      '.adblocker-root',
      '.wp_adblock_detect',
      fromB64('LmhlYWRlci1ibG9ja2VkLWFk'),
      fromB64('I2FkX2Jsb2NrZXI='),
    ],
    adGuardAnnoyances: [
      '.hs-sosyal',
      '#cookieconsentdiv',
      'div[class^="app_gdpr"]',
      '.as-oil',
      '[data-cypress="soft-push-notification-modal"]',
    ],
    adGuardBase: [
      '.BetterJsPopOverlay',
      fromB64('I2FkXzMwMFgyNTA='),
      fromB64('I2Jhbm5lcmZsb2F0MjI='),
      fromB64('I2NhbXBhaWduLWJhbm5lcg=='),
      fromB64('I0FkLUNvbnRlbnQ='),
    ],
    adGuardChinese: [
      fromB64('LlppX2FkX2FfSA=='),
      fromB64('YVtocmVmKj0iLmh0aGJldDM0LmNvbSJd'),
      '#widget-quan',
      fromB64('YVtocmVmKj0iLzg0OTkyMDIwLnh5eiJd'),
      fromB64('YVtocmVmKj0iLjE5NTZobC5jb20vIl0='),
    ],
    adGuardFrench: [
      '#pavePub',
      fromB64('LmFkLWRlc2t0b3AtcmVjdGFuZ2xl'),
      '.mobile_adhesion',
      '.widgetadv',
      fromB64('LmFkc19iYW4='),
    ],
    adGuardGerman: ['aside[data-portal-id="leaderboard"]'],
    adGuardJapanese: [
      '#kauli_yad_1',
      fromB64('YVtocmVmXj0iaHR0cDovL2FkMi50cmFmZmljZ2F0ZS5uZXQvIl0='),
      fromB64('Ll9wb3BJbl9pbmZpbml0ZV9hZA=='),
      fromB64('LmFkZ29vZ2xl'),
      fromB64('Ll9faXNib29zdFJldHVybkFk'),
    ],
    adGuardMobile: [
      fromB64('YW1wLWF1dG8tYWRz'),
      fromB64('LmFtcF9hZA=='),
      'amp-embed[type="24smi"]',
      '#mgid_iframe1',
      fromB64('I2FkX2ludmlld19hcmVh'),
    ],
    adGuardRussian: [
      fromB64('YVtocmVmXj0iaHR0cHM6Ly9hZC5sZXRtZWFkcy5jb20vIl0='),
      fromB64('LnJlY2xhbWE='),
      'div[id^="smi2adblock"]',
      fromB64('ZGl2W2lkXj0iQWRGb3hfYmFubmVyXyJd'),
      '#psyduckpockeball',
    ],
    adGuardSocial: [
      fromB64('YVtocmVmXj0iLy93d3cuc3R1bWJsZXVwb24uY29tL3N1Ym1pdD91cmw9Il0='),
      fromB64('YVtocmVmXj0iLy90ZWxlZ3JhbS5tZS9zaGFyZS91cmw/Il0='),
      '.etsy-tweet',
      '#inlineShare',
      '.popup-social',
    ],
    adGuardSpanishPortuguese: ['#barraPublicidade', '#Publicidade', '#publiEspecial', '#queTooltip', '.cnt-publi'],
    adGuardTrackingProtection: [
      '#qoo-counter',
      fromB64('YVtocmVmXj0iaHR0cDovL2NsaWNrLmhvdGxvZy5ydS8iXQ=='),
      fromB64('YVtocmVmXj0iaHR0cDovL2hpdGNvdW50ZXIucnUvdG9wL3N0YXQucGhwIl0='),
      fromB64('YVtocmVmXj0iaHR0cDovL3RvcC5tYWlsLnJ1L2p1bXAiXQ=='),
      '#top100counter',
    ],
    adGuardTurkish: [
      '#backkapat',
      fromB64('I3Jla2xhbWk='),
      fromB64('YVtocmVmXj0iaHR0cDovL2Fkc2Vydi5vbnRlay5jb20udHIvIl0='),
      fromB64('YVtocmVmXj0iaHR0cDovL2l6bGVuemkuY29tL2NhbXBhaWduLyJd'),
      fromB64('YVtocmVmXj0iaHR0cDovL3d3dy5pbnN0YWxsYWRzLm5ldC8iXQ=='),
    ],
    bulgarian: [fromB64('dGQjZnJlZW5ldF90YWJsZV9hZHM='), '#ea_intext_div', '.lapni-pop-over', '#xenium_hot_offers'],
    easyList: [
      '.yb-floorad',
      fromB64('LndpZGdldF9wb19hZHNfd2lkZ2V0'),
      fromB64('LnRyYWZmaWNqdW5reS1hZA=='),
      '.textad_headline',
      fromB64('LnNwb25zb3JlZC10ZXh0LWxpbmtz'),
    ],
    easyListChina: [
      fromB64('LmFwcGd1aWRlLXdyYXBbb25jbGljayo9ImJjZWJvcy5jb20iXQ=='),
      fromB64('LmZyb250cGFnZUFkdk0='),
      '#taotaole',
      '#aafoot.top_box',
      '.cfa_popup',
    ],
    easyListCookie: [
      '.ezmob-footer',
      '.cc-CookieWarning',
      '[data-cookie-number]',
      fromB64('LmF3LWNvb2tpZS1iYW5uZXI='),
      '.sygnal24-gdpr-modal-wrap',
    ],
    easyListCzechSlovak: [
      '#onlajny-stickers',
      fromB64('I3Jla2xhbW5pLWJveA=='),
      fromB64('LnJla2xhbWEtbWVnYWJvYXJk'),
      '.sklik',
      fromB64('W2lkXj0ic2tsaWtSZWtsYW1hIl0='),
    ],
    easyListDutch: [
      fromB64('I2FkdmVydGVudGll'),
      fromB64('I3ZpcEFkbWFya3RCYW5uZXJCbG9jaw=='),
      '.adstekst',
      fromB64('YVtocmVmXj0iaHR0cHM6Ly94bHR1YmUubmwvY2xpY2svIl0='),
      '#semilo-lrectangle',
    ],
    easyListGermany: [
      '#SSpotIMPopSlider',
      fromB64('LnNwb25zb3JsaW5rZ3J1ZW4='),
      fromB64('I3dlcmJ1bmdza3k='),
      fromB64('I3Jla2xhbWUtcmVjaHRzLW1pdHRl'),
      fromB64('YVtocmVmXj0iaHR0cHM6Ly9iZDc0Mi5jb20vIl0='),
    ],
    easyListItaly: [
      fromB64('LmJveF9hZHZfYW5udW5jaQ=='),
      '.sb-box-pubbliredazionale',
      fromB64('YVtocmVmXj0iaHR0cDovL2FmZmlsaWF6aW9uaWFkcy5zbmFpLml0LyJd'),
      fromB64('YVtocmVmXj0iaHR0cHM6Ly9hZHNlcnZlci5odG1sLml0LyJd'),
      fromB64('YVtocmVmXj0iaHR0cHM6Ly9hZmZpbGlhemlvbmlhZHMuc25haS5pdC8iXQ=='),
    ],
    easyListLithuania: [
      fromB64('LnJla2xhbW9zX3RhcnBhcw=='),
      fromB64('LnJla2xhbW9zX251b3JvZG9z'),
      fromB64('aW1nW2FsdD0iUmVrbGFtaW5pcyBza3lkZWxpcyJd'),
      fromB64('aW1nW2FsdD0iRGVkaWt1b3RpLmx0IHNlcnZlcmlhaSJd'),
      fromB64('aW1nW2FsdD0iSG9zdGluZ2FzIFNlcnZlcmlhaS5sdCJd'),
    ],
    estonian: [fromB64('QVtocmVmKj0iaHR0cDovL3BheTRyZXN1bHRzMjQuZXUiXQ==')],
    fanboyAnnoyances: ['#ac-lre-player', '.navigate-to-top', '#subscribe_popup', '.newsletter_holder', '#back-top'],
    fanboyAntiFacebook: ['.util-bar-module-firefly-visible'],
    fanboyEnhancedTrackers: [
      '.open.pushModal',
      '#issuem-leaky-paywall-articles-zero-remaining-nag',
      '#sovrn_container',
      'div[class$="-hide"][zoompage-fontsize][style="display: block;"]',
      '.BlockNag__Card',
    ],
    fanboySocial: ['#FollowUs', '#meteored_share', '#social_follow', '.article-sharer', '.community__social-desc'],
    frellwitSwedish: [
      fromB64('YVtocmVmKj0iY2FzaW5vcHJvLnNlIl1bdGFyZ2V0PSJfYmxhbmsiXQ=='),
      fromB64('YVtocmVmKj0iZG9rdG9yLXNlLm9uZWxpbmsubWUiXQ=='),
      'article.category-samarbete',
      fromB64('ZGl2LmhvbGlkQWRz'),
      'ul.adsmodern',
    ],
    greekAdBlock: [
      fromB64('QVtocmVmKj0iYWRtYW4ub3RlbmV0LmdyL2NsaWNrPyJd'),
      fromB64('QVtocmVmKj0iaHR0cDovL2F4aWFiYW5uZXJzLmV4b2R1cy5nci8iXQ=='),
      fromB64('QVtocmVmKj0iaHR0cDovL2ludGVyYWN0aXZlLmZvcnRobmV0LmdyL2NsaWNrPyJd'),
      'DIV.agores300',
      'TABLE.advright',
    ],
    hungarian: [
      '#cemp_doboz',
      '.optimonk-iframe-container',
      fromB64('LmFkX19tYWlu'),
      fromB64('W2NsYXNzKj0iR29vZ2xlQWRzIl0='),
      '#hirdetesek_box',
    ],
    iDontCareAboutCookies: [
      '.alert-info[data-block-track*="CookieNotice"]',
      '.ModuleTemplateCookieIndicator',
      '.o--cookies--container',
      '#cookies-policy-sticky',
      '#stickyCookieBar',
    ],
    icelandicAbp: [fromB64('QVtocmVmXj0iL2ZyYW1ld29yay9yZXNvdXJjZXMvZm9ybXMvYWRzLmFzcHgiXQ==')],
    latvian: [
      fromB64(
        'YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiAxMjBweDsgaGVpZ2h0O' +
          'iA0MHB4OyBvdmVyZmxvdzogaGlkZGVuOyBwb3NpdGlvbjogcmVsYXRpdmU7Il0=',
      ),
      fromB64(
        'YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiA4OHB4OyBoZWlnaHQ6I' +
          'DMxcHg7IG92ZXJmbG93OiBoaWRkZW47IHBvc2l0aW9uOiByZWxhdGl2ZTsiXQ==',
      ),
    ],
    listKr: [
      fromB64('YVtocmVmKj0iLy9hZC5wbGFuYnBsdXMuY28ua3IvIl0='),
      fromB64('I2xpdmVyZUFkV3JhcHBlcg=='),
      fromB64('YVtocmVmKj0iLy9hZHYuaW1hZHJlcC5jby5rci8iXQ=='),
      fromB64('aW5zLmZhc3R2aWV3LWFk'),
      '.revenue_unit_item.dable',
    ],
    listeAr: [
      fromB64('LmdlbWluaUxCMUFk'),
      '.right-and-left-sponsers',
      fromB64('YVtocmVmKj0iLmFmbGFtLmluZm8iXQ=='),
      fromB64('YVtocmVmKj0iYm9vcmFxLm9yZyJd'),
      fromB64('YVtocmVmKj0iZHViaXp6bGUuY29tL2FyLz91dG1fc291cmNlPSJd'),
    ],
    listeFr: [
      fromB64('YVtocmVmXj0iaHR0cDovL3Byb21vLnZhZG9yLmNvbS8iXQ=='),
      fromB64('I2FkY29udGFpbmVyX3JlY2hlcmNoZQ=='),
      fromB64('YVtocmVmKj0id2Vib3JhbWEuZnIvZmNnaS1iaW4vIl0='),
      '.site-pub-interstitiel',
      'div[id^="crt-"][data-criteo-id]',
    ],
    officialPolish: [
      '#ceneo-placeholder-ceneo-12',
      fromB64('W2hyZWZePSJodHRwczovL2FmZi5zZW5kaHViLnBsLyJd'),
      fromB64('YVtocmVmXj0iaHR0cDovL2Fkdm1hbmFnZXIudGVjaGZ1bi5wbC9yZWRpcmVjdC8iXQ=='),
      fromB64('YVtocmVmXj0iaHR0cDovL3d3dy50cml6ZXIucGwvP3V0bV9zb3VyY2UiXQ=='),
      fromB64('ZGl2I3NrYXBpZWNfYWQ='),
    ],
    ro: [
      fromB64('YVtocmVmXj0iLy9hZmZ0cmsuYWx0ZXgucm8vQ291bnRlci9DbGljayJd'),
      fromB64('YVtocmVmXj0iaHR0cHM6Ly9ibGFja2ZyaWRheXNhbGVzLnJvL3Ryay9zaG9wLyJd'),
      fromB64('YVtocmVmXj0iaHR0cHM6Ly9ldmVudC4ycGVyZm9ybWFudC5jb20vZXZlbnRzL2NsaWNrIl0='),
      fromB64('YVtocmVmXj0iaHR0cHM6Ly9sLnByb2ZpdHNoYXJlLnJvLyJd'),
      'a[href^="/url/"]',
    ],
    ruAd: [
      fromB64('YVtocmVmKj0iLy9mZWJyYXJlLnJ1LyJd'),
      fromB64('YVtocmVmKj0iLy91dGltZy5ydS8iXQ=='),
      fromB64('YVtocmVmKj0iOi8vY2hpa2lkaWtpLnJ1Il0='),
      '#pgeldiz',
      '.yandex-rtb-block',
    ],
    thaiAds: [
      'a[href*=macau-uta-popup]',
      fromB64('I2Fkcy1nb29nbGUtbWlkZGxlX3JlY3RhbmdsZS1ncm91cA=='),
      fromB64('LmFkczMwMHM='),
      '.bumq',
      '.img-kosana',
    ],
    webAnnoyancesUltralist: [
      '#mod-social-share-2',
      '#social-tools',
      fromB64('LmN0cGwtZnVsbGJhbm5lcg=='),
      '.zergnet-recommend',
      '.yt.btn-link.btn-md.btn',
    ],
  }
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

  const filters = getFilters()
  const filterNames = Object.keys(filters) as Array<keyof typeof filters>
  const allSelectors = ([] as string[]).concat(...filterNames.map((filterName) => filters[filterName]))
  const blockedSelectors = await getBlockedSelectors(allSelectors)

  if (debug) {
    printDebug(filters, blockedSelectors)
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
    if (element.tagName === 'DIALOG') {
      ;(element as HTMLDialogElement).show()
    }
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
  element.style.setProperty('visibility', 'hidden', 'important')
  element.style.setProperty('display', 'block', 'important')
}

function printDebug(filters: Filters, blockedSelectors: { [K in string]?: true }) {
  let message = 'DOM blockers debug:\n```'
  for (const filterName of Object.keys(filters) as Array<keyof typeof filters>) {
    message += `\n${filterName}:`
    for (const selector of filters[filterName]) {
      message += `\n  ${blockedSelectors[selector] ? '🚫' : '➡️'} ${selector}`
    }
  }
  // console.log is ok here because it's under a debug clause
  // eslint-disable-next-line no-console
  console.log(`${message}\n\`\`\``)
}
