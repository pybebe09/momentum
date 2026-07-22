from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class GoalItem(models.Model):
    STATUS_CHOICES = [
        ('ON_TRACK', 'On Track'),
        ('AT_RISK', 'At Risk'),
        ('COMPLETED', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    target_metric = models.CharField(max_length=150, default='Target Milestone Progress')
    current_progress = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)]
    )
    target_value = models.FloatField(default=100.0, validators=[MinValueValidator(1.0)])
    unit = models.CharField(max_length=50, default='%')
    deadline = models.CharField(max_length=50, default='Q4 2026')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ON_TRACK', db_index=True)
    category = models.CharField(max_length=100, default='Cybersecurity', db_index=True)
    milestones = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['user', 'category']),
        ]

    def __str__(self):
        return f"{self.title} ({self.current_progress}/{self.target_value} {self.unit})"
