from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import UserProfile

class AuthenticationModelTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test_operator', email='test@momentum.cyber', password='SecurePass123!')

    def test_user_profile_creation(self):
        profile, created = UserProfile.objects.get_or_create(user=self.user, auth_provider='EMAIL')
        self.assertEqual(profile.user.username, 'test_operator')
        self.assertFalse(profile.is_email_verified)

    def test_token_generation(self):
        profile = UserProfile.objects.create(user=self.user)
        email_token = profile.generate_email_token()
        reset_token = profile.generate_reset_token()
        self.assertIsNotNone(email_token)
        self.assertIsNotNone(reset_token)
        self.assertIsNotNone(profile.password_reset_expires_at)


class AuthenticationAPITestCase(APITestCase):
    def test_registration_success(self):
        payload = {
            'username': 'new_operator',
            'email': 'new@momentum.cyber',
            'password': 'StrongPass123!',
        }
        response = self.client.post('/api/auth/register/', payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])

    def test_login_success(self):
        User.objects.create_user(username='login_user', email='login@momentum.cyber', password='SecretPass123!')
        payload = {
            'email_or_username': 'login_user',
            'password': 'SecretPass123!',
        }
        response = self.client.post('/api/auth/login/', payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)

    def test_login_invalid_credentials(self):
        payload = {
            'email_or_username': 'nonexistent',
            'password': 'WrongPassword!',
        }
        response = self.client.post('/api/auth/login/', payload)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
