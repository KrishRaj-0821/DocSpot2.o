import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from appointments.models import Appointment
import datetime
import random
import string

for apt in Appointment.objects.all():
    if not apt.appointment_id:
        date_str = datetime.date.today().strftime("%Y%m%d")
        random_str = ''.join(random.choices(string.digits, k=5))
        apt.appointment_id = f"PC-AP-{date_str}-{random_str}"
        apt.save(update_fields=['appointment_id'])
print("Fixed existing appointments")
