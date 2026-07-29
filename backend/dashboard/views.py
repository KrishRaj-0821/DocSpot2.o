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

    def _get_super_admin_stats(self):
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

    def _get_doctor_stats(self, user):
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

    def _get_hospital_admin_stats(self, user):
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

    def _get_patient_stats(self, user):
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

    def _get_pharmacy_admin_stats(self, user):
        try:
            from medicines.models import Medicine
            from datetime import date, timedelta
            pharm = getattr(user, 'pharmacy_profile', None)
            if pharm:
                pharm_orders = MedicineOrder.objects.filter(pharmacy=pharm)
                pending = pharm_orders.filter(status='Pending').count()
                completed = pharm_orders.filter(status='Delivered').count()
                cancelled = pharm_orders.filter(status='Cancelled').count()

                revenue_agg = pharm_orders.filter(status='Delivered').aggregate(total=Sum('total'))
                revenue = float(revenue_agg['total'] or 0)

                low_stock = Medicine.objects.filter(pharmacy=pharm, stock__lt=20).count()

                thirty_days_later = date.today() + timedelta(days=30)
                expiring = Medicine.objects.filter(pharmacy=pharm, expiry_date__lte=thirty_days_later).count()
                
                return Response({
                    "role": "pharmacy_admin",
                    "stats": {
                        "pending_orders": pending,
                        "completed_orders": completed,
                        "cancelled_orders": cancelled,
                        "total_revenue": revenue,
                        "low_stock_medicines": low_stock,
                        "expiring_medicines": expiring
                    }
                })
            else:
                return Response({
                    "role": "pharmacy_admin",
                    "stats": {
                        "pending_orders": 0,
                        "completed_orders": 0,
                        "cancelled_orders": 0,
                        "total_revenue": 0.0,
                        "low_stock_medicines": 0,
                        "expiring_medicines": 0
                    }
                })
        except Exception as e:
            return Response({"detail": str(e)}, status=400)

    def get(self, request):
        user = request.user
        role = user.role

        if role == Role.SUPER_ADMIN:
            return self._get_super_admin_stats()
        elif role == Role.DOCTOR:
            return self._get_doctor_stats(user)
        elif role == Role.HOSPITAL_ADMIN:
            return self._get_hospital_admin_stats(user)
        elif role == Role.PATIENT:
            return self._get_patient_stats(user)
        elif role == Role.PHARMACY_ADMIN:
            return self._get_pharmacy_admin_stats(user)

        return Response({"detail": "Dashboard stats not available for this role"}, status=400)
