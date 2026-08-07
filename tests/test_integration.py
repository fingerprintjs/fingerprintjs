import json

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.db import IntegrityError, transaction
from django.urls import reverse

from django_fingerprintjs.models import BrowserFingerprint
from django_fingerprintjs.services import storage_visitor_id


class RegisterTests(TestCase):
    def post(self, visitor_id="browser-id"):
        return self.client.post(
            reverse("django_fingerprintjs:register"),
            data=json.dumps({"visitor_id": visitor_id}),
            content_type="application/json",
        )

    def test_registers_a_hashed_anonymous_fingerprint(self):
        response = self.post()
        self.assertEqual(response.status_code, 200)
        fingerprint = BrowserFingerprint.objects.get()
        self.assertEqual(fingerprint.visitor_id, storage_visitor_id("browser-id"))
        self.assertIsNone(fingerprint.last_ip)
        self.assertEqual(
            self.client.session["django_fingerprintjs_id"], fingerprint.visitor_id
        )

    def test_repeat_registration_updates_existing_row(self):
        self.post()
        response = self.post()
        self.assertFalse(response.json()["created"])
        self.assertEqual(BrowserFingerprint.objects.count(), 1)

    def test_anonymous_visitor_is_unique(self):
        BrowserFingerprint.objects.create(visitor_id="same")
        with self.assertRaises(IntegrityError), transaction.atomic():
            BrowserFingerprint.objects.create(visitor_id="same")

    def test_rejects_invalid_input(self):
        response = self.client.post(
            reverse("django_fingerprintjs:register"),
            data="not-json",
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)

    @override_settings(FINGERPRINTJS={"REQUIRE_AUTHENTICATION": True})
    def test_can_require_authentication(self):
        self.assertEqual(self.post().status_code, 401)
        user = get_user_model().objects.create_user(username="person")
        self.client.force_login(user)
        self.assertEqual(self.post().status_code, 200)
        self.assertEqual(BrowserFingerprint.objects.get().user, user)
