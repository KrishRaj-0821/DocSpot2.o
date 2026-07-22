from django.db import models
from django.conf import settings
from common.models import BasePurniaModel

class DiagnosticCenter(BasePurniaModel):
    name = models.CharField(max_length=200, db_index=True)
    address = models.TextField()
    city = models.CharField(max_length=50, default='Purnia', db_index=True)
    phone = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.5)
    image = models.URLField(max_length=500, blank=True, null=True)

    class Meta:
        db_table = 'purnia_diagnostic_centers'

    def __str__(self):
        return self.name

class DiagnosticTest(BasePurniaModel):
    center = models.ForeignKey(DiagnosticCenter, on_delete=models.CASCADE, related_name='tests')
    name = models.CharField(max_length=200, db_index=True)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, db_index=True)
    price = models.IntegerField()
    others_avg_price = models.IntegerField(blank=True, null=True)
    duration = models.CharField(max_length=100, default='Same Day')
    instructions = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'purnia_diagnostic_tests'

    def __str__(self):
        return self.name

class TestBooking(BasePurniaModel):
    class BookingStatus(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        COMPLETED = 'Completed', 'Completed'
        CANCELLED = 'Cancelled', 'Cancelled'

    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='test_bookings')
    test = models.ForeignKey(DiagnosticTest, on_delete=models.CASCADE, related_name='bookings')
    date = models.DateField(db_index=True)
    status = models.CharField(max_length=30, choices=BookingStatus.choices, default=BookingStatus.PENDING)
    prescription_file = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        db_table = 'purnia_diagnostic_bookings'
