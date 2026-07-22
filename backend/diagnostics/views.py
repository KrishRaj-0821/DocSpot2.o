from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from diagnostics.models import DiagnosticCenter, DiagnosticTest, TestBooking
from diagnostics.serializers import DiagnosticCenterSerializer, DiagnosticTestSerializer, TestBookingSerializer

class DiagnosticCenterViewSet(viewsets.ModelViewSet):
    queryset = DiagnosticCenter.objects.all()
    serializer_class = DiagnosticCenterSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'address', 'city']

class DiagnosticTestViewSet(viewsets.ModelViewSet):
    queryset = DiagnosticTest.objects.all()
    serializer_class = DiagnosticTestSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'center']
    search_fields = ['name', 'description', 'category']

class TestBookingViewSet(viewsets.ModelViewSet):
    queryset = TestBooking.objects.all()
    serializer_class = TestBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return self.queryset.filter(patient=user)
        return self.queryset

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)
