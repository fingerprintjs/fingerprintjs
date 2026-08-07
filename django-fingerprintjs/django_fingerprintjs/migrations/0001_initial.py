from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True
    dependencies = [migrations.swappable_dependency(settings.AUTH_USER_MODEL)]
    operations = [
        migrations.CreateModel(
            name="BrowserFingerprint",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("visitor_id", models.CharField(db_index=True, max_length=64)),
                ("first_seen_at", models.DateTimeField(auto_now_add=True)),
                ("last_seen_at", models.DateTimeField(auto_now=True)),
                ("last_ip", models.GenericIPAddressField(blank=True, null=True)),
                ("user_agent", models.CharField(blank=True, max_length=512)),
                ("user", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="browser_fingerprints", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ("-last_seen_at",)},
        ),
        migrations.AddConstraint(
            model_name="browserfingerprint",
            constraint=models.UniqueConstraint(fields=("visitor_id", "user"), name="django_fpjs_unique_visitor_user"),
        ),
        migrations.AddConstraint(
            model_name="browserfingerprint",
            constraint=models.UniqueConstraint(condition=models.Q(("user__isnull", True)), fields=("visitor_id",), name="django_fpjs_unique_anonymous_visitor"),
        ),
    ]
