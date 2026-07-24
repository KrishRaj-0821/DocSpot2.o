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

