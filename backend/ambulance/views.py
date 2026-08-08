from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from ambulance.models import Ambulance, AmbulanceBooking
from ambulance.serializers import AmbulanceSerializer, AmbulanceBookingSerializer

class AmbulanceViewSet(viewsets.ModelViewSet):
    queryset = Ambulance.objects.all()
    serializer_class = AmbulanceSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'type']

class AmbulanceBookingViewSet(viewsets.ModelViewSet):
    queryset = AmbulanceBooking.objects.select_related('patient', 'ambulance').all() # Optimized: Added select_related to prevent N+1 queries
    serializer_class = AmbulanceBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return self.queryset.filter(patient=user)
        return self.queryset

    def create(self, request, *args, **kwargs):
        pickup = request.data.get('pickup_location')
        dest = request.data.get('destination_hospital')
        amb_type = request.data.get('ambulance_type')

        if not pickup or not dest:
            return Response({"detail": "Pickup and drop locations are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Match nearest available ambulance of requested type
        ambulances = Ambulance.objects.filter(status=Ambulance.AmbulanceStatus.AVAILABLE)
        if amb_type:
            ambulances = ambulances.filter(type=amb_type)
        
        amb = ambulances.first()
        if not amb:
            # Fallback to any available
            amb = Ambulance.objects.filter(status=Ambulance.AmbulanceStatus.AVAILABLE).first()
        
        if not amb:
            return Response({"detail": "All ambulances are currently busy. Please call emergency hotline 911."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # Book
        amb.status = Ambulance.AmbulanceStatus.ON_TRIP
        amb.save()

        booking = AmbulanceBooking.objects.create(
            patient=request.user,
            ambulance=amb,
            pickup_location=pickup,
            destination_hospital=dest
        )

        return Response(AmbulanceBookingSerializer(booking).data, status=status.HTTP_201_CREATED)
