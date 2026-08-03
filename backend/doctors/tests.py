from django.test import TestCase
from django.contrib.auth import get_user_model
from doctors.models import DoctorProfile, Review
from rest_framework.test import APIClient

class DoctorPerformanceTestCase(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user1 = User.objects.create(username="u1", role="doctor")
        self.user2 = User.objects.create(username="u2", role="patient")

        self.doctor1 = DoctorProfile.objects.create(user=self.user1, qualification="MBBS", experience=10, fees=500)
        Review.objects.create(doctor=self.doctor1, patient=self.user2, rating=5, comment="Great")

        self.client = APIClient()

    def test_doctor_profile_list(self):
        response = self.client.get('/api/doctors/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['user_details']['username'], 'u1')
