from django.db import models
from django.conf import settings
from common.models import BasePurniaModel
from medicines.models import Medicine

class MedicineOrder(BasePurniaModel):
    class OrderStatus(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        IN_TRANSIT = 'In Transit', 'In Transit'
        DELIVERED = 'Delivered', 'Delivered'
        CANCELLED = 'Cancelled', 'Cancelled'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='medicine_orders')
    date = models.DateField(auto_now_add=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery_charge = models.DecimalField(max_digits=10, decimal_places=2, default=30)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=30, choices=OrderStatus.choices, default=OrderStatus.PENDING)
    payment_method = models.CharField(max_length=50, default='Cash on Delivery')
    address = models.TextField()

    class Meta:
        db_table = 'purnia_medicine_orders'
        indexes = [
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"

class OrderItem(BasePurniaModel):
    order = models.ForeignKey(MedicineOrder, on_delete=models.CASCADE, related_name='items')
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE, related_name='order_items')
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.IntegerField(default=0)  # discount percent at purchase

    class Meta:
        db_table = 'purnia_medicine_order_items'
