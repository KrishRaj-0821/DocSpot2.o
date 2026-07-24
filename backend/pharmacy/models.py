from django.db import models
from django.conf import settings
from common.models import BasePurniaModel
from medicines.models import Medicine

class PharmacyProfile(BasePurniaModel):
    class KycStatus(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        APPROVED = 'Approved', 'Approved'
        REJECTED = 'Rejected', 'Rejected'

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='pharmacy_profile')
    name = models.CharField(max_length=200, db_index=True)
    owner_name = models.CharField(max_length=100)
    drug_license_number = models.CharField(max_length=50)
    gst_number = models.CharField(max_length=50)
    address = models.TextField()
    city = models.CharField(max_length=50, default='Purnia', db_index=True)
    phone = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    store_timings = models.CharField(max_length=100, default='9:00 AM - 9:00 PM')
    home_delivery_available = models.BooleanField(default=True)
    logo = models.URLField(max_length=500, blank=True, null=True, default='https://images.unsplash.com/photo-1607619056574-7b8f304b3b8f?auto=format&fit=crop&q=80&w=150')
    kyc_status = models.CharField(max_length=20, choices=KycStatus.choices, default=KycStatus.PENDING)
    delivery_charges = models.DecimalField(max_digits=10, decimal_places=2, default=30)
    bank_name = models.CharField(max_length=100, blank=True, null=True)
    bank_account_number = models.CharField(max_length=50, blank=True, null=True)
    bank_ifsc = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'purnia_pharmacy_profiles'

    def __str__(self):
        return self.name

class MedicineOrder(BasePurniaModel):
    class OrderStatus(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        IN_TRANSIT = 'In Transit', 'In Transit'
        DELIVERED = 'Delivered', 'Delivered'
        CANCELLED = 'Cancelled', 'Cancelled'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='medicine_orders')
    pharmacy = models.ForeignKey(PharmacyProfile, on_delete=models.CASCADE, related_name='orders', null=True, blank=True)
    date = models.DateField(auto_now_add=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery_charge = models.DecimalField(max_digits=10, decimal_places=2, default=30)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=30, choices=OrderStatus.choices, default=OrderStatus.PENDING)
    payment_method = models.CharField(max_length=50, default='Cash on Delivery')
    address = models.TextField()
    prescription_image = models.URLField(max_length=500, blank=True, null=True)

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
