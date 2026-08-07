from django.urls import include, path

urlpatterns = [path("fingerprint/", include("django_fingerprintjs.urls"))]

