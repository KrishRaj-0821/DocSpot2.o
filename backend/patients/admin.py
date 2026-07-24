from django.contrib import admin
from .models import PatientProfile, MedicalRecord

admin.site.register(PatientProfile)
admin.site.register(MedicalRecord)


