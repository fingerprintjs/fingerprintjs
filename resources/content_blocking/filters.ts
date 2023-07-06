export interface Filter {
  title: string
  note?: string
  file: string
}

export type FilterList = Record<string, Filter>

/**
 * A list of ad blocking filters to work with
 */
const filters: FilterList = {
  /*
   * AdGuard
   * https://kb.adguard.com/en/general/adguard-ad-filters#adguard-filters
   */
  adGuardBase: {
    title: 'AdGuard Base',
    file: 'https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_2_Base/filter.txt',
  },
  adGuardMobile: {
    title: 'AdGuard Mobile Ads',
    file: 'https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_11_Mobile/filter.txt',
  },
  adGuardTrackingProtection: {
    title: 'AdGuard Tracking Protection',
    file: 'https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_3_Spyware/filter.txt',
  },
  adGuardSocial: {
    title: 'AdGuard Social Media',
    file: 'https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_4_Social/filter.txt',
  },
  adGuardAnnoyances: {
    title: 'AdGuard Annoyances',
    file: 'https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_14_Annoyances/filter.txt',
  },
  adGuardRussian: {
    title: 'AdGuard Russian',
    file: 'https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_1_Russian/filter.txt',
  },
  adGuardChinese: {
    title: 'AdGuard Chinese',
    file: 'https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_224_Chinese/filter.txt',
  },
  adGuardGerman: {
    title: 'AdGuard German',
    file: 'https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_6_German/filter.txt',
  },
  // AdGuard Dutch isn't included because it has the same selectors as EasyList Dutch
  adGuardFrench: {
    title: 'AdGuard French',
    file: 'https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_16_French/filter.txt',
  },
  adGuardJapanese: {
    title: 'AdGuard Japanese',
    file: 'https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_7_Japanese/filter.txt',
  },
  adGuardSpanishPortuguese: {
    title: 'AdGuard Spanish/Portuguese',
    file: 'https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_9_Spanish/filter.txt',
  },
  adGuardTurkish: {
    title: 'AdGuard Turkish',
    file: 'https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_13_Turkish/filter.txt',
  },

  /*
   * EasyList
   * https://easylist.to
   */
  easyList: {
    title: 'EasyList',
    file: 'https://easylist.to/easylist/easylist.txt',
  },
  easyPrivacy: {
    title: 'EasyPrivacy',
    note: 'Can have no blocked selectors',
    file: 'https://easylist.to/easylist/easyprivacy.txt',
  },
  easyListCookie: {
    title: 'EasyList Cookie List (a.k.a. Fanboy Anti-Cookie)',
    file: 'https://secure.fanboy.co.nz/fanboy-cookiemonster.txt',
  },
  easyListGermany: {
    title: 'EasyList Germany',
    file: 'https://easylist.to/easylistgermany/easylistgermany.txt',
  },
  easyListItaly: {
    title: 'EasyList Italy',
    file: 'https://easylist-downloads.adblockplus.org/easylistitaly.txt',
  },
  easyListDutch: {
    title: 'EasyList Dutch',
    file: 'https://easylist-downloads.adblockplus.org/easylistdutch.txt',
  },
  listeFr: {
    title: 'Liste FR',
    file: 'https://easylist-downloads.adblockplus.org/liste_fr.txt',
  },
  easyListChina: {
    title: 'EasyList China',
    file: 'https://easylist-downloads.adblockplus.org/easylistchina.txt',
  },
  bulgarian: {
    title: 'Bulgarian List',
    file: 'https://stanev.org/abp/adblock_bg.txt',
  },
  abpIndo: {
    title: 'ABPindo',
    file: 'https://raw.githubusercontent.com/heradhis/indonesianadblockrules/master/subscriptions/abpindo.txt',
  },
  listeAr: {
    title: 'Liste AR',
    file: 'https://easylist-downloads.adblockplus.org/Liste_AR.txt',
  },
  easyListCzechSlovak: {
    title: 'EasyList Czech and Slovak',
    file: 'https://raw.githubusercontent.com/tomasko126/easylistczechandslovak/master/filters.txt',
  },
  latvian: {
    title: 'Latvian List',
    file: 'https://notabug.org/latvian-list/adblock-latvian/raw/master/lists/latvian-list.txt',
  },
  easyListHebrew: {
    title: 'EasyList Hebrew',
    note: 'Can have no blocked selectors',
    file: 'https://raw.githubusercontent.com/easylist/EasyListHebrew/master/EasyListHebrew.txt',
  },
  easyListLithuania: {
    title: 'EasyList Lithuania',
    file: 'https://raw.githubusercontent.com/EasyList-Lithuania/easylist_lithuania/master/easylistlithuania.txt',
  },
  adBlockWarningRemoval: {
    title: 'AdBlock Warning Removal List',
    file: 'https://easylist-downloads.adblockplus.org/antiadblockfilters.txt',
  },

  /*
   * Fanboy
   * https://www.fanboy.co.nz
   */
  fanboyEnhancedTrackers: {
    title: 'Fanboy Enhanced Trackers List',
    file: 'https://secure.fanboy.co.nz/enhancedstats.txt',
  },
  fanboyAntiFacebook: {
    title: 'Fanboy Anti-Facebook Filters',
    file: 'https://www.fanboy.co.nz/fanboy-antifacebook.txt',
  },
  fanboyThirdpartyFonts: {
    title: 'Fanboy Thirdparty Fonts Filters',
    note: 'Can have no blocked selectors',
    file: 'https://www.fanboy.co.nz/fanboy-antifonts.txt',
  },
  fanboySocial: {
    title: 'Fanboy Social List',
    file: 'https://easylist.to/easylist/fanboy-social.txt',
  },
  fanboyAnnoyances: {
    title: 'Fanboy Annoyances',
    file: 'https://secure.fanboy.co.nz/fanboy-annoyance.txt',
  },

  /*
   * Other
   */
  peterLowesBlocklist: {
    title: "Peter Lowe's Blocklist",
    note: 'Can have no blocked selectors',
    file: 'https://pgl.yoyo.org/adservers/serverlist.php?hostformat=adblockplus&showintro=0&mimetype=plaintext',
  },
  webAnnoyancesUltralist: {
    title: 'Web Annoyances Ultralist',
    file: 'https://raw.githubusercontent.com/yourduskquibbles/webannoyances/master/ultralist.txt',
  },
  iDontCareAboutCookies: {
    title: "I don't care about cookies",
    file: 'https://www.i-dont-care-about-cookies.eu/abp/',
  },
  ro: {
    title: 'ROLIST2',
    file: 'https://zoso.ro/pages/rolist2.txt',
  },
  ruAd: {
    title: 'RU AdList',
    note: 'Not in the default AdGuard list, add manually',
    file: 'https://easylist-downloads.adblockplus.org/advblock.txt',
  },
  icelandicAbp: {
    title: 'Icelandic ABP List',
    file: 'https://adblock.gardar.net/is.abp.txt',
  },
  greekAdBlock: {
    title: 'Greek AdBlock Filter',
    file: 'https://raw.githubusercontent.com/kargig/greek-adblockplus-filter/master/void-gr-filters.txt',
  },
  thaiAds: {
    title: 'Thai Ads Filters',
    note: 'Renamed to "EasyList Thailand"',
    file: 'https://adblock-thai.github.io/thai-ads-filter/subscription.txt',
  },
  hungarian: {
    title: 'Hungarian filter',
    file: 'https://raw.githubusercontent.com/hufilter/hufilter/master/hufilter.txt',
  },
  abpvn: {
    title: 'ABPVN List (Vietnamese)',
    file: 'https://raw.githubusercontent.com/abpvn/abpvn/master/filter/abpvn.txt',
  },
  officialPolish: {
    title: 'Official Polish filters for AdBlock, uBlock Origin & AdGuard',
    file: 'https://raw.githubusercontent.com/MajkiIT/polish-ads-filter/master/polish-adblock-filters/adblock.txt',
  },
  estonian: {
    title: 'Estonian List',
    file: 'https://adblock.ee/list.php',
  },
  adBlockPersian: {
    title: 'Adblock-Persian list',
    file: 'https://ideone.com/plain/K452p',
  },
  listKr: {
    title: 'List-KR',
    file: 'https://raw.githubusercontent.com/List-KR/List-KR/master/filter-uBlockOrigin.txt',
  },
  adBlockFinland: {
    title: 'Adblock List for Finland',
    file: 'https://raw.githubusercontent.com/finnish-easylist-addition/finnish-easylist-addition/master/Finland_adb.txt',
  },
  frellwitSwedish: {
    title: "Frellwit's Swedish Filter",
    file: 'https://raw.githubusercontent.com/lassekongo83/Frellwits-filter-lists/master/Frellwits-Swedish-Filter.txt',
  },
}

export default filters
