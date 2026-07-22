from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import TaskItem

class TaskItemAPITestCase(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(username='operator_a', email='a@momentum.cyber', password='Pass123!')
        self.user_b = User.objects.create_user(username='operator_b', email='b@momentum.cyber', password='Pass123!')

        self.task_a = TaskItem.objects.create(
            user=self.user_a,
            title='Zero-Trust Security Audit',
            status='TODO',
            priority='CRITICAL',
            category='Cybersecurity'
        )
        self.task_b = TaskItem.objects.create(
            user=self.user_b,
            title='Private Task B',
            status='TODO',
            priority='LOW',
            category='Personal'
        )

    def test_tasks_list_owner_isolation(self):
        """Verify User A can ONLY see their own tasks and cannot view User B's tasks."""
        self.client.force_authenticate(user=self.user_a)
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        task_titles = [t['title'] for t in results]
        self.assertIn('Zero-Trust Security Audit', task_titles)
        self.assertNotIn('Private Task B', task_titles)

    def test_create_task(self):
        self.client.force_authenticate(user=self.user_a)
        payload = {
            'title': 'Implement GZip Middleware',
            'status': 'IN_PROGRESS',
            'priority': 'HIGH',
            'category': 'Backend',
            'estimated_minutes': 45
        }
        response = self.client.post('/api/tasks/', payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Implement GZip Middleware')

    def test_cannot_access_other_user_task(self):
        """Verify User A receives HTTP 404/403 when requesting User B's task directly by ID."""
        self.client.force_authenticate(user=self.user_a)
        response = self.client.get(f'/api/tasks/{self.task_b.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
