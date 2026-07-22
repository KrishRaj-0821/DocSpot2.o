from rest_framework import serializers
from patients.models import PatientProfile, MedicalRecord
from accounts.serializers import UserSerializer

class MedicalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalRecord
        fields = ['id', 'patient', 'title', 'record_type', 'date', 'description', 'file_path']

class PatientProfileSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    medical_records = MedicalRecordSerializer(many=True, read_only=True)

    class Meta:
        model = PatientProfile
        fields = [
            'id', 'user_details', 'emergency_contact_name', 'emergency_contact_phone',
            'insurance_provider', 'insurance_policy_number', 'allergies', 
            'family_history', 'medical_records'
        ]
