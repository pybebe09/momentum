from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from apps.tasks.models import TaskItem
from .models import FocusSession

class FocusSessionAPITestCase(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(username='focus_a', email='fa@momentum.cyber', password='Pass123!')
        self.user_b = User.objects.create_user(username='focus_b', email='fb@momentum.cyber', password='Pass123!')

        self.task_b = TaskItem.objects.create(
            user=self.user_b,
            title='User B Task',
            category='Private'
        )

    def test_focus_session_idor_prevention(self):
        """Verify User A CANNOT link a focus session to User B's task ID (IDOR protection test)."""
        self.client.force_authenticate(user=self.user_a)
        payload = {
            'title': 'Deep Work Cycle 1',
            'duration_minutes': 45,
            'session_type': 'DEEP_WORK',
            'task': self.task_b.id
        }
        response = self.client.post('/api/focus/', payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        details = response.data.get('details', response.data)
        self.assertIn('task', details)
