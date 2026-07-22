from rest_framework import serializers
from doctors.models import DoctorProfile, Review
from accounts.serializers import UserSerializer

class ReviewSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.first_name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'patient', 'patient_name', 'rating', 'comment', 'created_at']

class DoctorProfileSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    specialization_name = serializers.CharField(source='specialization.name', read_only=True)
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    rating = serializers.SerializerMethodField()

    class Meta:
        model = DoctorProfile
        fields = [
            'id', 'user_details', 'specialization', 'specialization_name', 
            'qualification', 'experience', 'fees', 'hospital', 
            'hospital_name', 'available_days', 'available_time', 
            'is_verified', 'description', 'reviews', 'rating'
        ]

    def get_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return 4.5
        return sum([r.rating for r in reviews]) / len(reviews)
