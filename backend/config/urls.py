from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

# Import views from all apps
from accounts.views import RegisterView, UserProfileView, ChangePasswordView, VerifyOTPView, LoginView
from hospitals.views import HospitalProfileViewSet, DepartmentViewSet, BedViewSet
from doctors.views import DoctorProfileViewSet, ReviewViewSet
from patients.views import PatientProfileViewSet, MedicalRecordViewSet
from appointments.views import AppointmentViewSet, PrescriptionViewSet
from medicines.views import MedicineCategoryViewSet, MedicineViewSet
from pharmacy.views import MedicineOrderViewSet
from diagnostics.views import DiagnosticCenterViewSet, DiagnosticTestViewSet, TestBookingViewSet
from ambulance.views import AmbulanceViewSet, AmbulanceBookingViewSet
from payments.views import PaymentTransactionViewSet
from notifications.views import NotificationViewSet
from dashboard.views import DashboardStatsView

# Scaffolding API viewsets router
router = DefaultRouter()
router.register('hospitals', HospitalProfileViewSet, basename='hospital')
router.register('departments', DepartmentViewSet, basename='department')
router.register('beds', BedViewSet, basename='bed')
router.register('doctors', DoctorProfileViewSet, basename='doctor')
router.register('reviews', ReviewViewSet, basename='review')
router.register('patients', PatientProfileViewSet, basename='patient')
router.register('medical-records', MedicalRecordViewSet, basename='medical-record')
router.register('appointments', AppointmentViewSet, basename='appointment')
router.register('prescriptions', PrescriptionViewSet, basename='prescription')
router.register('medicine-categories', MedicineCategoryViewSet, basename='medicine-category')
router.register('medicines', MedicineViewSet, basename='medicine')
router.register('orders', MedicineOrderViewSet, basename='order')
router.register('diagnostic-centers', DiagnosticCenterViewSet, basename='diagnostic-center')
router.register('diagnostic-tests', DiagnosticTestViewSet, basename='diagnostic-test')
router.register('diagnostic-bookings', TestBookingViewSet, basename='diagnostic-booking')
router.register('ambulances', AmbulanceViewSet, basename='ambulance')
router.register('ambulance-bookings', AmbulanceBookingViewSet, basename='ambulance-booking')
router.register('payments', PaymentTransactionViewSet, basename='payment')
router.register('notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 1. JWT Authentication Endpoints
    path('api/login', LoginView.as_view(), name='auth_login_no_slash'),
    path('api/login/', LoginView.as_view(), name='auth_login'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # 2. Account Profile Endpoints
    path('api/register/', RegisterView.as_view(), name='auth_register'),
    path('api/profile/', UserProfileView.as_view(), name='user_profile'),
    path('api/change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('api/verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    
    # 3. Dynamic Dashboard API
    path('api/dashboard/stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    
    # 4. ViewSet Router Base Endpoints
    path('api/', include(router.urls)),
    
    # 5. OpenAPI Swagger Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
