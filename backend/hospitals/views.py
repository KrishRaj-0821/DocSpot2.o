from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from hospitals.models import HospitalProfile, Department, Bed
from hospitals.serializers import HospitalProfileSerializer, DepartmentSerializer, BedSerializer

class HospitalProfileViewSet(viewsets.ModelViewSet):
    # Fix N+1 query issue when serializing nested departments and facilities
    queryset = HospitalProfile.objects.prefetch_related("hospital_departments__department", "facilities").all()
    serializer_class = HospitalProfileSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['city']
    search_fields = ['name', 'address', 'city']
    ordering_fields = ['rating', 'beds_count']

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class BedViewSet(viewsets.ModelViewSet):
    queryset = Bed.objects.all()
    serializer_class = BedSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['hospital', 'is_occupied', 'bed_type']
