# Version policy

The documented JS API follows [Semantic Versioning](https://semver.org).
Use undocumented features at your own risk.

## Visitor identifier compatibility

The library tries to keep visitor identifiers the same within a minor version (i.e. when the first 2 numbers of the version don't change).
Some visitor identifiers may change within a minor version due to stability fixes.
To get identifiers that remain stable up to 1 year, please consider [upgrading to pro](https://dashboard.fingerprintjs.com).

Agent `get()` function returns the version together with the visitor identifier.
You can use it to decide whether a couple of identifiers can be matched together.
Example:

```js
if (
  result1.version.split('.').slice(0, 2).join('.') ===
  result2.version.split('.').slice(0, 2).join('.')
) {
  return result1.visitorId === result2.visitorId ? 'same' : 'different'
} else {
  return 'unknown'
}
```
