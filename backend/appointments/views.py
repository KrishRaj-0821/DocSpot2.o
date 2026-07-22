from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from appointments.models import Appointment, Prescription
from appointments.serializers import AppointmentSerializer, PrescriptionSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'date']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return self.queryset.filter(patient=user)
        elif user.role == 'doctor':
            return self.queryset.filter(doctor__user=user)
        elif user.role == 'hospital_admin':
            return self.queryset.filter(hospital__email=user.email)
        return self.queryset

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = Appointment.AppointmentStatus.CANCELLED
        appointment.save()
        return Response({"message": "Appointment cancelled successfully"})

    @action(detail=True, methods=['post'])
    def reschedule(self, request, pk=None):
        appointment = self.get_object()
        new_date = request.data.get('date')
        new_time = request.data.get('time')
        if not new_date or not new_time:
            return Response({"detail": "Date and time are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        appointment.date = new_date
        appointment.time = new_time
        appointment.status = Appointment.AppointmentStatus.UPCOMING
        appointment.save()
        return Response(AppointmentSerializer(appointment).data)

class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return self.queryset.filter(appointment__patient=user)
        elif user.role == 'doctor':
            return self.queryset.filter(appointment__doctor__user=user)
        return self.queryset
