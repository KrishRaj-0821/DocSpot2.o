from rest_framework import serializers
from appointments.models import Appointment, Prescription
from doctors.serializers import DoctorProfileSerializer
from hospitals.serializers import HospitalProfileSerializer
from accounts.serializers import UserSerializer

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['id', 'notes', 'medicines']

class AppointmentSerializer(serializers.ModelSerializer):
    doctor_details = DoctorProfileSerializer(source='doctor', read_only=True)
    hospital_details = HospitalProfileSerializer(source='hospital', read_only=True)
    patient_details = UserSerializer(source='patient', read_only=True)
    prescription = PrescriptionSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'patient_details', 'doctor', 'doctor_details', 
            'hospital', 'hospital_details', 'date', 'time', 'reason', 
            'fees', 'status', 'online_consultation', 'prescription'
        ]
        read_only_fields = ['fees', 'status']

    def create(self, validated_data):
        # Automatically pull consultation fees from doctor profile
        doctor = validated_data['doctor']
        validated_data['fees'] = doctor.fees
        return super().create(validated_data)
