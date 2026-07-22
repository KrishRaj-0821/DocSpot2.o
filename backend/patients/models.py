from django.db import models
from django.conf import settings
from common.models import BasePurniaModel

class PatientProfile(BasePurniaModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='patient_profile')
    emergency_contact_name = models.CharField(max_length=100, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=15, blank=True, null=True)
    insurance_provider = models.CharField(max_length=100, blank=True, null=True)
    insurance_policy_number = models.CharField(max_length=50, blank=True, null=True)
    allergies = models.TextField(blank=True, null=True)
    family_history = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'purnia_patients'

    def __str__(self):
        return self.user.username

class MedicalRecord(BasePurniaModel):
    class RecordType(models.TextChoices):
        PRESCRIPTION = 'prescription', 'Prescription'
        REPORT = 'report', 'Diagnostic Report'
        SCAN = 'scan', 'Radiology Scan'
        DISCHARGE = 'discharge', 'Discharge Summary'

    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='medical_records')
    title = models.CharField(max_length=200)
    record_type = models.CharField(max_length=30, choices=RecordType.choices, default=RecordType.REPORT)
    date = models.DateField()
    description = models.TextField(blank=True, null=True)
    file_path = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        db_table = 'purnia_medical_records'
        indexes = [
            models.Index(fields=['record_type']),
        ]
