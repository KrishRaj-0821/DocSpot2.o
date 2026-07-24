from django.contrib import admin
from .models import DiagnosticCenter, DiagnosticTest, TestBooking

admin.site.register(DiagnosticCenter)
admin.site.register(DiagnosticTest)
admin.site.register(TestBooking)

