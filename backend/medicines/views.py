from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from medicines.models import MedicineCategory, Medicine
from medicines.serializers import MedicineCategorySerializer, MedicineSerializer

class MedicineCategoryViewSet(viewsets.ModelViewSet):
    queryset = MedicineCategory.objects.all()
    serializer_class = MedicineCategorySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'brand']
    search_fields = ['name', 'brand', 'description']
    ordering_fields = ['price', 'discount']

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'pharmacy_admin':
            pharm = getattr(user, 'pharmacy_profile', None)
            if pharm:
                return self.queryset.filter(pharmacy=pharm)
            return self.queryset.none()
        return self.queryset

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_authenticated and user.role == 'pharmacy_admin':
            pharm = getattr(user, 'pharmacy_profile', None)
            serializer.save(pharmacy=pharm)
        else:
            serializer.save()
