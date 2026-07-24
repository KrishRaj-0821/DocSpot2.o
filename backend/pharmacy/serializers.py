from rest_framework import serializers
from pharmacy.models import MedicineOrder, OrderItem, PharmacyProfile
from medicines.serializers import MedicineSerializer

class PharmacyProfileSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = PharmacyProfile
        fields = [
            'id', 'user', 'user_name', 'name', 'owner_name', 
            'drug_license_number', 'gst_number', 'address', 'city', 
            'phone', 'email', 'store_timings', 'home_delivery_available', 
            'logo', 'kyc_status', 'delivery_charges', 'bank_name', 
            'bank_account_number', 'bank_ifsc'
        ]
        read_only_fields = ['id', 'user', 'kyc_status']

class OrderItemSerializer(serializers.ModelSerializer):
    medicine_details = MedicineSerializer(source='medicine', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'medicine', 'medicine_details', 'quantity', 'price', 'discount']

class MedicineOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    pharmacy_details = PharmacyProfileSerializer(source='pharmacy', read_only=True)

    class Meta:
        model = MedicineOrder
        fields = [
            'id', 'user', 'user_name', 'pharmacy', 'pharmacy_details', 'date', 
            'subtotal', 'tax', 'delivery_charge', 'total', 'status', 
            'payment_method', 'address', 'prescription_image', 'items'
        ]
        read_only_fields = ['user', 'date', 'subtotal', 'tax', 'total']
