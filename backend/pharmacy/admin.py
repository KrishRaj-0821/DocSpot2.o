from django.contrib import admin
from .models import MedicineOrder, OrderItem

admin.site.register(MedicineOrder)
admin.site.register(OrderItem)

