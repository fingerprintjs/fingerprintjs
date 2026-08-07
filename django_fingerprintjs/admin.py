from django.contrib import admin

from .models import BrowserFingerprint


@admin.register(BrowserFingerprint)
class BrowserFingerprintAdmin(admin.ModelAdmin):
    list_display = ("visitor_id", "user", "first_seen_at", "last_seen_at")
    list_filter = ("first_seen_at", "last_seen_at")
    search_fields = ("visitor_id",)
    readonly_fields = ("first_seen_at", "last_seen_at")
