from django.conf import settings
from django.db import models


class BrowserFingerprint(models.Model):
    visitor_id = models.CharField(max_length=64, db_index=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        related_name="browser_fingerprints",
    )
    first_seen_at = models.DateTimeField(auto_now_add=True)
    last_seen_at = models.DateTimeField(auto_now=True)
    last_ip = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.CharField(max_length=512, blank=True)

    class Meta:
        ordering = ("-last_seen_at",)
        constraints = [
            models.UniqueConstraint(
                fields=("visitor_id", "user"),
                name="django_fpjs_unique_visitor_user",
            ),
            models.UniqueConstraint(
                fields=("visitor_id",),
                condition=models.Q(user__isnull=True),
                name="django_fpjs_unique_anonymous_visitor",
            ),
        ]

    def __str__(self):
        return self.visitor_id
