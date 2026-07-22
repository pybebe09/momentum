from django.db import models
from django.contrib.auth.models import User

class NotificationItem(models.Model):
    NOTIFICATION_TYPES = [
        ('TASK_DUE', 'Task Due'),
        ('FOCUS_ALARM', 'Focus Alarm'),
        ('SECURITY_ALERT', 'Security Alert'),
        ('GOAL_MILESTONE', 'Goal Milestone'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES, default='TASK_DUE', db_index=True)
    is_read = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['user', 'created_at']),
        ]

    def __str__(self):
        return f"[{self.notification_type}] {self.title} - {self.user.username}"
