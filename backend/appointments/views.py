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
        appointment = serializer.save(patient=self.request.user)
        import qrcode
        from io import BytesIO
        from django.core.files.base import ContentFile
        from appointments.appointment_pdf import generate_appointment_pdf

        # Generate QR
        verify_url = f"https://yourhospital.com/appointments/{appointment.appointment_id}"
        qr = qrcode.QRCode(version=1, box_size=10, border=4)
        qr.add_data(verify_url)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        qr_buffer = BytesIO()
        img.save(qr_buffer, format="PNG")
        appointment.qr_code.save(f"{appointment.appointment_id}_qr.png", ContentFile(qr_buffer.getvalue()), save=False)

        # Generate PDF
        try:
            pdf_bytes = generate_appointment_pdf(appointment)
            appointment.pdf.save(f"{appointment.appointment_id}.pdf", ContentFile(pdf_bytes), save=False)
        except Exception as e:
            print("Error generating PDF:", e)

        appointment.save()

    @action(detail=False, methods=['post'])
    def book(self, request):
        data = request.data.copy()
        if 'doctorId' in data:
            data['doctor'] = data.pop('doctorId')
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def my(self, request):
        return self.list(request)

    @action(detail=True, methods=['get'])
    def qr(self, request, pk=None):
        apt = self.get_object()
        # Use localhost for local dev verification
        verify_url = f"http://localhost:5173/appointment/{apt.appointment_id}"
        return Response({'qr_code_url': verify_url})

    @action(detail=False, methods=['get'], url_path=r'verify/(?P<appointment_id>[^/.]+)', permission_classes=[permissions.AllowAny])
    def verify(self, request, appointment_id=None):
        try:
            apt = Appointment.objects.get(appointment_id=appointment_id)
            
            # Protect patient information: Require authorised staff login
            if not request.user.is_authenticated or getattr(request.user, 'role', '') not in ['doctor', 'hospital_admin', 'receptionist']:
                return Response(
                    {"detail": "Authentication required. Please sign in with an authorised hospital account to view patient information.", "auth_required": True},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            # Calculate age
            age = None
            if apt.patient.dob:
                import datetime
                today = datetime.date.today()
                age = today.year - apt.patient.dob.year - ((today.month, today.day) < (apt.patient.dob.month, apt.patient.dob.day))

            data = {
                "appointment_id": apt.appointment_id,
                "patient_name": apt.patient.get_full_name() or apt.patient.username,
                "patient_id": f"PT-{apt.patient.id:06d}",
                "doctor_name": apt.doctor.user.get_full_name() or apt.doctor.user.username,
                "department": apt.department.name if apt.department else apt.doctor.specialization,
                "date": apt.date,
                "time": apt.time,
                "token_number": apt.token_number or "—",
                "status": apt.status,
                "payment_status": apt.payment_status,
                "patient_age": age or "—",
                "patient_gender": getattr(apt.patient, 'gender', '—'),
                "patient_blood_group": apt.patient.blood_group or "—",
                "booking_time": apt.created_at.strftime('%d %B %Y %I:%M %p'),
                "hospital_name": apt.hospital.name if apt.hospital else "ABC Multispeciality Hospital"
            }
            return Response(data)
        except Appointment.DoesNotExist:
            return Response({"detail": "Invalid appointment ID"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['patch'])
    def status(self, request, pk=None):
        apt = self.get_object()
        new_status = request.data.get('status')
        if new_status in [choice[0] for choice in Appointment.AppointmentStatus.choices]:
            apt.status = new_status
            apt.save(update_fields=['status'])
            return Response({'status': apt.status})
        return Response({'detail': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def pdf(self, request, pk=None):
        try:
            apt = self.get_object()
        except Exception:
            # Fallback if they used appointment_id instead of primary key
            from django.shortcuts import get_object_or_404
            apt = get_object_or_404(self.get_queryset(), appointment_id=pk)
            
        # If PDF exists and is available on disk, serve it
        if apt.pdf:
            import mimetypes
            import os
            from django.http import HttpResponse
            try:
                file_path = apt.pdf.path
                if os.path.exists(file_path):
                    with open(file_path, 'rb') as f:
                        content_type, _ = mimetypes.guess_type(file_path)
                        response = HttpResponse(f.read(), content_type=content_type or 'application/pdf')
                        response['Content-Disposition'] = f'attachment; filename="{os.path.basename(file_path)}"'
                        return response
            except Exception:
                pass # Fall through to regenerate
                
        # Fallback: Regenerate PDF if missing or file not found on disk
        try:
            from appointments.appointment_pdf import generate_appointment_pdf
            from django.core.files.base import ContentFile
            from django.http import FileResponse
            import io
            
            pdf_bytes = generate_appointment_pdf(apt)
            apt.pdf.save(f"{apt.appointment_id}.pdf", ContentFile(pdf_bytes), save=True)
            
            buffer = io.BytesIO(pdf_bytes)
            filename = f"{apt.appointment_id}.pdf"
            response = FileResponse(buffer, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
            filename = f"DocSpot_Rx_{str(prescription.id)[:8].upper()}.pdf"
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
