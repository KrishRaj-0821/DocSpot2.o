from django.db import models
from django.conf import settings
from common.models import BasePurniaModel
from hospitals.models import HospitalProfile, Department

class DoctorProfile(BasePurniaModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='doctor_profile')
    specialization = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='doctors')
    qualification = models.CharField(max_length=200)
    experience = models.IntegerField(default=5)
    fees = models.IntegerField(default=500)
    hospital = models.ForeignKey(HospitalProfile, on_delete=models.SET_NULL, null=True, related_name='staff_doctors')
    available_days = models.JSONField(default=list)  # e.g., ["Mon", "Wed", "Fri"]
    available_time = models.CharField(max_length=100, default='10:00 AM - 01:00 PM')
    is_verified = models.BooleanField(default=False)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'purnia_doctors'
        indexes = [
            models.Index(fields=['is_verified']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.specialization}"

class Review(BasePurniaModel):
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='reviews')
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='written_reviews')
    rating = models.IntegerField(default=5)  # 1 to 5
    comment = models.TextField()

    class Meta:
        db_table = 'purnia_reviews'
