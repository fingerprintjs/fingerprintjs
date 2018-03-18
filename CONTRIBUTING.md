Contributing to FingerprintJS2
==============================

# IF YOU WANT TO ASK A QUESTION - USE GITTER.IM OR STACKOVERFLOW.COM with fingerprintjs2 tag

PLEASE :)

ISSUES WITH QUESTIONS IN THEM WILL BE CLOSED W/OUT EXPLANATION!

## Found a bug?

Please first try if the issue is gone in GitHub master.

Please include the following information in your bug report:

* List of components you received in the `get` call (make sure values are not truncated). If FP is different every time you call the library, include 2 versions of components. Please use this jsfiddle: https://jsfiddle.net/L2gLq4rg/
* Device info (e.g. MacBook Pro 2015)
* Your code with all options you used when calling the library function

## Want to add a feature / contribute?
* Make sure the issue/suggestion does not exist by searching existing issues
* Fork the project and make the required changes in it (don't forget to add specs)
* PRs w/out specs will not be accepted
* Run `gulp` to catch stylistic errors and produce the minified version.
* Run specs by opening the `specs/spec_runner.html` or typing `npm test` (requires phantomjs for console running).
* Make a PR.
* Make sure you only make one commit per feature you want to add
* Make sure your commit message is descriptive and tells what you changed (`Updated the library` - that's a bad commit message)

If your code changes the list of fingerprinting sources, please update
the README.

If you're unsure about the feature you want to add, submit an issue with
a `question` tag.

## Want to ask?
* Please read FAQ first
* If you have not found the answer you were looking for - use gitter.im to ask your question (link is in the readme)

Happy Coding!
