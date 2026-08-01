from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from doctors.models import DoctorProfile, Review
from doctors.serializers import DoctorProfileSerializer, ReviewSerializer

class DoctorProfileViewSet(viewsets.ModelViewSet):
    # Optimized queryset to prevent N+1 query problem when serializing related fields
    # select_related fetches foreign keys (user, specialization, hospital) in the same query
    # prefetch_related fetches reverse relation (reviews) and its foreign key (patient) in 1 extra query
    queryset = DoctorProfile.objects.select_related(
        'user', 'specialization', 'hospital'
    ).prefetch_related('reviews__patient').all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['specialization', 'hospital', 'is_verified']
    search_fields = ['user__first_name', 'user__last_name', 'specialization__name', 'qualification']
    ordering_fields = ['experience', 'fees']

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['doctor']

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)
