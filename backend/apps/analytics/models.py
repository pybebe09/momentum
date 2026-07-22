from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
import django.utils.timezone

class AnalyticsTelemetry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='analytics_records')
    date = models.DateField(default=django.utils.timezone.now, db_index=True)
    focus_hours = models.FloatField(default=0.0, validators=[MinValueValidator(0.0)])
    study_hours = models.FloatField(default=0.0, validators=[MinValueValidator(0.0)])
    tasks_completed = models.PositiveIntegerField(default=0)
    momentum_score = models.PositiveIntegerField(
        default=90,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    efficiency_index = models.FloatField(
        default=90.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)]
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']
        verbose_name_plural = "Analytics Telemetries"
        indexes = [
            models.Index(fields=['user', 'date']),
        ]
        constraints = [
            models.UniqueConstraint(fields=['user', 'date'], name='unique_user_daily_telemetry'),
        ]

    def __str__(self):
        return f"Analytics {self.date} ({self.user.username}) - Momentum: {self.momentum_score}"
