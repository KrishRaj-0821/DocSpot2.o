from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from common.models import BasePurniaModel

class Role(models.TextChoices):
    SUPER_ADMIN = 'super_admin', 'Super Admin'
    HOSPITAL_ADMIN = 'hospital_admin', 'Hospital Admin'
    DOCTOR = 'doctor', 'Doctor'
    PATIENT = 'patient', 'Patient'
    DIAGNOSTIC_ADMIN = 'diagnostic_admin', 'Diagnostic Admin'
    PHARMACY_ADMIN = 'pharmacy_admin', 'Pharmacy Admin'
    DELIVERY_PARTNER = 'delivery_partner', 'Delivery Partner'
    AMBULANCE_DRIVER = 'ambulance_driver', 'Ambulance Driver'


class User(AbstractUser):
    role = models.CharField(
        max_length=30, 
        choices=Role.choices, 
        default=Role.PATIENT,
        db_index=True
    )
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=50, default='Purnia', db_index=True)
    avatar = models.URLField(
        max_length=500, 
        default='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
    )
    
    # Patient attributes
    blood_group = models.CharField(max_length=10, blank=True, null=True)
    dob = models.DateField(blank=True, null=True)

    class Meta:
        db_table = 'purnia_users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['username']),
        ]

    def __str__(self):
        return f"{self.username} ({self.role})"

class OTP(BasePurniaModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otps')
    code = models.CharField(max_length=6)
    expires_at = models.DateTimeField()
    is_verified = models.BooleanField(default=False)

    class Meta:
        db_table = 'purnia_otps'

    def is_expired(self):
        return timezone.now() > self.expires_at
