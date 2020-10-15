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

To build the playground distribution code (e.g. to upload to a static server), run:

```bash
yarn playground:build
```

The result will appear at `playground/dist`.

### How to build

To build the distribution files of the library, run:

```bash
yarn build
```

The files will appear at `dist`.

### How to test

There are automatic tests.
They are run by [Jasmine](https://jasmine.github.io) in real browsers using [Karma](https://karma-runner.github.io).

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
Or make a PR to this repository, the test will run in BrowserStack automatically.
BrowserStack sessions are unstable, so a session can fail for no reason;
restart the testing when you see no clear errors related to the tests.
If you run the test command multiple times in parallel, BrowserStack will lose access to the Karma server
(for some reason), that will cause the tests to hang infinitely, so try to run a single testing at once.

Unit test files are located right next to individual module files that they check.
Integration tests are located in the `tests` directory.

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
