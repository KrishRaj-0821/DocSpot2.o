from django.db import models
from django.conf import settings
from common.models import BasePurniaModel
from appointments.models import Appointment
from pharmacy.models import MedicineOrder

class PaymentTransaction(BasePurniaModel):
    class PaymentStatus(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        SUCCESS = 'Success', 'Success'
        FAILED = 'Failed', 'Failed'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments')
    appointment = models.ForeignKey(Appointment, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    order = models.ForeignKey(MedicineOrder, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    transaction_id = models.CharField(max_length=100, unique=True, db_index=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    status = models.CharField(max_length=30, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'purnia_payments'

    def __str__(self):
        return f"Payment #{self.id} - {self.transaction_id} ({self.status})"

class Invoice(BasePurniaModel):
    payment = models.OneToOneField(PaymentTransaction, on_delete=models.CASCADE, related_name='invoice')
    invoice_number = models.CharField(max_length=100, unique=True, db_index=True)
    pdf_path = models.CharField(max_length=500, blank=True, null=True)
    generated_date = models.DateField(auto_now_add=True)

    class Meta:
        db_table = 'purnia_invoices'
