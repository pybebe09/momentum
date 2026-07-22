from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
import django.utils.timezone

class JournalEntry(models.Model):
    MOOD_CHOICES = [
        ('OPTIMAL', 'Optimal'),
        ('FOCUSED', 'Focused'),
        ('FATIGUED', 'Fatigued'),
        ('STRESSED', 'Stressed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='journal_entries')
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)
    question_1 = models.TextField(blank=True)
    question_2 = models.TextField(blank=True)
    question_3 = models.TextField(blank=True)
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES, default='FOCUSED', db_index=True)
    energy_level = models.PositiveIntegerField(
        default=8,
        validators=[MinValueValidator(1), MaxValueValidator(10)]
    )
    tags = models.JSONField(default=list, blank=True)
    entry_date = models.DateField(default=django.utils.timezone.now, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-entry_date', '-created_at']
        indexes = [
            models.Index(fields=['user', 'entry_date']),
            models.Index(fields=['user', 'mood']),
        ]
        constraints = [
            models.UniqueConstraint(fields=['user', 'entry_date'], name='unique_user_daily_journal'),
        ]

    def __str__(self):
        return f"{self.title} ({self.entry_date})"
