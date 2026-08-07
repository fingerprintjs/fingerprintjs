from django.conf import settings


DEFAULTS = {
    "SCRIPT_URL": "https://openfpcdn.io/fingerprintjs/v5",
    "HASH_VISITOR_IDS": True,
    "CAPTURE_IP": False,
    "REQUIRE_AUTHENTICATION": False,
    "SESSION_KEY": "django_fingerprintjs_id",
    "CACHE_KEY": "django-fingerprintjs-registered",
    "CACHE_TTL_SECONDS": 86400,
}


def setting(name):
    return getattr(settings, "FINGERPRINTJS", {}).get(name, DEFAULTS[name])

