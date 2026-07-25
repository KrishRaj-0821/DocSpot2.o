import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Public Pages
import Home from '../pages/public/Home';
import Doctors from '../pages/public/Doctors';
import Hospitals from '../pages/public/Hospitals';
import Diagnostics from '../pages/public/Diagnostics';
import Medicines from '../pages/public/Medicines';
import Ambulance from '../pages/public/Ambulance';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import BookDoctor from '../pages/public/BookDoctor';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import VerifyAppointment from '../pages/public/VerifyAppointment';

// Dashboard Pages
import PatientDashboard from '../pages/dashboard/patient/PatientDashboard';
import PatientAppointments from '../pages/dashboard/patient/PatientAppointments';
import PatientPrescriptions from '../pages/dashboard/patient/PatientPrescriptions';
import PatientOrders from '../pages/dashboard/patient/PatientOrders';
import PatientProfile from '../pages/dashboard/patient/PatientProfile';

import DoctorDashboard from '../pages/dashboard/doctor/DoctorDashboard';
import HospitalDashboard from '../pages/dashboard/hospital/HospitalDashboard';
import AdminDashboard from '../pages/dashboard/admin/AdminDashboard';
import DiagnosticAdminDashboard from '../pages/dashboard/diagnostics/DiagnosticAdminDashboard';
import PharmacyAdminDashboard from '../pages/dashboard/pharmacy/PharmacyAdminDashboard';

// Error status pages
import NotFound from '../pages/errors/NotFound';
import ComingSoon from '../pages/errors/ComingSoon';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      
      {/* 1. PUBLIC WEBSITE ROUTING */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/diagnostics" element={<Diagnostics />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/ambulance" element={<Ambulance />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book-doctor" element={<BookDoctor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/appointment/:appointment_id" element={<VerifyAppointment />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
      </Route>

      {/* 2. PROTECTED PATIENT ROUTING */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="prescriptions" element={<PatientPrescriptions />} />
        <Route path="orders" element={<PatientOrders />} />
        <Route path="profile" element={<PatientProfile />} />
        <Route path="settings" element={<ComingSoon />} />
      </Route>

      {/* 3. PROTECTED DOCTOR ROUTING */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="appointments" element={<DoctorDashboard />} />
        <Route path="patients" element={<DoctorDashboard />} />
        <Route path="prescriptions" element={<DoctorDashboard />} />
        <Route path="schedule" element={<DoctorDashboard />} />
        <Route path="profile" element={<DoctorDashboard />} />
      </Route>

      {/* 4. PROTECTED HOSPITAL ROUTING */}
      <Route
        path="/hospital"
        element={
          <ProtectedRoute allowedRoles={['hospital']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<HospitalDashboard />} />
        <Route path="doctors" element={<HospitalDashboard />} />
        <Route path="departments" element={<HospitalDashboard />} />
        <Route path="appointments" element={<HospitalDashboard />} />
      </Route>

      {/* 5. PROTECTED ADMIN ROUTING */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminDashboard />} />
        <Route path="doctors" element={<AdminDashboard />} />
        <Route path="hospitals" element={<AdminDashboard />} />
        <Route path="orders" element={<AdminDashboard />} />
        <Route path="diagnostics" element={<AdminDashboard />} />
        <Route path="settings" element={<AdminDashboard />} />
      </Route>

      {/* 6. PROTECTED DIAGNOSTIC ADMIN ROUTING */}
      <Route
        path="/diagnostics-admin"
        element={
          <ProtectedRoute allowedRoles={['diagnostic_admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DiagnosticAdminDashboard />} />
        <Route path="patients" element={<DiagnosticAdminDashboard />} />
        <Route path="orders" element={<DiagnosticAdminDashboard />} />
        <Route path="samples" element={<DiagnosticAdminDashboard />} />
        <Route path="tests" element={<DiagnosticAdminDashboard />} />
        <Route path="results" element={<DiagnosticAdminDashboard />} />
        <Route path="inventory" element={<DiagnosticAdminDashboard />} />
        <Route path="settings" element={<DiagnosticAdminDashboard />} />
      </Route>

      {/* 7. PROTECTED PHARMACY ADMIN ROUTING */}
      <Route
        path="/pharmacy-admin"
        element={
          <ProtectedRoute allowedRoles={['pharmacy_admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<PharmacyAdminDashboard />} />
        <Route path="profile" element={<PharmacyAdminDashboard />} />
        <Route path="medicines" element={<PharmacyAdminDashboard />} />
        <Route path="inventory" element={<PharmacyAdminDashboard />} />
        <Route path="orders" element={<PharmacyAdminDashboard />} />
        <Route path="prescriptions" element={<PharmacyAdminDashboard />} />
        <Route path="deliveries" element={<PharmacyAdminDashboard />} />
        <Route path="billing" element={<PharmacyAdminDashboard />} />
        <Route path="customers" element={<PharmacyAdminDashboard />} />
        <Route path="reports" element={<PharmacyAdminDashboard />} />
        <Route path="settings" element={<PharmacyAdminDashboard />} />
      </Route>

      {/* 6. ERROR ROUTING FALLBACKS */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />

    </Routes>
  );
};
export default AppRoutes;
