from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from hospitals.models import HospitalProfile, Department, HospitalDepartmentRelation, Facility

User = get_user_model()

class HospitalProfileViewSetTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpassword")

        self.hospital = HospitalProfile.objects.create(
            name="Test Hospital",
            address="123 Test St",
            city="Purnia",
            phone="1234567890",
            email="test@hospital.com",
            rating=4.5,
            beds_count=100
        )

        self.department = Department.objects.create(name="Cardiology")
        HospitalDepartmentRelation.objects.create(hospital=self.hospital, department=self.department)

        Facility.objects.create(hospital=self.hospital, name="24/7 ICU")

    def test_list_hospitals(self):
        response = self.client.get('/api/hospitals/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
        hospital_data = response.data['results'][0]
        self.assertEqual(hospital_data['name'], "Test Hospital")
        self.assertIn("Cardiology", hospital_data['departments'])
        self.assertEqual(hospital_data['facilities'][0]['name'], "24/7 ICU")
