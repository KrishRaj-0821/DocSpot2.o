import React, { useState, useEffect } from 'react';
import api from '../../../services/apiService';
import { useAuth } from '../../../context/AuthContext';
import { FiCalendar, FiFileText, FiPackage, FiHeart, FiActivity, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aptRes = await api.get('/appointments');
        const ordRes = await api.get('/orders');
        const repRes = await api.get('/reports');
        
        // Filter by user context if applicable
        setAppointments(aptRes.data.filter(a => a.patientEmail === user?.email));
        setOrders(ordRes.data.filter(o => o.userEmail === user?.email));
        setReports(repRes.data.filter(r => r.userEmail === user?.email));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const upcomingApt = appointments.filter(a => a.status === 'Upcoming')[0];
  const activeOrder = orders.filter(o => o.status === 'In Transit')[0];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-650 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-primary-750 to-teal-650 p-6 text-white shadow-lg">
        <h1 className="text-xl font-bold">Good Day, {user?.name}!</h1>
        <p className="mt-1 text-xs text-teal-100">Welcome to your patient portal. Access your virtual chart, health logs, and pharmacy orders.</p>
      </div>

      {/* Grid Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Health Summary Card */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 flex items-center space-x-4">
          <div className="rounded-xl bg-red-50 p-3 text-red-650 dark:bg-red-950/40 dark:text-red-400">
            <FiHeart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Blood Group</p>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{user?.bloodGroup || 'O+ve'}</h3>
          </div>
        </div>

        {/* Appointments Card */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 flex items-center space-x-4">
          <div className="rounded-xl bg-primary-50 p-3 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400">
            <FiCalendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Appointments</p>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{appointments.length} Total</h3>
          </div>
        </div>

        {/* Reports Card */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 flex items-center space-x-4">
          <div className="rounded-xl bg-teal-50 p-3 text-teal-650 dark:bg-teal-950/40 dark:text-teal-405">
            <FiFileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Lab Reports</p>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{reports.length} Available</h3>
          </div>
        </div>

        {/* Orders Card */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 flex items-center space-x-4">
          <div className="rounded-xl bg-accent-50 p-3 text-accent-600 dark:bg-accent-950/40 dark:text-accent-400">
            <FiPackage className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Medicine Orders</p>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{orders.length} Placed</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left Column: Upcoming Appointment & Active Order widgets */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Upcoming Appointment Detail */}
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-105 dark:bg-slate-800 dark:border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-700/60">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Upcoming Consultation</h3>
              <Link to="/patient/appointments" className="text-xs font-bold text-primary-600 dark:text-primary-400 flex items-center">
                <span>All appointments</span>
                <FiArrowRight className="ml-1" />
              </Link>
            </div>

            {upcomingApt ? (
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-850 dark:text-white">{upcomingApt.doctorName}</p>
                  <span className="inline-block rounded bg-primary-50 px-2 py-0.5 text-[9px] font-bold text-primary-750 dark:bg-primary-950/60 dark:text-primary-400">
                    {upcomingApt.specialization}
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">Reason: "{upcomingApt.reason}"</p>
                </div>
                <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl dark:bg-slate-900 shrink-0 text-xs">
                  <FiCalendar className="text-primary-500" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{upcomingApt.date}</p>
                    <p className="text-slate-400 text-[10px]">{upcomingApt.time}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic mt-4 py-4 text-center">No upcoming consultations booked.</p>
            )}
          </div>

          {/* Active Medicine Order Detail */}
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-105 dark:bg-slate-800 dark:border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-105 pb-3 dark:border-slate-700/60">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Active Order Tracker</h3>
              <Link to="/patient/orders" className="text-xs font-bold text-primary-600 dark:text-primary-400 flex items-center">
                <span>Order history</span>
                <FiArrowRight className="ml-1" />
              </Link>
            </div>

            {activeOrder ? (
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-850 dark:text-white">Order Reference: #{activeOrder.id}</p>
                  <p className="text-xs text-slate-500">Items: {activeOrder.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">Payment: {activeOrder.paymentMethod} | Amount: ₹{activeOrder.total}</p>
                </div>
                <div className="rounded bg-teal-50 px-3 py-1.5 text-xs text-teal-800 dark:bg-teal-950/60 dark:text-teal-400 font-bold shrink-0 animate-pulse">
                  🚚 {activeOrder.status}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic mt-4 py-4 text-center">No current pharmacy order transit.</p>
            )}
          </div>
        </div>

        {/* Right Column: Health Vit logs widget */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-700/60">
              Medical Vital Indicators
            </h3>
            
            <div className="mt-4 space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-350">
              <div className="flex justify-between items-center">
                <span>Blood Pressure</span>
                <span className="text-slate-900 dark:text-white font-bold">120/80 mmHg (Normal)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Heart Rate</span>
                <span className="text-slate-900 dark:text-white font-bold">72 bpm</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Weight Log</span>
                <span className="text-slate-900 dark:text-white font-bold">68 kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Oxygen Level (SpO2)</span>
                <span className="text-slate-900 dark:text-white font-bold">98% (Healthy)</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default PatientDashboard;
