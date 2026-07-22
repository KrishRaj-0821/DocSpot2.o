from rest_framework import serializers
from hospitals.models import HospitalProfile, Department, Bed, Facility

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'description']

class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = ['id', 'name']

class BedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bed
        fields = ['id', 'room_number', 'bed_type', 'is_occupied']

class HospitalProfileSerializer(serializers.ModelSerializer):
    departments = serializers.SerializerMethodField()
    facilities = FacilitySerializer(many=True, read_only=True)

    class Meta:
        model = HospitalProfile
        fields = [
            'id', 'name', 'address', 'city', 'phone', 'email', 
            'rating', 'image', 'beds_count', 'description', 
            'departments', 'facilities'
        ]

    def get_departments(self, obj):
        relations = obj.hospital_departments.all()
        return [r.department.name for r in relations]
