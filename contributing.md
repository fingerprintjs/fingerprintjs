# Contributing to FingerprintJS

Thanks for taking the time to contribute!
Here you can find ways to make FingerprintJS better, as well as tips and guidelines.

This project and everyone participating in it is governed by the [Code of Conduct](code_of_conduct.md).
By participating, you are expected to uphold this code.

## How you can contribute

### Reporting an issue

If you've noticed a bug, have an idea or a question,
feel free to [create an issue](https://github.com/fingerprintjs/fingerprintjs/issues/new/choose) or [start a discussion](https://github.com/fingerprintjs/fingerprintjs/discussions/new/choose).

Before you start, please [search](https://github.com/search?q=repo%3Afingerprintjs%2Ffingerprintjs&type=code) for your topic.
There is a chance it has already been discussed.

When you create an issue, the description is pre-filled with a template text.
Please fill in the missing information carefully, it will help us solve your issue faster.
If you want to share a piece of code or the library output with us, please wrap it in a ` ``` ` block and make sure you include all the information.

### Creating a pull request

If you want to fix a bug, add a source of entropy, or make any other code contribution, please [create a pull request](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project).

After you clone the repository, check the [Working with code](#working-with-code) section to learn how to run, check, and build the code.

In order for us to review and accept your code contributions, please follow these rules:
- Your code quality should be at least as good as the code you modify.
- Your code style (syntax, naming, coding patterns, etc) should follow the FingerprintJS style.
- All the new code should be covered with automated tests.
- All the checks described in the [Working with code](#working-with-code) section must pass successfully.
    You may create a draft pull request in this repository to run the checks automatically by GitHub Actions,
    but the tests won't run on BrowserStack until a FingerprintJS maintainer approves them.
- Follow the recommendations provided in the [Pitfalls](#pitfalls) section.
- If you want to add an entropy source (component), follow the [How to add an entropy source](#how-to-add-an-entropy-source) instructions carefully.
- The changes should be backward compatible, ensuring FingerprintJS users continue to use the library without any modifications.
- Don't add dependencies (such as Node packages) unless necessary.
- Don't make changes unrelated to the stated purpose of your pull request. Please strive to introduce as few changes as possible.
- Don't change FingerprintJS code style, its TypeScript configuration, or other subjective things.

If you want to do something more complex than fixing a small bug, or if you're not sure if your changes meet the project requirements, please [start a discussion](https://github.com/fingerprintjs/fingerprintjs/discussions/new/choose).
We encourage starting a discussion if you want to propose changing a rule from this guide.
Doing so ensures we discuss all opinions, creating a good contribution experience for everyone.

### Helping with existing issues

If you want to help, but don't know where to start, take a look at the ["help wanted" issues](https://github.com/fingerprintjs/fingerprintjs/labels/help%20wanted).
You can help by sharing knowledge or creating a pull request.
Feel free to ask questions in the issues if you need more details.

## Working with code

This section describes how to deploy the repository locally, make changes to the code, and verify your work.

First, make sure you have [Git](https://git-scm.com), [Node.js](https://nodejs.org/en) and [Yarn](https://yarnpkg.com) installed.
Then clone the repository and install the dependencies:

```bash
git clone https://github.com/fingerprintjs/fingerprintjs.git
cd fingerprintjs
yarn install
```

### Development playground

Development playground lets you run FingerprintJS locally. Run this command to start a playground:

```bash
yarn playground:start # Add '--port 8765' to change the server port
```

Then open http://localhost:8080 in a browser.
FingerprintJS will execute immediately and print the result on the page.
The page reloads every time you change the source code.
The code of the playground itself is located in the [playground](playground) directory.

If you want to open the playground on a device outside your local network, use a tool like [Ngrok](https://ngrok.com).

To build the playground distribution code (e.g. to upload it to a web server), run:

```bash
yarn playground:build
```

The static webpage files will be saved to the `playground/dist` directory.

### Code style

Follow the repository's code style.
The code style is controlled by [ESLint](https://eslint.org) and [Prettier](https://prettier.io).
Run to check that the code style is ok:

```bash
yarn lint
```

You aren't required to run the check manually, the CI will do it.
Run to fix code style mistakes (not all mistakes can be fixed automatically):

```bash
yarn lint:fix
```

### How to build

To build the distribution files of FingerprintJS that can be used in a browser directly, run:

```bash
yarn build
```

The files will be saved to the `dist` directory.

### Pitfalls

Avoid running expressions in the top level of the modules.
It will help to tree-shake the library better:

```js
// Ok. Will be removed if not used.
function do() {
  // Any expression inside a function is ok
}

// Ok. Will be removed if not used.
const var1 = { prop: 'foo' }

// No! A function is called, the function call won't be removed.
const var2 = Object.keys(var1)

// No! An object property is accessed, the expression won't be removed because the property may be a getter.
const var3 = var1.prop

// No! Will be converted to `const var4 = {}; var4.bar = 'foo'`.
const var4 = { [Enum.Member]: 'foo' }
```

Avoid using `navigator.userAgent` or similar APIs, as they are frequently spoofed.
Instead, for code that makes decisions based on browser name and version, use the functions available in [src/utils/browser.ts](src/utils/browser.ts).
However, in tests, for greater reliability, use `navigator.userAgent` through the functions in [tests/utils/index.ts](tests/utils/index.ts).

The `include` parameter of `tsconfig.json` files may contain only the entry files and the `.d.ts` files.

Some `interface`s are replaced with `type`s in the entropy sources to help to avoid
["cannot be named" errors](https://github.com/microsoft/TypeScript/issues/5711) in projects using FingerprintJS.

### How to test

There are automatic tests.
They are run by [Jasmine](https://jasmine.github.io) in real browsers using [Karma](https://karma-runner.github.io).
Unit test files are located right next to individual module files that they check.
Integration tests are located in the `tests` directory.

To run the tests in a browser on your machine, build the project and run:
```bash
yarn test:local --browsers ChromeHeadless
# or to run in Firefox
yarn test:local --browsers FirefoxHeadless
# or to run in both
yarn test:local
```

To run the tests in browsers on [BrowserStack](https://www.browserstack.com), get a BrowserStack access key and run:
```bash
# For Linux, macOS and WSL (Linux on Windows)
BROWSERSTACK_USERNAME=your-username BROWSERSTACK_ACCESS_KEY=your-key yarn test:browserstack
```
If you face `Error: spawn Unknown system error -86` on macOS, try installing Rosetta:
```bash
softwareupdate --install-rosetta
```

Alternatively, make a PR to this repository, the test will run on BrowserStack automatically.
But the test won't run when the PR is made from a fork repository, in this case, a member will run the tests manually.

BrowserStack sessions are unstable, so a session can fail for no reason;
restart the testing when you see no clear errors related to the tests.
If you run the test command multiple times in parallel, BrowserStack will lose access to the Karma server
(for some reason), which will cause the tests to hang infinitely, so try to run a single test command at once.

To check the distribution TypeScript declarations, build the project and run:

```bash
yarn check:dts
```

To check that the package is compatible with server-side rendering, build the project and run:

```bash
yarn check:ssr
```

### How to add an entropy source

An entropy source is a function that gets a piece of data about the browser.
The value returned by an entropy source (also called an entropy component) is used to produce the visitor identifier.
Entropy sources are located in the [src/sources](src/sources) directory.
All entropy components must be simple JavaScript values that can be encoded into JSON.

Entropy sources must meet the following requirements:
- It is stable — it always or almost always produces the same value in each browser, including incognito, guest, and desktop modes.
- It is selective — it produces different values in different browsers, operating systems, or devices.
    A good entropy source represents the browser, operating system, or device settings.
- It produces no side effects, such as messages in the browser console, DOM changes, modal windows, notifications, and sounds.
- It is fast. An entropy source should take no more than 1 second to complete.
- It doesn't represent only the browser version. An example of such a signal is a JavaScript feature probing.
    It's not a good entropy source because the return value is likely to change due to automatic browser updates,
    the selectivity is low, and the same entropy can be achieved by just using the User-Agent string.

Entropy sources run in 2 stages: "load" and "get":
- "Load" runs once when the agent's `load` function is called.
    It must do as much work on the source as possible to make the "get" phase as fast as possible.
    It may start background processes that will run indefinitely or until the "get" phase runs.
- "Get" runs once per each agent's `get` function call.
    It must be as fast as possible.

An example entropy source:

```js
// The function below represents the "load" phase
async function entropySource() {
  // The "load" phase starts here
  const preData = await doLongAction()

  // The "load" phase ends when the `entropySource` function returns
  // The function below represents the "get" phase
  return async () => {
    // The "get" phase starts here
    const finalData = await finalizeData(preData)
    return finalData
    // The "get" phase ends then this returned function returns
  }
}
```

Any of the phases can be synchronous:

```js
function entropySource() {
  const preData = doLongSynchronousAction()

  return () => {
    const finalData = finalizeDataSynchronously(preData)
    return finalData
  }
}
```

The "get" phase can be omitted:

```js
async function entropySource() {
  const finalData = await doLongAction()

  // If the source's returned value is not a function, it's considered an entropy component
  return finalData // Equivalent to: return () => finalData
}
```

In fact, most entropy sources don't require a "get" phase.
The "get" phase is required if the component can change after completing the load phase.

In order for the agent to measure the entropy source execution duration correctly,
the "load" phase shouldn't run in the background (after the source function returns).
On the other hand, in order not to block the whole agent, the "load" phase must contain only the necessary actions.
Example:

```js
async function entropySource() {
  // Wait for the required data to be calculated during the "load" phase
  let result = await doLongAction()

  // Start watching optional data in the background (this function doesn't block the execution)
  watchNextResults((newResult) => {
    result = newResult
  })

  // Then complete the "load" phase by returning a function.
  // `watchNextResults` will continue working until the "get" phase starts.
  return () => {
    return result
  }
}
```

Entropy sources must handle expected and only expected errors.
The expected errors must be turned into special entropy component values.
Pay attention to potential asynchronous errors.
If you handle unexpected errors, you won't know what's going wrong inside the entropy source.
Example:

```js
async function entropySource() {
  try {
    // `await` is necessary to catch asynchronous errors
    return await doLongAction()
  } catch (error) {
    // WRONG:
    return 'error'

    // Correct:
    if (error.message = 'Foo bar') {
      return 'bot'
    }
    if (/boo/.test(error.message)) {
      return 'ie'
    }
    throw error // Unexpected error
  }
}
```

When you complete an entropy source, add it to [src/sources/index.ts](src/sources/index.ts).

Every entropy source needs to be covered with unit tests.
These tests are meant to verify that the entropy source returns expected values across all supported browsers.
In the event of significant changes or deprecation of underlying APIs, these tests should start to fail in future browser versions.
Additionally, if deemed necessary, it's recommended to include a test to ensure that the entropy source remains stable.

For inspiration see existing tests in [src/sources/](src/sources/).

### How to publish

See the [publishing guide](docs/publishing.md) (for FingerprintJS maintainers only).
