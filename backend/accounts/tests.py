from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthenticationTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('auth_register')
        self.login_url = reverse('token_obtain_pair')
        self.profile_url = reverse('user_profile')
        
        self.user_data = {
            "username": "testpatient",
            "email": "test@DocSpot.com",
            "password": "strong_password123",
            "first_name": "Test",
            "last_name": "Patient",
            "phone": "+91 99999 99999"
        }

    def test_user_registration_and_jwt_generation(self):
        """
        Verify that patients can register and receive JWT authentication tokens.
        """
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['username'], 'testpatient')

    def test_jwt_token_login(self):
        """
        Verify that users can obtain JWT access tokens using their password.
        """
        # First register
        self.client.post(self.register_url, self.user_data, format='json')
        
        # Now try log in
        login_credentials = {
            "username": "testpatient",
            "password": "strong_password123"
        }
        response = self.client.post(self.login_url, login_credentials, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_authenticated_profile_retrieval(self):
        """
        Verify that profile details can be fetched using JWT Bearer headers.
        """
        # Register and obtain token
        reg_response = self.client.post(self.register_url, self.user_data, format='json')
        token = reg_response.data['token']
        
        # Retrieve profile
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test@DocSpot.com')
