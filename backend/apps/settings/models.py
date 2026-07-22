from django.db import models
from django.contrib.auth.models import User

class UserSettings(models.Model):
    THEME_CHOICES = [
        ('dark', 'Dark Cyber Mode'),
        ('light', 'Apple Light Minimal'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    theme = models.CharField(max_length=20, choices=THEME_CHOICES, default='dark')
    language = models.CharField(max_length=20, default='en-US')
    timezone = models.CharField(max_length=50, default='UTC')
    email_digest = models.BooleanField(default=True)
    task_reminders = models.BooleanField(default=True)
    focus_alarms = models.BooleanField(default=True)
    private_profile = models.BooleanField(default=True)
    share_telemetry = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "User Settings"
        indexes = [
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f"Settings for {self.user.username}"
