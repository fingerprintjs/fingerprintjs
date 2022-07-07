# Evade ad blockers

Some ad blockers might detect and block this library because of the known CDN URL or the script name.
To evade the specific detection, one needs to check the applied rules.
Here are some generic options to circumvent this behavior.

## Open-source alternatives
- Use the [NPM installation option](https://github.com/fingerprintjs/fingerprintjs/blob/master/docs/api.md#webpackrollupnpmyarn) for the open source FingerprintJS.
- The less preferred way is to self-host the script on your own domain. It will make your script quickly outdated and it will stop working with new browsers as they get released in the future. Additionally, make sure the script's URL doesn't end with the `/fingerprint.js`, otherwise it will be blocked.
You can find scripts on the following URLs (you can replace the version with the specific version e.g. with `v3.3.3`).
  - ES Module download URL: `https://openfpcdn.io/fingerprintjs/v3/esm.min.js`.
  - UMD download URL: `https://openfpcdn.io/fingerprintjs/v3/umd.min.js`.

## Commercial alternatives
- Use the [free tier for FingerprintJS Pro](https://dashboard.fingerprint.com/signup), which allows making up to 20K identification events per month. This option supports both the CDN and NPM installation options as well as a [custom subdomain](https://dev.fingerprint.com/docs/subdomain-integration) that will prevent the ad blocker blocking.
- Use the [paid tier for FingerprintJS Pro](https://dashboard.fingerprint.com/signup), which allows making an unlimited number of identification events per month. This option supports both CDN and NPM installation options and the [custom subdomain](https://dev.fingerprint.com/docs/subdomain-integration) functionality too.
