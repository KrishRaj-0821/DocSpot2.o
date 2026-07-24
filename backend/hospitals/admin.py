from django.contrib import admin
from .models import HospitalProfile, Department, HospitalDepartmentRelation, Bed, Facility

admin.site.register(HospitalProfile)
admin.site.register(Department)
admin.site.register(HospitalDepartmentRelation)
admin.site.register(Bed)
admin.site.register(Facility)

