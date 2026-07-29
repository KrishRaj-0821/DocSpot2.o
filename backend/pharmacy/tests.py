from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from accounts.models import User, Role
from pharmacy.models import PharmacyProfile, MedicineOrder

class PharmacyViewSetTests(APITestCase):
    def setUp(self):
        # Create different users
        self.patient_user = User.objects.create_user(
            username='patient', email='patient@test.com', password='testpassword', role=Role.PATIENT
        )

        self.pharmacy_admin_1 = User.objects.create_user(
            username='admin1', email='admin1@test.com', password='testpassword', role=Role.PHARMACY_ADMIN
        )

        self.pharmacy_admin_2 = User.objects.create_user(
            username='admin2', email='admin2@test.com', password='testpassword', role=Role.PHARMACY_ADMIN
        )

        self.super_admin = User.objects.create_user(
            username='superadmin', email='superadmin@test.com', password='testpassword', role=Role.SUPER_ADMIN
        )

        # Create pharmacy profiles
        self.pharmacy_1 = PharmacyProfile.objects.create(
            user=self.pharmacy_admin_1,
            name="Pharmacy 1",
            owner_name="Owner 1",
            drug_license_number="DL-1",
            gst_number="GST-1",
            address="Address 1",
            phone="1234567890",
            email="pharmacy1@test.com"
        )

        self.pharmacy_2 = PharmacyProfile.objects.create(
            user=self.pharmacy_admin_2,
            name="Pharmacy 2",
            owner_name="Owner 2",
            drug_license_number="DL-2",
            gst_number="GST-2",
            address="Address 2",
            phone="0987654321",
            email="pharmacy2@test.com"
        )

        # Create medicine order
        self.order_1 = MedicineOrder.objects.create(
            user=self.patient_user,
            pharmacy=self.pharmacy_1,
            subtotal=100.0,
            tax=5.0,
            delivery_charge=30.0,
            total=135.0,
            address="Patient Address"
        )

        self.order_2 = MedicineOrder.objects.create(
            user=self.patient_user,
            pharmacy=self.pharmacy_2,
            subtotal=200.0,
            tax=10.0,
            delivery_charge=30.0,
            total=240.0,
            address="Patient Address"
        )

        self.order_urls_base = '/api/orders/'
        self.pharmacy_urls_base = '/api/pharmacies/'

    def test_pharmacy_profile_queryset_pharmacy_admin(self):
        self.client.force_authenticate(user=self.pharmacy_admin_1)
        response = self.client.get(self.pharmacy_urls_base)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only see their own profile
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['id'], self.pharmacy_1.id)

    def test_pharmacy_profile_queryset_patient(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.pharmacy_urls_base)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should see all profiles (since they aren't a pharmacy admin)
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 2)

    def test_medicine_order_queryset_patient(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(self.order_urls_base)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Patient should see all their orders
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 2)

    def test_medicine_order_queryset_pharmacy_admin(self):
        self.client.force_authenticate(user=self.pharmacy_admin_1)
        response = self.client.get(self.order_urls_base)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Pharmacy Admin 1 should only see order 1
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['id'], self.order_1.id)

    def test_medicine_order_queryset_pharmacy_admin_no_profile(self):
        # Create a pharmacy admin without a profile
        admin_no_profile = User.objects.create_user(
            username='admin3', email='admin3@test.com', password='testpassword', role=Role.PHARMACY_ADMIN
        )
        self.client.force_authenticate(user=admin_no_profile)
        response = self.client.get(self.order_urls_base)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should see no orders
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 0)

    def test_medicine_order_queryset_super_admin(self):
        self.client.force_authenticate(user=self.super_admin)
        response = self.client.get(self.order_urls_base)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should see all orders
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 2)
