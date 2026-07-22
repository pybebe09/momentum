from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.tasks.models import TaskItem

class FocusSession(models.Model):
    TYPE_CHOICES = [
        ('POMODORO', 'Pomodoro'),
        ('DEEP_WORK', 'Deep Work'),
        ('BREAK', 'Break'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='focus_sessions')
    task = models.ForeignKey(
        TaskItem,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='focus_sessions'
    )
    title = models.CharField(max_length=255)
    duration_minutes = models.PositiveIntegerField(default=25, validators=[MinValueValidator(1)])
    session_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='POMODORO', db_index=True)
    productivity_rating = models.PositiveIntegerField(
        default=5,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    completed_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-completed_at']
        indexes = [
            models.Index(fields=['user', 'completed_at']),
            models.Index(fields=['user', 'session_type']),
        ]

    def __str__(self):
        return f"{self.title} ({self.duration_minutes}m) - {self.user.username}"
