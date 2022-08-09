# Version policy

The documented JS API follows [Semantic Versioning](https://semver.org).
Use undocumented features at your own risk.

## Visitor identifier compatibility

The library tries to keep visitor identifiers the same within a minor version (i.e. when the first 2 numbers of the version don't change).
Some visitor identifiers may change within a minor version due to stability fixes.
To get identifiers that remain stable up to 1 year, please consider [upgrading to pro](https://dashboard.fingerprint.com).

Agent `get()` function returns the version together with the visitor identifier.
You can use it to decide whether a couple of identifiers can be matched together.
Example:

```js
if (
  result1.version.split('.', 2).join('.') ===
  result2.version.split('.', 2).join('.')
) {
  return result1.visitorId === result2.visitorId ? 'same' : 'different'
} else {
  return 'unknown'
}
```

## How to update without losing the identifiers

We recommend keeping your library version up to date.
You may not want to update because the identifier may change after a minor version upgrade.
If this is an issue for you, you can implement the following strategy.

When a new minor or major version is released, install it together with the current version:

```ts
const oldFpPromise = import('https://openfpcdn.io/fingerprintjs/v3.2')
  .then(FingerprintJS => FingerprintJS.load())

const newFpPromise = import('https://openfpcdn.io/fingerprintjs/v3.3')
  .then(FingerprintJS => FingerprintJS.load())
```

(if you prefer NPM or Yarn, see [this note](https://stackoverflow.com/a/56495651/1118709))

When you need the visitor identifier, get identifiers from both versions:

```js
Promise.all([
  oldFpPromise.then(fp => fp.get()),
  newFpPromise.then(fp => fp.get()),
]).then(([oldResult, newResult]) => {
  // Handle both the results. For example, send to your server.
  return fetch(
    '/visitor'
      + `?fingerprintV3_2=${encodeURIComponent(oldResult.visitorId)}`
      + `&fingerprintV3_3=${encodeURIComponent(newResult.visitorId)}`
  )
})
```

Make your server search using both the identifiers.
Save the new identifier, there is no need to save the old identifier for new visitors:

```sql
-- Getting the visitor
SELECT * FROM visitors
WHERE
  fingerprintV3_2 = :fingerprintV3_2 OR
  fingerprintV3_3 = :fingerprintV3_3;

-- Update the visitor identifier
-- to switch to the new fingerprint version
UPDATE visitors
SET fingerprintV3_3 = :fingerprintV3_3
WHERE fingerprintV3_2 = :fingerprintV3_2;

-- Saving a new visitor
INSERT INTO visitors (..., fingerprintV3_3)
VALUES (..., :fingerprintV3_3);
```

Later, when you get many enough identifiers of the new version, remove the old library and the old identifiers.

Check [the changelog](https://github.com/fingerprintjs/fingerprintjs/releases) before the update, sometimes new minor
versions don't change the identifiers, so just changing the library version may suffice.
