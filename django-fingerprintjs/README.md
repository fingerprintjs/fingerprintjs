<p align="center">
  <img src="docs/logo.svg" width="760" alt="Django FingerprintJS">
</p>

<p align="center">
  <img alt="Python 3.9+" src="https://img.shields.io/badge/Python-3.9%2B-3776AB?logo=python&logoColor=white">
  <img alt="Django 4.2+" src="https://img.shields.io/badge/Django-4.2%2B-0C4B33?logo=django&logoColor=white">
  <img alt="Tests passing" src="https://img.shields.io/badge/tests-5%20passing-44B78B">
  <img alt="MIT license" src="https://img.shields.io/badge/license-MIT-blue">
</p>

<p align="center">
  A clean, reusable Django integration built around the open-source
  <a href="https://github.com/fingerprintjs/fingerprintjs">FingerprintJS</a>
  browser agent.
</p>

---

## ✨ What is this?

FingerprintJS is an excellent browser-side fingerprinting library, but a
Django application still needs to safely receive, validate, protect, store,
and use the resulting visitor ID.

**Django FingerprintJS rewrites that integration layer as a proper Django
app.** Add it to `INSTALLED_APPS`, include one URL configuration, place one
template tag in your page, and the rest is handled for you.

The fingerprint itself must be calculated in JavaScript because screen,
rendering, browser, language, platform, and other browser signals do not exist
on the Django server. This package connects that browser result to Django in a
secure and reusable way—it does not pretend to reproduce those signals in
Python.

## 🧰 What you get

- 🧩 A reusable Django application
- 🖥️ A small browser loader for FingerprintJS v5
- 🛡️ CSRF-protected registration
- 🔐 Server-side HMAC hashing before storage by default
- 👤 Association with authenticated Django users
- 🍪 Anonymous session support
- 🗃️ Model, migration, constraints, and Django admin
- ✅ Automatic deduplication of repeated page loads
- 🤝 An explicit consent-controlled mode
- ⚙️ Simple settings for authentication, IP capture, caching, and self-hosting

## 🚀 Quick start

### 1. Install

From this repository:

```bash
cd django-fingerprintjs
python -m pip install -e .
```

### 2. Enable the app

```python
# settings.py
INSTALLED_APPS = [
    # Your other applications...
    "django_fingerprintjs",
]
```

### 3. Add its URLs

```python
# project/urls.py
from django.urls import include, path

urlpatterns = [
    # Your other URLs...
    path("fingerprint/", include("django_fingerprintjs.urls")),
]
```

### 4. Create the database table

```bash
python manage.py migrate
```

### 5. Add the loader to your base template

Place it near the end of `<body>`:

```django
{% load fingerprintjs %}

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>My Django site</title>
  </head>
  <body>
    {% block content %}{% endblock %}

    {% fingerprintjs_loader %}
  </body>
</html>
```

That is enough. The visitor ID is calculated in the browser, submitted through
the CSRF-protected endpoint, hashed on the server, stored in the database, and
attached to the current user or anonymous session.

## 🧭 How it works

```text
Visitor's browser
      │
      ├─ FingerprintJS reads browser/device signals
      │
      ├─ Generates a visitorId
      │
      └─ CSRF-protected POST
              │
              ▼
       Django registration view
              │
              ├─ Validates the submitted value
              ├─ HMAC-hashes it using SECRET_KEY
              ├─ Associates it with user/session
              └─ Stores or updates BrowserFingerprint
```

The complete browser components are **not** sent to Django. Only the generated
`visitorId` is submitted by this integration.

## 🕶️ Does it work in incognito mode?

It can often recognize the same browser/device in normal and private browsing
because the fingerprint uses more than cookies or local storage. Signals can
include screen characteristics, rendering behavior, available browser
features, platform details, timezone, language, and similar properties.

It is not guaranteed. Privacy-focused browsers can block or alter signals;
browser, hardware, display, extension, or configuration changes can produce a
new ID; unrelated devices can occasionally collide; and a motivated client can
spoof the submitted value.

Use the result as a **risk signal**, never as proof of identity.

## 🤝 Consent-controlled collection

If your application must wait for user consent, disable automatic collection:

```django
{% fingerprintjs_loader auto=False consent=True %}
```

After your consent manager records permission:

```javascript
try {
  const result = await window.DjangoFingerprintJS.register();
  console.log("Fingerprint registered", result);
} catch (error) {
  console.error("Fingerprint registration failed", error);
}
```

This package intentionally does not ship a consent banner. Consent categories,
wording, retention rules, and legal requirements depend on your application
and jurisdiction.

## 🎛️ Configuration

All settings are optional:

```python
# settings.py
FINGERPRINTJS = {
    # Pin or self-host the browser module in production if desired.
    "SCRIPT_URL": "https://openfpcdn.io/fingerprintjs/v5",

    # Protect the raw visitor ID before database/session storage.
    "HASH_VISITOR_IDS": True,

    # Disabled by default for data minimization.
    "CAPTURE_IP": False,

    # Set True if only logged-in users may register a fingerprint.
    "REQUIRE_AUTHENTICATION": False,

    "SESSION_KEY": "django_fingerprintjs_id",
    "CACHE_KEY": "django-fingerprintjs-registered",
    "CACHE_TTL_SECONDS": 86400,
}
```

| Setting | Default | Purpose |
|---|---:|---|
| `SCRIPT_URL` | FingerprintJS v5 CDN | Browser module to load |
| `HASH_VISITOR_IDS` | `True` | HMAC-hash IDs before storage |
| `CAPTURE_IP` | `False` | Store `REMOTE_ADDR` with a record |
| `REQUIRE_AUTHENTICATION` | `False` | Reject anonymous registration |
| `SESSION_KEY` | `django_fingerprintjs_id` | Django session key |
| `CACHE_KEY` | `django-fingerprintjs-registered` | Browser tab cache key |
| `CACHE_TTL_SECONDS` | `86400` | Time before registering again |

Keep `HASH_VISITOR_IDS` enabled unless you have a clear reason to retain raw
IDs. If it is disabled, the current database field supports IDs up to 64
characters.

## 🧑‍💻 Using the fingerprint in Django

Read the protected ID attached to the current session:

```python
visitor_id = request.session.get("django_fingerprintjs_id")

if visitor_id:
    # Use as one input to rate limiting, anomaly detection, or risk scoring.
    pass
```

Query fingerprints belonging to an authenticated user:

```python
fingerprints = request.user.browser_fingerprints.all()
```

You can also inspect records through Django admin after registering the model's
app in your project admin setup.

## 💡 Appropriate uses

- Add context to login or account-recovery risk scoring
- Detect unusually high numbers of accounts from one browser
- Support abuse and fraud investigation
- Supplement rate limits
- Flag unexpected browser changes for additional verification

## ⚠️ Security and privacy

- A visitor ID is client-controlled and can be spoofed.
- Never use it instead of passwords, sessions, authorization checks, or MFA.
- Never automatically ban a person based only on a fingerprint match.
- Shared devices may identify multiple people as the same browser.
- IDs may change, and separate devices may occasionally produce the same ID.
- The public CDN may be blocked by browsers or content blockers. Set
  `SCRIPT_URL` to a pinned, self-hosted build when reliability matters.
- Tell users what you collect and why, choose a retention period, and connect
  deletion to your existing privacy workflow.
- If IP capture is enabled behind a proxy, normalize trusted proxy information
  before it reaches Django. This package deliberately does not trust arbitrary
  forwarded headers.

## 🧪 Development and tests

Run the integration suite from this directory:

```bash
python -m django test tests --settings=tests.settings
python -m django check --settings=tests.settings
python -m django makemigrations django_fingerprintjs \
  --check --dry-run --settings=tests.settings
```

The tests cover anonymous registration, server-side hashing, session storage,
deduplication, invalid input, authentication requirements, and database
uniqueness.

## 🙏 Credits

The browser fingerprint is produced by the open-source
[FingerprintJS](https://github.com/fingerprintjs/fingerprintjs) project.
This repository provides an independent Django-focused integration layer around
that browser library. FingerprintJS and its branding belong to their respective
owners.

## 📄 License

This Django integration is released under the [MIT License](LICENSE).

