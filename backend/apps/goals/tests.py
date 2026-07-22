from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import GoalItem

class GoalItemAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='goal_operator', email='goals@momentum.cyber', password='Pass123!')
        self.goal = GoalItem.objects.create(
            user=self.user,
            title='JLPT N2 Language Target',
            target_metric='Kanji Drills',
            current_progress=40.0,
            target_value=100.0,
            category='Japan Relocation'
        )

    def test_goals_list(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/goals/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_goal_validation(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            'title': 'IELTS Band 8.5',
            'target_metric': 'Writing Task 2',
            'target_value': 100,
            'current_progress': 80,
            'category': 'IELTS',
            'deadline': 'Q4 2026'
        }
        response = self.client.post('/api/goals/', payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'IELTS Band 8.5')
