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
Alternatively, make a PR to this repository, the test will run on BrowserStack automatically.
But the test won't run when the PR is made from a fork repository, in this case a member will run the tests manually.

BrowserStack sessions are unstable, so a session can fail for no reason;
restart the testing when you see no clear errors related to the tests.
If you run the test command multiple times in parallel, BrowserStack will lose access to the Karma server
(for some reason), that will cause the tests to hang infinitely, so try to run a single testing at once.

To check the distributive TypeScript declarations, build the project and run:

```bash
yarn test:dts
```

To check that the package is compatible with server side rendering, build the project and run:

```bash
yarn test:ssr
```

### How to publish

This section is for repository maintainers.

1. Bump the version. Search the current version number in the code to know where to change it.
2. Build and test the project.
3. See what's will get into the NPM package, make sure it contains the distributive files and no excess files.
    To see, run `yarn pack`, an archive will appear nearby, open it with any archive browser.
4. Run
    ```bash
    yarn publish --access public # Add '--tag beta' (without the quotes) if you release a beta version
    ```
5. Push the changes to the repository, and a version tag like `v1.3.4` to the commit.
6. Describe the version changes at the [releases section](https://github.com/fingerprintjs/fingerprintjs/releases).
