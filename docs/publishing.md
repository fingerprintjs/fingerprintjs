# How to publish

This guide is for repository maintainers.

1. Create a PR that bumps the version in [package.json](../package.json).
2. [Build the project](../contributing.md#how-to-build) on your local machine and run `yarn pack`.
    An archive will be created nearby in the repository root directory.
    Open the archive and make sure it contains the distribution files and no excess files.
    If there is something wrong, fix it and push to the PR.
3. When the PR checks succeed and the PR is approved, merge it.
4. Run the [Publish to NPM](https://github.com/fingerprintjs/fingerprintjs/actions/workflows/npm_publish.yml) workflow by using the "Run workflow" button.
    It will publish the current code to NPM and create a corresponding Git tag.
    The NPM version tag will be derived automatically from the package version, for example `1.2.3` gives `latest` and `1.2.3-alpha.1` gives `alpha`.
5. Describe the version changes in the [releases section](https://github.com/fingerprintjs/fingerprintjs/releases) under the corresponding tag.
6. Update the agent in https://stackblitz.com/edit/fpjs-4-npm (find "dependencies" and click the round arrow).
