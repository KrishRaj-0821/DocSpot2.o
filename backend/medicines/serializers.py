from rest_framework import serializers
from medicines.models import MedicineCategory, Medicine

class MedicineCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicineCategory
        fields = ['id', 'name', 'description']

class MedicineSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Medicine
        fields = [
            'id', 'name', 'category', 'category_name', 'pharmacy', 'brand', 
            'generic_name', 'manufacturer', 'batch_number', 'expiry_date', 
            'purchase_price', 'mrp', 'price', 'discount', 'stock', 
            'dosage_instructions', 'description', 'image', 'prescription_required'
        ]
