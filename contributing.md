# Contributing to FingerprintJS

## Working with the code

Make sure you have [Yarn](https://yarnpkg.com) installed.

### Development playground

It's a page that runs the library once opened.
It's a quick way to debug the code.

```bash
yarn install
yarn playground:start # Add '--port 8765' to change the server port
```

Then open http://localhost:8080 in a browser.
It's reloaded every time the source code is changed.
The code of the playground itself is located in the [playground](playground) directory.
Use a tool like [Ngrok](https://ngrok.com) to open the playground on a remote device.

To build the playground distribution code (e.g. to upload to a static server), run:

```bash
yarn playground:build
```

The result will appear at `playground/dist`.

### Code style

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

To build the distribution files of the library, run:

```bash
yarn build
```

The files will appear at `dist`.

### Pitfalls

Avoid running expression in top level of the modules.
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
But the test won't run when the PR is made from a fork repository, in this case a member will run the tests manually.

BrowserStack sessions are unstable, so a session can fail for no reason;
restart the testing when you see no clear errors related to the tests.
If you run the test command multiple times in parallel, BrowserStack will lose access to the Karma server
(for some reason), that will cause the tests to hang infinitely, so try to run a single testing at once.

To check the distributive TypeScript declarations, build the project and run:

```bash
yarn check:dts
```

To check that the package is compatible with server side rendering, build the project and run:

```bash
yarn check:ssr
```

### How to make an entropy source

Entropy source is a function that gets a piece of data about the browser a.k.a. a fingerprint component.
Entropy sources are located in the [src/sources](src/sources) directory.
Entropy component must be a simple JS value that can be JSON-encoded.

Entropy source runs in 2 stages: "load" and "get":
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

  // If the source's returned value isn't a function, it's considered as a fingerprint component
  return finalData // Equivalent to: return () => finalData
}
```

In fact, most entropy sources don't require a "get" phase.
The "get" phase is required if the component can change after completing the load phase.

In order for agent to measure the entropy source execution duration correctly,
the "load" phase shouldn't run in background (after the source function returns).
On the other hand, in order not to block the whole agent, the "load" phase must contain only the necessary actions.
Example:

```js
async function entropySource() {
  // Wait for the required data to be calculated during the "load" phase
  let result = await doLongAction()

  // Start watching optional data in background (this function doesn't block the execution)
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

Entropy source must handle expected and only expected errors.
The expected errors must be turned into fingerprint components.
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

This section is for repository maintainers.

1. Bump the version. Search the current version number in the code to know where to change it.
2. Build and test the project.
3. See what will get into the NPM package, make sure it contains the distributive files and no excess files.
    To see, run `yarn pack`, an archive will appear nearby, open it with any archive browser.
4. Run
    ```bash
    # Add '--tag beta' (without the quotes) if you release a beta version
    # Add '--tag dev' if you release a development version (which is expected to get new features)
    yarn publish --access public
    ```
5. Push the changes to the repository, and a version tag like `v1.3.4` to the commit.
6. Describe the version changes at the [releases section](https://github.com/fingerprintjs/fingerprintjs/releases).
7. Update agent at https://stackblitz.com/edit/fpjs-3-npm (find "dependencies" and click the round arrow)
