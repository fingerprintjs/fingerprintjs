# How to publish

This guide is for repository maintainers.

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
7. Update agent at https://stackblitz.com/edit/fpjs-4-npm (find "dependencies" and click the round arrow)
