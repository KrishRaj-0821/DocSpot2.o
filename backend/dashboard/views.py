from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.contrib.auth import get_user_model
from django.db.models import Sum

from accounts.models import Role
from doctors.models import DoctorProfile
from hospitals.models import HospitalProfile
from appointments.models import Appointment
from pharmacy.models import MedicineOrder
from diagnostics.models import TestBooking
from ambulance.models import AmbulanceBooking
from payments.models import PaymentTransaction

User = get_user_model()

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        role = user.role

        if role == Role.SUPER_ADMIN:
            total_patients = User.objects.filter(role=Role.PATIENT).count()
            total_doctors = DoctorProfile.objects.count()
            total_hospitals = HospitalProfile.objects.count()
            total_orders = MedicineOrder.objects.count()
            total_diagnostics = TestBooking.objects.count()
            total_ambulances = AmbulanceBooking.objects.count()
            
            revenue_agg = PaymentTransaction.objects.filter(status='Success').aggregate(total=Sum('amount'))
            total_revenue = float(revenue_agg['total'] or 0)

            return Response({
                "role": "admin",
                "stats": {
                    "total_patients": total_patients,
                    "total_doctors": total_doctors,
                    "total_hospitals": total_hospitals,
                    "total_orders": total_orders,
                    "total_diagnostics": total_diagnostics,
                    "total_ambulances": total_ambulances,
                    "total_revenue": total_revenue
                }
            })

        elif role == Role.DOCTOR:
            # Stats for this specific doctor
            try:
                doc = user.doctor_profile
                doc_appointments = Appointment.objects.filter(doctor=doc)
                checked = doc_appointments.filter(status='Completed').count()
                pending = doc_appointments.filter(status='Upcoming').count()
                revenue = checked * doc.fees
                
                return Response({
                    "role": "doctor",
                    "stats": {
                        "total_patients_checked": checked,
                        "pending_appointments": pending,
                        "accumulated_fees": revenue
                    }
                })
            except DoctorProfile.DoesNotExist:
                return Response({"detail": "Doctor profile not configured"}, status=400)

        elif role == Role.HOSPITAL_ADMIN:
            try:
                hosp = HospitalProfile.objects.filter(email=user.email).first()
                if not hosp:
                    hosp = HospitalProfile.objects.first() # fallback for demo
                
                doc_count = hosp.staff_doctors.count() if hosp else 0
                dept_count = hosp.hospital_departments.count() if hosp else 0
                bookings = Appointment.objects.filter(hospital=hosp).count() if hosp else 0
                
                return Response({
                    "role": "hospital",
                    "stats": {
                        "staff_doctors": doc_count,
                        "departments": dept_count,
                        "opd_bookings": bookings,
                        "beds_capacity": hosp.beds_count if hosp else 100
                    }
                })
            except Exception as e:
                return Response({"detail": str(e)}, status=400)

        elif role == Role.PATIENT:
            # Stats for this patient
            apts = Appointment.objects.filter(patient=user).count()
            orders = MedicineOrder.objects.filter(user=user).count()
            reports = TestBooking.objects.filter(patient=user, status='Completed').count()
            
            return Response({
                "role": "patient",
                "stats": {
                    "blood_group": user.blood_group or "O+ve",
                    "total_appointments": apts,
                    "medicine_orders": orders,
                    "lab_reports": reports
                }
            })

        return Response({"detail": "Dashboard stats not available for this role"}, status=400)
