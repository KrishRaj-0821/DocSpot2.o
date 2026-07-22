from rest_framework import serializers
from ambulance.models import Ambulance, AmbulanceBooking
from accounts.serializers import UserSerializer

class AmbulanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambulance
        fields = [
            'id', 'type', 'driver_name', 'vehicle_number', 'phone', 
            'status', 'charge_per_km', 'eta_minutes', 'location_name'
        ]

class AmbulanceBookingSerializer(serializers.ModelSerializer):
    ambulance_details = AmbulanceSerializer(source='ambulance', read_only=True)
    patient_details = UserSerializer(source='patient', read_only=True)

    class Meta:
        model = AmbulanceBooking
        fields = [
            'id', 'patient', 'patient_details', 'ambulance', 'ambulance_details', 
            'pickup_location', 'destination_hospital', 'status', 'date'
        ]
        read_only_fields = ['patient', 'status']
