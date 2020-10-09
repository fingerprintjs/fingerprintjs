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
