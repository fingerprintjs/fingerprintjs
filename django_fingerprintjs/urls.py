from django.urls import path

from . import views


app_name = "django_fingerprintjs"

urlpatterns = [
    path("register/", views.register, name="register"),
]

