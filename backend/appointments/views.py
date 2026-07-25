import io
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import FileResponse
from django_filters.rest_framework import DjangoFilterBackend
from appointments.models import Appointment, Prescription
from appointments.serializers import (
    AppointmentSerializer, PrescriptionSerializer, CreatePrescriptionSerializer
)


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.select_related(
        'patient', 'doctor__user', 'doctor__specialization', 'hospital'
    ).prefetch_related('prescription').all()
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
            return Response(
                {"detail": "Date and time are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        appointment.date = new_date
        appointment.time = new_time
        appointment.status = Appointment.AppointmentStatus.UPCOMING
        appointment.save()
        return Response(AppointmentSerializer(appointment).data)


class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.select_related(
        'appointment__patient', 'appointment__doctor__user', 'appointment__hospital'
    ).all()
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return self.queryset.filter(appointment__patient=user)
        elif user.role == 'doctor':
            return self.queryset.filter(appointment__doctor__user=user)
        return self.queryset

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return CreatePrescriptionSerializer
        return PrescriptionSerializer

    def perform_create(self, serializer):
        """Mark appointment as completed when a prescription is issued."""
        prescription = serializer.save()
        apt = prescription.appointment
        if apt.status == Appointment.AppointmentStatus.UPCOMING:
            apt.status = Appointment.AppointmentStatus.COMPLETED
            apt.save(update_fields=['status'])

    @action(detail=True, methods=['get'], url_path='download')
    def download(self, request, pk=None):
        """
        Generate and return a PDF of the prescription.
        GET /api/prescriptions/<id>/download/
        """
        prescription = self.get_object()
        try:
            from appointments.pdf_utils import generate_prescription_pdf
            pdf_bytes = generate_prescription_pdf(prescription)
            buffer = io.BytesIO(pdf_bytes)
            filename = f"PurniaCare_Rx_{str(prescription.id)[:8].upper()}.pdf"
            response = FileResponse(
                buffer,
                content_type='application/pdf',
            )
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
        except ImportError as e:
            return Response(
                {"detail": f"PDF generation unavailable: {e}. Install reportlab."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            return Response(
                {"detail": f"PDF generation failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
