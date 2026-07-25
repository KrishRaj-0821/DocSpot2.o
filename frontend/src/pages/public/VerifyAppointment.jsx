import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiClock, FiCalendar, FiUser, FiHome, FiAlertCircle } from 'react-icons/fi';
import api from '../../services/apiService';

export const VerifyAppointment = () => {
  const { appointment_id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    const verifyAppointment = async () => {
      try {
        const res = await api.get(`/appointments/verify/${appointment_id}/`);
        setAppointment(res.data);
      } catch (err) {
        if (err.response?.status === 401 && err.response?.data?.auth_required) {
          setAuthRequired(true);
          setAuthMessage(err.response.data.detail);
        } else {
          setError(err.response?.data?.detail || "Invalid or missing appointment.");
        }
      } finally {
        setLoading(false);
      }
    };
    verifyAppointment();
  }, [appointment_id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-800"
      >
        {/* Header */}
        <div className="bg-primary-600 p-6 text-center text-white">
          <h1 className="text-2xl font-bold tracking-tight">HOSPITAL MANAGEMENT SYSTEM</h1>
          <p className="mt-1 text-sm text-primary-100">Appointment Verification</p>
        </div>

        <div className="p-8">
          {authRequired ? (
            <div className="flex flex-col items-center text-center">
              <FiUser className="mb-4 text-6xl text-primary-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Authentication Required</h2>
              <div className="mt-4 rounded-xl bg-amber-50 p-4 border border-amber-100 dark:bg-amber-950/30 dark:border-amber-900/50">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">{authMessage}</p>
              </div>
              <Link to="/login" className="mt-6 rounded-xl bg-primary-600 px-8 py-3 text-sm font-bold text-white hover:bg-primary-700 shadow-md w-full transition-colors">
                Sign In
              </Link>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center text-center">
              <FiXCircle className="mb-4 text-6xl text-red-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Verification Failed</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{error}</p>
              <Link to="/" className="mt-6 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900">
                Go to Homepage
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center">
                {appointment.status === 'Completed' ? (
                  <FiCheckCircle className="mb-4 text-6xl text-green-500" />
                ) : appointment.status === 'Cancelled' ? (
                  <FiXCircle className="mb-4 text-6xl text-red-500" />
                ) : (
                  <FiAlertCircle className="mb-4 text-6xl text-amber-500" />
                )}
                
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {appointment.status}
                </h2>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/50 space-y-4">
                
                <div className="grid grid-cols-2 gap-y-4">
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Appointment ID</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{appointment.appointment_id}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Patient Name</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{appointment.patient_name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Patient ID</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{appointment.patient_id}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Age / Gender</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{appointment.patient_age} / {appointment.patient_gender}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Blood Group</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{appointment.patient_blood_group}</p>
                  </div>

                  <div className="col-span-2 border-t border-slate-200 dark:border-slate-700 pt-4 mt-1"></div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Doctor</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{appointment.doctor_name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Department</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{appointment.department}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Appointment Date</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{appointment.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Appointment Time</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{appointment.time}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Token Number</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{appointment.token_number}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Payment Status</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{appointment.payment_status}</p>
                  </div>
                  
                  <div className="col-span-2 border-t border-slate-200 dark:border-slate-700 pt-4 mt-1"></div>
                  
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Booking Time</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{appointment.booking_time}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Hospital</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{appointment.hospital_name}</p>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyAppointment;
