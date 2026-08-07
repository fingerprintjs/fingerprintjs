import json

from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.http import require_POST

from .conf import setting
from .models import BrowserFingerprint
from .services import client_ip, storage_visitor_id


@require_POST
def register(request):
    if setting("REQUIRE_AUTHENTICATION") and not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)

    try:
        body = json.loads(request.body)
        visitor_id = storage_visitor_id(body.get("visitor_id"))
    except (json.JSONDecodeError, UnicodeDecodeError, ValueError):
        return JsonResponse({"error": "Invalid visitor_id"}, status=400)

    user = request.user if request.user.is_authenticated else None
    lookup = {"visitor_id": visitor_id, "user": user}
    fingerprint, created = BrowserFingerprint.objects.get_or_create(
        **lookup,
        defaults={
            "last_ip": client_ip(request),
            "user_agent": request.headers.get("User-Agent", "")[:512],
        },
    )
    if not created:
        fingerprint.last_seen_at = timezone.now()
        fingerprint.last_ip = client_ip(request)
        fingerprint.user_agent = request.headers.get("User-Agent", "")[:512]
        fingerprint.save(
            update_fields=("last_seen_at", "last_ip", "user_agent")
        )

    request.session[setting("SESSION_KEY")] = visitor_id
    return JsonResponse({"registered": True, "created": created})

