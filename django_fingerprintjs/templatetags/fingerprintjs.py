from django import template
from django.middleware.csrf import get_token
from django.urls import reverse

from ..conf import setting


register = template.Library()


@register.inclusion_tag("django_fingerprintjs/loader.html", takes_context=True)
def fingerprintjs_loader(context, auto=True, consent=False):
    request = context.get("request")
    return {
        "auto": auto,
        "consent": consent,
        "endpoint": reverse("django_fingerprintjs:register"),
        "script_url": setting("SCRIPT_URL"),
        "cache_key": setting("CACHE_KEY"),
        "cache_ttl": setting("CACHE_TTL_SECONDS"),
        "csrf_token": get_token(request) if request is not None else "",
    }
