import { isAndroid, isWebKit } from '../utils/browser'
import { selectorToElement } from '../utils/dom'
import { countTruthy } from '../utils/data'
import { wait } from '../utils/async'

/**
 * Only single element selector are supported (no operators like space, +, >, etc).
 * `embed` and `position: fixed;` will be considered as blocked anyway because it always has no offsetParent.
 * Avoid `iframe` and anything with `[src=]` because they produce excess HTTP requests.
 *
 * See docs/content_blockers.md to learn how to make the list
 */
export const filters = {
  abpIndo: [
    '#Iklan-Melayang',
    '#Kolom-Iklan-728',
    '#SidebarIklan-wrapper',
    'a[title="7naga poker" i]',
    'img[title="ALIENBOLA" i]',
  ],
  abpvn: [
    '#quangcaomb',
    '.i-said-no-thing-can-stop-me-warning.dark',
    '.quangcao',
    '[href^="https://r88.vn/"]',
    '[href^="https://zbet.vn/"]',
  ],
  adBlockFinland: [
    '.mainostila',
    '.sponsorit',
    '.ylamainos',
    'a[href*="/clickthrgh.asp?"]',
    'a[href^="https://app.readpeak.com/ads"]',
  ],
  adBlockPersian: [
    '.widget_arvins_ad_randomizer',
    'a[href^="https://iqoption.com/lp/mobile-partner/?aff="]',
    'a[href*="fastclick.net/ad/"]',
    'TABLE[width="140px"]',
    '.facebook_shows_ad_cale',
  ],
  adBlockWarningRemoval: [
    '#adblock_message',
    '.adblockInfo',
    '.deadblocker-header-bar',
    '.no-ad-reminder',
    '#AdBlockDialog',
  ],
  adGuardAnnoyances: ['amp-embed[type="zen"]', '.hs-sosyal', '#cookieconsentdiv', 'div[class^="app_gdpr"]', '.as-oil'],
  adGuardBase: ['.ad-disclaimer-container', '#content_ad_container', '#ad_wp_base', '#adxtop', '#bannerfloat22'],
  adGuardChinese: [
    'a[href*=".123ch.cn"]',
    'a[href*=".acuxrecv.cn"]',
    'a[href*=".bayiyy.com/download."]',
    'a[href*=".quankan.tv"]',
    '#j-new-ad',
  ],
  adGuardFrench: [
    '#div_banniere_pub',
    '#sp-entete-pour-la-pub',
    'a[href*="fducks.com/"]',
    'a[href^="http://promo.vador.com/"]',
    'a[href^="https://syndication.exdynsrv.com/"]',
  ],
  adGuardGerman: [
    '.banneritemwerbung_head_1',
    '.boxstartwerbung',
    '.werbung3',
    'a[href^="http://www.firstload.de/index.php?set_lang=de&log="]',
    'a[href^="http://www.sendung-now.de/tick/click.php?id="]',
  ],
  adGuardJapanese: [
    '.ad-text-blockA01',
    '._popIn_infinite_video',
    '[class^=blogroll_wrapper]',
    'a[href^="http://ad2.trafficgate.net/"]',
    'a[href^="http://www.rssad.jp/"]',
  ],
  adGuardMobile: ['amp-auto-ads', '#mgid_iframe', '.amp_ad', 'amp-sticky-ad', '.plugin-blogroll'],
  adGuardRussian: [
    'a[href^="https://ya-distrib.ru/r/"]',
    'a[href*=".twkv.ru"]',
    'div[data-adv-type="dfp"]',
    '.b-journalpromo-container',
    'div[id^="AdFox_banner_"]',
  ],
  adGuardSocial: [
    'a[href^="//www.stumbleupon.com/submit?url="]',
    'a[href^="//telegram.me/share/url?"]',
    '#___plusone_0',
    '#inlineShare',
    '.popup-social',
  ],
  adGuardSpanishPortuguese: [
    '.esp_publicidad',
    '#Publicidade',
    '#publiEspecial',
    '#queTooltip',
    '[href^="http://ads.glispa.com/"]',
  ],
  adGuardTrackingProtection: [
    'amp-embed[type="taboola"]',
    '#qoo-counter',
    'a[href^="http://click.hotlog.ru/"]',
    'a[href^="http://hitcounter.ru/top/stat.php"]',
    'a[href^="http://top.mail.ru/jump"]',
  ],
  adGuardTurkish: [
    '#backkapat',
    '#reklam',
    'a[href^="http://adserv.ontek.com.tr/"]',
    'a[href^="http://izlenzi.com/campaign/"]',
    'a[href^="http://www.installads.net/"]',
  ],
  bulgarian: ['#adbody', '#newAd', '#ea_intext_div', '.lapni-pop-over', '#xenium_hot_offers'],
  easyList: [
    '[lazy-ad="leftthin_banner"]',
    '.smart_ads_bom_title',
    '.slide-advert_float',
    '.six-ads-wrapper',
    '.showcaseAd',
  ],
  easyListChina: [
    '#fuo_top_float',
    '.kf_qycn_com_cckf_welcomebox',
    'a[href*=".caohang.com.cn/"]',
    'a[href*=".yuanmengbi.com/"]',
    '.layui-row[style="border-radius:10px;background-color:#ff0000;padding:15px;margin:15px;"]',
  ],
  easyListCookie: ['#cookieBgOverlay', '#alerte-cookies', '#cookieLY', '#dlgCookies', '.Section-Cookie'],
  easyListCzechSlovak: ['#onlajny-stickers', '#reklamni-box', '.reklama-megaboard', '.sklik', '[id^="sklikReklama"]'],
  easyListDutch: [
    '#advertentie',
    '#vipAdmarktBannerBlock',
    '.adstekst',
    'a[href^="http://adserver.webads.nl/adclick/"]',
    'a[href^="http://www.site-id.nl/servlet/___?"]',
  ],
  easyListGermany: [
    '.werb_textlink',
    '#ad-qm-sidebar-oben',
    '.adguru-content-html',
    '.nfy-sebo-ad',
    '.textlinkwerbung',
  ],
  easyListItaly: [
    '.box_adv_annunci',
    '.sb-box-pubbliredazionale',
    'a[href^="http://affiliazioniads.snai.it/"]',
    'a[href^="https://adserver.html.it/"]',
    'a[href^="https://affiliazioniads.snai.it/"]',
  ],
  easyListLithuania: [
    '.reklamos_tarpas',
    'a[href="http://igrovoi-klub.org/fair-land"]',
    'a[href="http://www.moteris.lt/didieji-grozio-pokyciai/"]',
    'img[alt="Dedikuoti.lt serveriai"]',
    'img[alt="Hostingas Serveriai.lt"]',
  ],
  estonian: [
    '.flex--align-items-center.flex--justify-content-center.flex.section-branding__digipakett-contents',
    'A[href*="http://pay4results24.eu"]',
  ],
  fanboyAnnoyances: [
    '#feedback-tab',
    '#ruby-back-top',
    '.feedburnerFeedBlock',
    '.widget-feedburner-counter',
    '[title="Subscribe to our blog"]',
  ],
  fanboyAntiFacebook: ['.util-bar-module-firefly-visible'],
  fanboyEnhancedTrackers: [
    '.open.pushModal',
    '#issuem-leaky-paywall-articles-zero-remaining-nag',
    'div[style*="box-shadow: rgb(136, 136, 136) 0px 0px 12px; color: "]',
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
    'a[href*="casinopro.se"][target="_blank"]',
    'a[href*="doktor-se.onelink.me"]',
    'article.category-samarbete',
    'img[alt="Leovegas"]',
    'ul.adsmodern',
  ],
  greekAdBlock: [
    'A[href*="adman.otenet.gr/click?"]',
    'A[href*="http://axiabanners.exodus.gr/"]',
    'A[href*="http://interactive.forthnet.gr/click?"]',
    'DIV.agores300',
    'TABLE.advright',
  ],
  hungarian: [
    'A[href*="ad.eval.hu"]',
    'A[href*="ad.netmedia.hu"]',
    'A[href*="daserver.ultraweb.hu"]',
    '#cemp_doboz',
    '.optimonk-iframe-container',
  ],
  iDontCareAboutCookies: [
    '.alert-info[data-block-track*="CookieNotice"]',
    '.ModuleTemplateCookieIndicator',
    '.o--cookies--container',
    '.cookie-msg-info-container',
    '#cookies-policy-sticky',
  ],
  icelandicAbp: ['A[href^="/framework/resources/forms/ads.aspx"]'],
  latvian: [
    'a[href="http://www.salidzini.lv/"][style="display: block; width: 120px; height: 40px; overflow: hidden; position: relative;"]',
    'a[href="http://www.salidzini.lv/"][style="display: block; width: 88px; height: 31px; overflow: hidden; position: relative;"]',
  ],
  listKr: [
    'a[href*="//kingtoon.slnk.kr"]',
    'a[href*="//playdsb.com/kr"]',
    'a[href*="//simba-kor.com"]',
    'div[data-widget_id="ml6EJ074"]',
    'ins.daum_ddn_area',
  ],
  listeAr: [
    '.geminiLB1Ad',
    '.right-and-left-sponsers',
    'a[href*=".aflam.info"]',
    'a[href*="booraq.org"]',
    'a[href*="dubizzle.com/ar/?utm_source="]',
  ],
  listeFr: [
    'a[href^="http://look.djfiln.com/"]',
    '#adcontainer_recherche',
    'a[href*="weborama.fr/fcgi-bin/"]',
    'a[href^="https://secure.securitetotale.fr/"]',
    'div[id^="crt-"][data-criteo-id]',
  ],
  officialPolish: [
    '#ceneo-placeholder-ceneo-12',
    '[href^="https://aff.sendhub.pl/"]',
    'a[href^="http://advmanager.techfun.pl/redirect/"]',
    'a[href^="http://www.trizer.pl/?utm_source"]',
    'div#skapiec_ad',
  ],
  ro: [
    'a[href^="//afftrk.altex.ro/Counter/Click"',
    'a[href^="/magazin/"',
    'a[href^="https://blackfridaysales.ro/trk/shop/"',
    'a[href^="https://event.2performant.com/events/click"',
    'a[href^="https://l.profitshare.ro/"]',
  ],
  ruAd: [
    'a[href*="//febrare.ru/"]',
    'a[href*="//utimg.ru/"]',
    'a[href*="://chikidiki.ru"]',
    '#pgeldiz',
    '.yandex-rtb-block',
  ],
  thaiAds: ['a[href*=macau-uta-popup]', '#ads-google-middle_rectangle-group', '.ads300s', '.bumq', '.img-kosana'],
  webAnnoyancesUltralist: [
    '#mod-social-share-2',
    '#social-tools',
    '.ctpl-fullbanner',
    '.j-share-bar-left',
    '.yt.btn-link.btn-md.btn',
  ],
}

/** Just a syntax sugar */
const filterNames = Object.keys(filters) as Array<keyof typeof filters>

interface Options {
  debug?: boolean
}

/**
 * The returned array order means nothing (it's always sorted alphabetically).
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

  const allSelectors = ([] as string[]).concat(...filterNames.map((filterName) => filters[filterName]))
  const blockedSelectors = await getBlockedSelectors(allSelectors)

  if (debug) {
    printDebug(blockedSelectors)
  }

  const activeBlockers = filterNames.filter((filterName) => {
    const selectors = filters[filterName]
    const blockedCount = countTruthy(selectors.map((selector) => blockedSelectors[selector]))
    return blockedCount > selectors.length * 0.5
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
  const elements: HTMLElement[] = []
  const blockedSelectors: { [K in T]?: true } = {} // Set() isn't used just in case somebody need older browser support

  forceShow(root)

  // First create all elements that can be blocked. If the DOM steps below are done in a single cycle,
  // browser will alternate tree modification and layout reading, that is very slow.
  for (const selector of selectors) {
    const element = selectorToElement(selector)
    const holder = d.createElement('div') // Protects from unwanted effects of `+` and `~` selectors of filters
    forceShow(holder)
    holder.appendChild(element)
    root.appendChild(holder)
    elements.push(element)
  }

  // document.body can be null while the page is loading
  while (!d.body) {
    await wait(100)
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
  for (const filterName of filterNames) {
    message += `\n${filterName}:`
    for (const selector of filters[filterName]) {
      message += `\n  ${selector} ${blockedSelectors[selector] ? '🚫' : '➡️'}`
    }
  }
  // console.log is ok here because it's under a debug clause
  // eslint-disable-next-line no-console
  console.log(`${message}\n\`\`\``)
}
