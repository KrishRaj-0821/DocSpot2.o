from django.db import models
from django.conf import settings
from common.models import BasePurniaModel
from doctors.models import DoctorProfile
from hospitals.models import HospitalProfile

class Appointment(BasePurniaModel):
    class AppointmentStatus(models.TextChoices):
        UPCOMING = 'Upcoming', 'Upcoming'
        COMPLETED = 'Completed', 'Completed'
        CANCELLED = 'Cancelled', 'Cancelled'
        RESCHEDULED = 'Rescheduled', 'Rescheduled'

    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='appointments')
    hospital = models.ForeignKey(HospitalProfile, on_delete=models.CASCADE, related_name='appointments')
    date = models.DateField(db_index=True)
    time = models.CharField(max_length=20)
    reason = models.TextField()
    fees = models.IntegerField(default=500)
    status = models.CharField(max_length=30, choices=AppointmentStatus.choices, default=AppointmentStatus.UPCOMING)
    online_consultation = models.BooleanField(default=False)

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
    notes = models.TextField()
    medicines = models.JSONField(default=list)  # format: [{"name": "...", "dosage": "..."}]

    class Meta:
        db_table = 'purnia_prescriptions'
