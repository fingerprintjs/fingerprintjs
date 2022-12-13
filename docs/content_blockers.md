# Content blockers

The page shows how to maintain content blockers entropy sources.

The entropy sources work only in Safari and on all Android browsers
because other browsers disable extensions in incognito mode and therefore the sources would be unstable.

## List of filters

Filter is a list of rules that tell browser what to block.
Filters are written using a common standard: [AdBlock Plus syntax](https://help.eyeo.com/en/adblockplus/how-to-write-filters).
Most ad blockers use this syntax, so the filters are universal.

See the filters that we consider (the most popular filters) in [filters.ts](../resources/content_blocking/filters.ts).

## DOM blockers

This entropy source checks which DOM elements (CSS selectors) are blocked by browsers.
The source code is at `src/sources/dom_blockers.ts`.
It contains a list of filters and CSS selectors to detect.
This list should be actualized periodically.

### How to make the list of filters

#### 1. Make a selectors tester

The open a terminal, go to the repository root and run:

```bash
yarn install
./node_modules/.bin/ts-node --compiler-options '{"esModuleInterop": true}' ./resources/content_blocking/make_selectors_tester.ts
```

It will download all the filters and
create an HTML file at `resources/content_blocking/selectors_tester.html`.

#### 2. Get selectors blocked by each filter

Install an ad blocker where you can choose individual filters to use.
We strongly recommend to use AdGuard on iOS or macOS because AdGuard allows choosing individual filters,
includes all the filters above, and iOS is the №1 target of the entropy source
(macOS version works the same but allows custom filters in free version).

Open the HTML file created above in the browser.
AdGuard in Safari works well if you just open the local file directly.
You can use [ngrok](https://stackoverflow.com/a/58547760/1118709) to open the file on another device.

For each filter in the list mentioned above, do the following steps:

1. Go to the ab blocker settings, turn on only this filter, make sure the new filter set is applied (click the refresh button in the ad blocker settings and wait a couple seconds).
2. Return to the browser, refresh the page (make sure the field content has changed). It will show which CSS selectors are blocked by the current filter.
    If the list is empty, try refreshing the page or opening it on another platform.
3. Save the content of the field to a `.txt` file in the `resources/content_blocking/blocked_selectors` directory.
    The file names will be names of the filters in the entropy source; see its source code to know the correct names.

After that, you will get the list of files that matches the current list of filters in the entropy source code.

#### 3. Get unique selectors for each filter

Open a terminal, go to the repository root and run:

```bash
./node_modules/.bin/ts-node ./resources/content_blocking/get_unique_filter_selectors.ts
```

A JSON file will be created at `resources/content_blocking/unique_filter_selectors.json`.
This file contains unique blocked selectors for each of the filters.

Runs this command to insert the unique selectors into `src/sources/dom_blockers.ts`:

```bash
./node_modules/.bin/ts-node ./resources/content_blocking/insert_filter_code.ts
```

Take a look into the changes of the `src/sources/dom_blockers.ts` file.
Make sure that no excess filters are added, renamed or removed.

#### 4. EasyList Android case

AdGuard on Android blocks slightly different selectors than AdGuard on iOS.
Sometimes it leads to false positive EasyList detection when AdGuard Base filter is used.

To solve it, you need an Android device or emulator with AdGuard installed.
Do the step 3, but copy all the selectors of EasyList to `src/sources/dom_blockers.ts` manually.
On the device, enable AdGuard, open the settings and enable a few filters including AdGuard Base but not including EasyList.
Start the playground, connect Chrome (or any other browser) debugger to the device, open the device browser console,
check which of the selectors are passed (see more detail about the debugging below) and copy 5 of them to the entropy source code.

If you don't have an ability to use an Android device/emulator,
just check that the current EasyList selectors don't give false positive using the debugging.

### Debug

If you run agent in debug mode (e.g. on the playground), the entropy source will print which CSS selectors are blocked and which aren't.
The selectors are grouped into filters (according to the entropy source code).
➡️ right to a selector means that it isn't blocked, 🚫 means that it's blocked.
You can adjust your ad blocker settings and see what changes.
Ideally, each filter must block all of its selectors and none of the other selectors.
