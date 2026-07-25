from django.db import models
from django.conf import settings
from common.models import BasePurniaModel
from doctors.models import DoctorProfile
from hospitals.models import HospitalProfile, Department
class Appointment(BasePurniaModel):
    class AppointmentStatus(models.TextChoices):
        UPCOMING = 'Upcoming', 'Upcoming'
        CHECKED_IN = 'Checked In', 'Checked In'
        COMPLETED = 'Completed', 'Completed'
        CANCELLED = 'Cancelled', 'Cancelled'
        RESCHEDULED = 'Rescheduled', 'Rescheduled'

    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='appointments')
    hospital = models.ForeignKey(HospitalProfile, on_delete=models.CASCADE, related_name='appointments')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='appointments')
    appointment_id = models.CharField(max_length=50, unique=True, blank=True)
    date = models.DateField(db_index=True)
    time = models.CharField(max_length=20)
    reason = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    fees = models.IntegerField(default=500)
    status = models.CharField(max_length=30, choices=AppointmentStatus.choices, default=AppointmentStatus.UPCOMING)
    payment_status = models.CharField(max_length=20, default="Pending")
    online_consultation = models.BooleanField(default=False)
    token_number = models.IntegerField(null=True, blank=True)
    qr_code = models.ImageField(upload_to="qr_codes/", blank=True, null=True)
    pdf = models.FileField(upload_to="appointment_pdfs/", blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.appointment_id:
            import datetime
            import random
            import string
            date_str = datetime.date.today().strftime("%Y%m%d")
            random_str = ''.join(random.choices(string.digits, k=6))
            self.appointment_id = f"HMS-{date_str}-{random_str}"
        super().save(*args, **kwargs)


    class Meta:
        db_table = 'purnia_appointments'
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['date']),
        ]

    def __str__(self):
        return f"{self.patient.username} - {self.doctor.user.username} ({self.date})"


class Prescription(BasePurniaModel):
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='prescription')

    # Core clinical fields
    diagnosis = models.TextField(default='')
    notes = models.TextField(blank=True)
    advice = models.TextField(blank=True)
    follow_up_date = models.DateField(null=True, blank=True)

    # Structured JSON fields
    # medicines format: [{"name": "...", "dosage": "...", "frequency": "...", "duration": "..."}]
    medicines = models.JSONField(default=list)
    # tests format: ["CBC", "Dengue NS1", ...]
    tests = models.JSONField(default=list)

    class Meta:
        db_table = 'purnia_prescriptions'

    def __str__(self):
        return f"Rx for {self.appointment} — {self.diagnosis[:40]}"


class Medicine(BasePurniaModel):
    """
    Optional normalized medicine rows (alternative to JSONField).
    Used for advanced pharmacy integration and medicine ordering.
    """
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name='medicine_items')
    medicine_name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100, default='Once daily')
    duration = models.CharField(max_length=100, blank=True)

    class Meta:
        db_table = 'purnia_prescription_medicines'


class TestRecommendation(BasePurniaModel):
    """
    Optional normalized test rows (alternative to JSONField).
    Used for diagnostic booking integration.
    """
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name='test_items')
    test_name = models.CharField(max_length=200)

    class Meta:
        db_table = 'purnia_prescription_tests'
