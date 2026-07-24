from django.db import models
from common.models import BasePurniaModel

class MedicineCategory(BasePurniaModel):
    name = models.CharField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'purnia_medicine_categories'

    def __str__(self):
        return self.name

class Medicine(BasePurniaModel):
    name = models.CharField(max_length=200, db_index=True)
    category = models.ForeignKey(MedicineCategory, on_delete=models.CASCADE, related_name='medicines')
    pharmacy = models.ForeignKey('pharmacy.PharmacyProfile', on_delete=models.CASCADE, related_name='medicines', null=True, blank=True)
    brand = models.CharField(max_length=100, db_index=True)
    generic_name = models.CharField(max_length=200, blank=True, null=True)
    manufacturer = models.CharField(max_length=200, blank=True, null=True)
    batch_number = models.CharField(max_length=100, blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    mrp = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.IntegerField(default=0)  # discount percentage
    stock = models.IntegerField(default=100)
    dosage_instructions = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image = models.URLField(max_length=500, blank=True, null=True)
    prescription_required = models.BooleanField(default=False)

    class Meta:
        db_table = 'purnia_medicines'

    def __str__(self):
        return self.name
