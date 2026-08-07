import hashlib
import hmac

from django.conf import settings

from .conf import setting


def normalize_visitor_id(value):
    if not isinstance(value, str):
        raise ValueError("visitor_id must be a string")
    value = value.strip()
    if not value or len(value) > 128:
        raise ValueError("visitor_id must contain between 1 and 128 characters")
    return value


def storage_visitor_id(value):
    value = normalize_visitor_id(value)
    if not setting("HASH_VISITOR_IDS"):
        return value
    return hmac.new(
        settings.SECRET_KEY.encode(), value.encode(), hashlib.sha256
    ).hexdigest()


def client_ip(request):
    if not setting("CAPTURE_IP"):
        return None
    # REMOTE_ADDR is intentionally used by default. Applications behind a
    # trusted proxy should normalize it before Django receives the request.
    return request.META.get("REMOTE_ADDR") or None

