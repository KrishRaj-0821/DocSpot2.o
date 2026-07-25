from rest_framework import serializers
from appointments.models import Appointment, Prescription, Medicine, TestRecommendation
from doctors.serializers import DoctorProfileSerializer
from hospitals.serializers import HospitalProfileSerializer
from hospitals.models import HospitalProfile
from accounts.serializers import UserSerializer


class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = [
            'id', 'diagnosis', 'notes', 'advice',
            'follow_up_date', 'medicines', 'tests',
        ]


class AppointmentSerializer(serializers.ModelSerializer):
    doctor_details = DoctorProfileSerializer(source='doctor', read_only=True)
    hospital_details = HospitalProfileSerializer(source='hospital', read_only=True)
    patient_details = UserSerializer(source='patient', read_only=True)
    prescription = PrescriptionSerializer(read_only=True)

    hospital = serializers.PrimaryKeyRelatedField(
        queryset=HospitalProfile.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'patient_details', 'doctor', 'doctor_details',
            'hospital', 'hospital_details', 'date', 'time', 'reason',
            'fees', 'status', 'online_consultation', 'prescription'
        ]
        read_only_fields = ['fees', 'status']

    def create(self, validated_data):
        doctor = validated_data['doctor']
        # Set hospital automatically from doctor's profile if not provided
        if not validated_data.get('hospital') and doctor.hospital:
            validated_data['hospital'] = doctor.hospital
        # Automatically pull consultation fees from doctor profile
        validated_data['fees'] = doctor.fees
        return super().create(validated_data)


class CreatePrescriptionSerializer(serializers.ModelSerializer):
    """
    Serializer for doctors writing a new prescription.
    Accepts rich medicine list with frequency and duration.
    """
    class Meta:
        model = Prescription
        fields = [
            'appointment', 'diagnosis', 'notes', 'advice',
            'follow_up_date', 'medicines', 'tests',
        ]

    def validate_medicines(self, value):
        """Ensure each medicine entry has at least name and dosage."""
        if not isinstance(value, list):
            raise serializers.ValidationError("medicines must be a list.")
        for med in value:
            if not med.get('name') or not med.get('dosage'):
                raise serializers.ValidationError(
                    "Each medicine must have 'name' and 'dosage' fields."
                )
        return value
