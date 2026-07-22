from rest_framework import serializers
from diagnostics.models import DiagnosticCenter, DiagnosticTest, TestBooking
from accounts.serializers import UserSerializer

class DiagnosticCenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiagnosticCenter
        fields = ['id', 'name', 'address', 'city', 'phone', 'email', 'rating', 'image']

class DiagnosticTestSerializer(serializers.ModelSerializer):
    center_details = DiagnosticCenterSerializer(source='center', read_only=True)

    class Meta:
        model = DiagnosticTest
        fields = [
            'id', 'center', 'center_details', 'name', 'description', 
            'category', 'price', 'others_avg_price', 'duration', 'instructions'
        ]

class TestBookingSerializer(serializers.ModelSerializer):
    test_details = DiagnosticTestSerializer(source='test', read_only=True)
    patient_details = UserSerializer(source='patient', read_only=True)

    class Meta:
        model = TestBooking
        fields = ['id', 'patient', 'patient_details', 'test', 'test_details', 'date', 'status', 'prescription_file']
        read_only_fields = ['patient', 'status']
