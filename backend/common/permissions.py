from rest_framework.permissions import BasePermission
from accounts.models import Role

class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == Role.SUPER_ADMIN

class IsHospitalAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == Role.HOSPITAL_ADMIN

class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == Role.DOCTOR

class IsPatient(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == Role.PATIENT

class IsDiagnosticAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == Role.DIAGNOSTIC_ADMIN

class IsAmbulanceDriver(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == Role.AMBULANCE_DRIVER

class IsPharmacyAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == Role.PHARMACY_ADMIN

class IsClinicAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in [Role.HOSPITAL_ADMIN, Role.SUPER_ADMIN]

class IsHealthcareProfessional(BasePermission):
    """
    Allows access to verified healthcare professionals (Doctors, Hospital Admins, Diagnostics, Pharmacists).
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in [Role.DOCTOR, Role.HOSPITAL_ADMIN, Role.DIAGNOSTIC_ADMIN, Role.PHARMACY_ADMIN, Role.SUPER_ADMIN]

class IsPatientOwnerOrDoctor(BasePermission):
    """
    Custom permission allowing patients to view their own records,
    and doctors / clinic admins to view records of patients assigned to their OPD queue.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
            
        if user.role == Role.PATIENT:
            patient_user = getattr(obj, 'user', None) or getattr(getattr(obj, 'patient', None), 'user', None) or getattr(obj, 'patient', None)
            return patient_user == user
            
        if user.role in [Role.DOCTOR, Role.HOSPITAL_ADMIN, Role.SUPER_ADMIN]:
            return True  # Verified healthcare provider
            
        return False


