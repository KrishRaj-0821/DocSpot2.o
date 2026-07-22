from django.db import models
from django.conf import settings
from common.models import BasePurniaModel

class Ambulance(BasePurniaModel):
    class AmbulanceType(models.TextChoices):
        BLS = 'Basic Life Support (BLS)', 'Basic Life Support (BLS)'
        ALS = 'Advanced Life Support (ALS)', 'Advanced Life Support (ALS)'
        NEONATAL = 'Neonatal/Pediatric Ambulance', 'Neonatal/Pediatric Ambulance'

    class AmbulanceStatus(models.TextChoices):
        AVAILABLE = 'Available', 'Available'
        ON_TRIP = 'On Trip', 'On Trip'

    type = models.CharField(max_length=50, choices=AmbulanceType.choices, default=AmbulanceType.BLS)
    driver_name = models.CharField(max_length=100)
    vehicle_number = models.CharField(max_length=20, unique=True)
    phone = models.CharField(max_length=15)
    status = models.CharField(max_length=30, choices=AmbulanceStatus.choices, default=AmbulanceStatus.AVAILABLE)
    charge_per_km = models.IntegerField(default=15)
    eta_minutes = models.IntegerField(default=15)
    location_name = models.CharField(max_length=200, default='Line Bazar')

    class Meta:
        db_table = 'purnia_ambulances'

    def __str__(self):
        return f"{self.type} - {self.vehicle_number} ({self.status})"

class AmbulanceBooking(BasePurniaModel):
    class BookingStatus(models.TextChoices):
        DISPATCHED = 'Dispatched', 'Dispatched'
        EN_ROUTE = 'En Route', 'En Route'
        ARRIVED = 'Arrived', 'Arrived'
        COMPLETED = 'Completed', 'Completed'

    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ambulance_bookings')
    ambulance = models.ForeignKey(Ambulance, on_delete=models.CASCADE, related_name='bookings')
    pickup_location = models.CharField(max_length=200)
    destination_hospital = models.CharField(max_length=200)
    status = models.CharField(max_length=30, choices=BookingStatus.choices, default=BookingStatus.DISPATCHED)
    date = models.DateField(auto_now_add=True)

    class Meta:
        db_table = 'purnia_ambulance_bookings'
