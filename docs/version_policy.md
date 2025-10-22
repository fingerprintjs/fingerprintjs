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
const oldFpPromise = import('https://openfpcdn.io/fingerprintjs/v4.1')
  .then(FingerprintJS => FingerprintJS.load())

const newFpPromise = import('https://openfpcdn.io/fingerprintjs/v5.0')
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
      + `?fingerprintV4_1=${encodeURIComponent(oldResult.visitorId)}`
      + `&fingerprintV5_0=${encodeURIComponent(newResult.visitorId)}`
  )
})
```

Make your server search using both the identifiers.
Save the new identifier, there is no need to save the old identifier for new visitors:

```sql
-- Getting the visitor
SELECT * FROM visitors
WHERE
  fingerprintV4_1 = :fingerprintV4_1 OR
  fingerprintV5_0 = :fingerprintV5_0;

-- Update the visitor identifier
-- to switch to the new fingerprint version
UPDATE visitors
SET fingerprintV5_0 = :fingerprintV5_0
WHERE fingerprintV4_1 = :fingerprintV4_1;

-- Saving a new visitor
INSERT INTO visitors (..., fingerprintV5_0)
VALUES (..., :fingerprintV5_0);
```

Later, when you get many enough identifiers of the new version, remove the old library and the old identifiers.

Check [the changelog](https://github.com/fingerprintjs/fingerprintjs/releases) before the update, sometimes new minor
versions don't change the identifiers, so just changing the library version may suffice.
