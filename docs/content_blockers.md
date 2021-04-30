# Content blockers

The page shows how to maintain content blockers entropy sources.

The entropy sources work only in Safari and on all Android browsers
because other browsers disable extensions in incognito mode and therefore the sources would be unstable.

## List of filters

Filter is a list of rules that tell browser what to block.
Filters are written using a common standard: [AdBlock Plus syntax](https://help.eyeo.com/en/adblockplus/how-to-write-filters).
Most ad blockers use this syntax, so the filters are universal.

Here are the filters that we consider (the most popular filters):

- [AdGuard](https://kb.adguard.com/en/general/adguard-ad-filters#adguard-filters)
    - AdGuard Base filter: https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_2_English/filter.txt
    - AdGuard Mobile Ads filter: https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_11_Mobile/filter.txt
    - AdGuard Tracking Protection filter: https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_3_Spyware/filter.txt
    - AdGuard Social Media filter: https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_4_Social/filter.txt
    - AdGuard Annoyances filter: https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_14_Annoyances/filter.txt
    - AdGuard Russian filter: https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_1_Russian/filter.txt
    - AdGuard Chinese filter: https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_224_Chinese/filter.txt
    - AdGuard German filter (included in EasyList Germany): https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_6_German/filter.txt
    - AdGuard Dutch filter (same selectors as in EasyList Dutch): https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_8_Dutch/filter.txt
    - AdGuard French filter: https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_16_French/filter.txt
    - AdGuard Japanese filter: https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_7_Japanese/filter.txt
    - AdGuard Spanish/Portuguese filter: https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_9_Spanish/filter.txt
    - AdGuard Turkish filter: https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_13_Turkish/filter.txt
- [EasyList](https://easylist.to)
    - EasyList: https://easylist.to/easylist/easylist.txt
    - EasyPrivacy (no blocked selectors): https://easylist.to/easylist/easyprivacy.txt
    - EasyList Cookie List: https://secure.fanboy.co.nz/fanboy-cookiemonster.txt
    - EasyList Germany: https://easylist.to/easylistgermany/easylistgermany.txt
    - EasyList Italy: https://easylist-downloads.adblockplus.org/easylistitaly.txt
    - EasyList Dutch: https://easylist-downloads.adblockplus.org/easylistdutch.txt
    - Liste FR (included in AdGuard French filter): https://easylist-downloads.adblockplus.org/liste_fr.txt
    - EasyList China: https://easylist-downloads.adblockplus.org/easylistchina.txt
    - Bulgarian List: https://stanev.org/abp/adblock_bg.txt
    - ABPindo: https://raw.githubusercontent.com/heradhis/indonesianadblockrules/master/subscriptions/abpindo.txt
    - Liste AR: https://easylist-downloads.adblockplus.org/Liste_AR.txt
    - EasyList Czech and Slovak: https://raw.githubusercontent.com/tomasko126/easylistczechandslovak/master/filters.txt
    - Latvian List: https://notabug.org/latvian-list/adblock-latvian/raw/master/lists/latvian-list.txt
    - EasyList Hebrew: https://raw.githubusercontent.com/easylist/EasyListHebrew/master/EasyListHebrew.txt
    - EasyList Lithuania: https://raw.githubusercontent.com/EasyList-Lithuania/easylist_lithuania/master/easylistlithuania.txt
    - AdBlock Warning Removal List (included in RU AdList): https://easylist-downloads.adblockplus.org/antiadblockfilters.txt
- [Fanboy](https://www.fanboy.co.nz)
    - Fanboy Enhanced Trackers List: https://secure.fanboy.co.nz/enhancedstats.txt
    - Fanboy Anti-Facebook Filters (included in Social List): https://www.fanboy.co.nz/fanboy-antifacebook.txt
    - Fanboy Thirdparty Fonts Filters (no blocked selectors): https://www.fanboy.co.nz/fanboy-antifonts.txt
    - Fanboy Social List (included in Annoyances): https://easylist.to/easylist/fanboy-social.txt
    - Fanboy Annoyances: https://secure.fanboy.co.nz/fanboy-annoyance.txt
    - Fanboy Anti-Cookie Filters (equals to EasyList Cookie List, included in Annoyances)
- Other
    - Peter Lowe's Blocklist (no blocked selectors): https://pgl.yoyo.org/adservers/serverlist.php?hostformat=adblockplus&showintro=0&mimetype=plaintext
    - Web Annoyances Ultralist: everything from https://github.com/yourduskquibbles/webannoyances/tree/master/filters
    - I don't care about cookies: https://www.i-dont-care-about-cookies.eu/abp/
    - ROList and ROLIST2: https://zoso.ro/pages/rolist2.txt
    - RU AdList (it doesn't work in AdGuard for some reason): https://easylist-downloads.adblockplus.org/advblock.txt
    - Icelandic ABP List: https://adblock.gardar.net/is.abp.txt
    - Greek AdBlock Filter: https://raw.githubusercontent.com/kargig/greek-adblockplus-filter/master/void-gr-filters.txt
    - Thai Ads Filters: https://adblock-thai.github.io/thai-ads-filter/subscription.txt
    - Hungarian filter: https://raw.githubusercontent.com/hufilter/hufilter/master/hufilter.txt
    - ABPVN List (Vietnamese): https://abpvn.com/filter/abpvn-h9kF1c.txt
    - Official Polish filters for AdBlock, uBlock Origin & AdGuard: https://raw.githubusercontent.com/MajkiIT/polish-ads-filter/master/polish-adblock-filters/adblock.txt
    - Estonian List: https://adblock.ee/list.php
    - Adblock-Persian list: https://ideone.com/plain/K452p
    - List-KR: https://raw.githubusercontent.com/List-KR/List-KR/master/filter.txt
    - Adblock List for Finland: https://raw.githubusercontent.com/finnish-easylist-addition/finnish-easylist-addition/master/Finland_adb.txt
    - Frellwit's Swedish Filter: https://raw.githubusercontent.com/lassekongo83/Frellwits-filter-lists/master/Frellwits-Swedish-Filter.txt

## DOM blockers

This entropy source checks which DOM elements (CSS selectors) are blocked by browsers.
The source code is at `src/sources/dom_blockers.ts`.
It contains a list of filters and CSS selectors to detect.
This list should be actualized periodically.

### How to make the list of filters

#### 1. Download the filters

Download all the filters from the list above.
The downloaded file names mustn't start with `.` and must have the `.txt` extension.

#### 2. Make a selectors tester

Put the downloaded files into the `resources/content_blocking/filters` directory.
The open a terminal, go to the repository root and run:

```bash
yarn install
./node_modules/.bin/ts-node --compiler-options '{"module": "CommonJS"}' ./resources/content_blocking/make_selectors_tester.ts
```

An HTML file will be created at `resources/content_blocking/selectors_tester.html`.

#### 3. Get selectors blocked by each filter

Install an ad blocker where you can choose individual filters to use.
We strongly recommend to use AdGuard on iOS or macOS because AdGuard allows choosing individual filters,
includes all the filters above, and iOS is the №1 target of the entropy source
(macOS version works the same but allows custom filters in free version).

Open the HTML file created above in the browser.
AdGuard in Safari works well if you just open the local file directly.
You can use [ngrok](https://stackoverflow.com/a/58547760/1118709) to open the file on another device.

For each filter in the list above, except for the filters noted as having no blocked selectors or duplicating other filters, do the following steps:

1. Go to the ab blocker settings, turn on only this filter, make sure the new filter set is applied (click the refresh button in the ad blocker settings and wait a couple seconds).
2. Return to the browser, refresh the page (make sure the field content has changed). It will show which CSS selectors are blocked by the current filter.
3. Save the content of the field to a `.txt` file in the `resources/content_blocking/blocked_selectors` directory.
    The file names will be names of the filters in the entropy source; see its source code to know the correct names.

After that, you will get the list of files that matches the current list of filters in the entropy source code.

#### 4. Get unique selectors for each filter

Open a terminal, go to the repository root and run:

```bash
./node_modules/.bin/ts-node --compiler-options '{"module": "CommonJS"}' ./resources/content_blocking/get_unique_filter_selectors.ts
```

A JSON file will be created at `resources/content_blocking/unique_filter_selectors.json`.
This file contains unique blocked selectors for each of the filters.

Take 5 random selectors for each filter from the file and copy them to `src/sources/dom_blockers.ts`.
I prefer selectors that depict features of filters (e.g. have foreign words or domains in case of regional filters),
they increase the stability of selectors.
Avoid selectors with `iframe` if possible as they produce excess load on browsers.

#### 5. Handle empty filters

If you see a filter with no unique selectors, it shall mean that the filter is included into another filter (see notes in the filter list above).
In this case, temporary move the files of the filters that include that filter out of the `resources/content_blocking/blocked_selectors` directory,
run `get_unique_filter_selectors.ts` again, see selectors for the filter in the new version of the `unique_filter_selectors.json` file
and return the moved files back (to the initial state).
Such way you'll get selectors that identify both the included, and the including filters.

Repeat the steps for all filters with no unique selectors.

#### 6. EasyList Android case

AdGuard on Android blocks slightly different selectors than AdGuard on iOS.
Sometimes it leads to false positive EasyList detection when AdGuard Base filter is used.

To solve it, you need an Android device or emulator with AdGuard installed.
Do the step 4, but instead of 5, copy all the selectors of EasyList.
On the device, enable AdGuard, open the settings and enable a few filters including AdGuard Base but not including EasyList.
Start the playground, connect Chrome (or any other browser) dubugger to the device, open the device browser console,
check which of the selectors are passed (see more detail about the debugging below) and copy 5 of them to the entropy source code.

If you don't have an ability to use an Android device/emulator,
just check that the current EasyList selectors don't give false positive using the debugging.

### Debug

If you run agent in debug mode (e.g. on the playground), the entropy source will print which CSS selectors are blocked and which aren't.
The selectors are grouped into filters (according to the entropy source code).
➡️ right to a selector means that it isn't blocked, 🚫 means that it's blocked.
You can adjust your ad blocker settings and see what changes.
Ideally, each filter must block all of its selectors and none of the other selectors.
