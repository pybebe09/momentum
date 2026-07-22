from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
import uuid

class UserProfile(models.Model):
    AUTH_PROVIDERS = [
        ('EMAIL', 'Email'),
        ('GOOGLE', 'Google'),
        ('APPLE', 'Apple'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    is_email_verified = models.BooleanField(default=False, db_index=True)
    email_verification_token = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    password_reset_token = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    password_reset_expires_at = models.DateTimeField(blank=True, null=True)
    avatar_url = models.URLField(max_length=500, blank=True, null=True)
    auth_provider = models.CharField(max_length=20, choices=AUTH_PROVIDERS, default='EMAIL', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['email_verification_token']),
            models.Index(fields=['password_reset_token']),
        ]

    def generate_email_token(self):
        token = str(uuid.uuid4())
        self.email_verification_token = token
        self.save()
        return token

    def generate_reset_token(self):
        token = str(uuid.uuid4())
        self.password_reset_token = token
        self.password_reset_expires_at = timezone.now() + timedelta(hours=1)
        self.save()
        return token

    def __str__(self):
        return f"{self.user.username}'s Profile ({self.auth_provider})"
