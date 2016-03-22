Contributing to FingerprintJS2
==============================

## Found a bug?

Please submit an issue.
Include in the issue:

* List of components you received in the `get` call (make sure values are not truncated)
* If FP is different for you, include 2 versions of components
* Include your OS version
* Include steps to reproduce
* Include library call code (I need all options you used when calling the library function)

## Want to add contribute?

1. Fork the project and make the required changes in it.
2. Run `gulp` to catch stylistic errors and produce the minified
   version.
3. Run specs by opening the `specs/spec_runner.html` or typing `npm test` (requires phantomjs for console running).
4. Make a PR.

If your code changes the list of fingerprinting sources, please update
the README.

If you're unsure about the feature you want to add, submit an issue with
a `question` tag.

## Want to ask?
Please read FAQ first
If you have not found the answer you were looking for - use gitter.im to as your question (link is in the readme)

Happy Coding!
