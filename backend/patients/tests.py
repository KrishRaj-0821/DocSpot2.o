from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from patients.models import PatientProfile, MedicalRecord

User = get_user_model()

class PatientQuerysetTests(APITestCase):
    def setUp(self):
        # Create a patient user
        self.patient_user1 = User.objects.create_user(
            username='patient1',
            password='password123',
            role='patient'
        )
        self.patient_profile1 = PatientProfile.objects.create(user=self.patient_user1)

        self.patient_user2 = User.objects.create_user(
            username='patient2',
            password='password123',
            role='patient'
        )
        self.patient_profile2 = PatientProfile.objects.create(user=self.patient_user2)

        # Create an admin user
        self.admin_user = User.objects.create_user(
            username='admin1',
            password='password123',
            role='super_admin'
        )

        # Create medical records
        self.record1 = MedicalRecord.objects.create(
            patient=self.patient_profile1,
            title='Record 1',
            date='2023-01-01',
            record_type=MedicalRecord.RecordType.REPORT
        )

        self.record2 = MedicalRecord.objects.create(
            patient=self.patient_profile2,
            title='Record 2',
            date='2023-01-02',
            record_type=MedicalRecord.RecordType.PRESCRIPTION
        )

        self.patient_url = reverse('patient-list')
        self.record_url = reverse('medical-record-list')

    def test_patient_profile_get_queryset_for_patient(self):
        """
        Verify that a user with role 'patient' can only see their own profile.
        """
        self.client.force_authenticate(user=self.patient_user1)
        response = self.client.get(self.patient_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Assuming the API returns a paginated list or a direct list. We'll check the length.
        results = response.data['results'] if 'results' in response.data else response.data
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['user_details']['id'], self.patient_user1.id)

    def test_patient_profile_get_queryset_for_non_patient(self):
        """
        Verify that a user with non-'patient' role can see all profiles.
        """
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.patient_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results'] if 'results' in response.data else response.data
        self.assertEqual(len(results), 2)

    def test_medical_record_get_queryset_for_patient(self):
        """
        Verify that a user with role 'patient' can only see their own medical records.
        """
        self.client.force_authenticate(user=self.patient_user1)
        response = self.client.get(self.record_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results'] if 'results' in response.data else response.data
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['id'], self.record1.id)

    def test_medical_record_get_queryset_for_non_patient(self):
        """
        Verify that a user with non-'patient' role can see all medical records.
        """
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.record_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results'] if 'results' in response.data else response.data
        self.assertEqual(len(results), 2)
