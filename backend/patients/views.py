from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from patients.models import PatientProfile, MedicalRecord
from patients.serializers import PatientProfileSerializer, MedicalRecordSerializer

class PatientProfileViewSet(viewsets.ModelViewSet):
    queryset = PatientProfile.objects.select_related('user').prefetch_related('medical_records').all() # Optimized: Added select_related/prefetch_related to prevent N+1 queries
    serializer_class = PatientProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return self.queryset.filter(user=user)
        return self.queryset

class MedicalRecordViewSet(viewsets.ModelViewSet):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['record_type']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return self.queryset.filter(patient__user=user)
        return self.queryset

    def perform_create(self, serializer):
        # Auto-match to patient profile
        patient_profile = PatientProfile.objects.get(user=self.request.user)
        serializer.save(patient=patient_profile)
