from rest_framework import serializers
from pharmacy.models import MedicineOrder, OrderItem
from medicines.serializers import MedicineSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    medicine_details = MedicineSerializer(source='medicine', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'medicine', 'medicine_details', 'quantity', 'price', 'discount']

class MedicineOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = MedicineOrder
        fields = [
            'id', 'user', 'user_name', 'date', 'subtotal', 'tax', 
            'delivery_charge', 'total', 'status', 'payment_method', 
            'address', 'items'
        ]
        read_only_fields = ['user', 'date', 'subtotal', 'tax', 'total', 'status']
