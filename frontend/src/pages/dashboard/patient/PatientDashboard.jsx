import React, { useState, useEffect } from 'react';
import api from '../../../services/apiService';
import { useAuth } from '../../../context/AuthContext';
import { FiCalendar, FiFileText, FiPackage, FiHeart, FiActivity, FiArrowRight } from 'react-icons/fi';
import { BsTruck } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

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
          
          {/* My Appointments Detail */}
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-105 dark:bg-slate-800 dark:border-slate-800">
            <div className="flex justify-center items-center border-b-2 border-dashed border-slate-200 pb-4 mb-4 dark:border-slate-700">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white uppercase tracking-widest text-center">
                My Appointments
              </h3>
            </div>

            {upcomingApt ? (
              <div className="flex flex-col space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appointment No.</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{upcomingApt.appointment_id}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Doctor</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {upcomingApt.doctor_details ? `Dr. ${upcomingApt.doctor_details.user?.first_name} ${upcomingApt.doctor_details.user?.last_name}` : upcomingApt.doctorName}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Department</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {upcomingApt.department?.name || upcomingApt.doctor_details?.specialization || upcomingApt.specialization}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{upcomingApt.date}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{upcomingApt.time}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</p>
                  <p className="text-sm font-bold text-primary-600">{upcomingApt.status}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment</p>
                  <p className="text-sm font-bold text-teal-600">{upcomingApt.payment_status || 'Paid'}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60 mt-2">
                  <a href={upcomingApt.pdf || `http://localhost:8000/api/appointments/${upcomingApt.id}/pdf/`} target="_blank" rel="noreferrer" className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200 text-center dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 transition-colors">
                    View PDF
                  </a>
                  <a href={upcomingApt.pdf || `http://localhost:8000/api/appointments/${upcomingApt.id}/pdf/`} download className="flex-1 rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold text-white hover:bg-primary-700 text-center transition-colors shadow-sm">
                    Download PDF
                  </a>
                  <button className="flex-1 rounded-xl border border-red-200 text-red-600 px-4 py-3 text-sm font-bold hover:bg-red-50 text-center transition-colors dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950">
                    Cancel Appointment
                  </button>
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
                <div className="rounded bg-teal-50 px-3 py-1.5 text-xs text-teal-800 dark:bg-teal-950/60 dark:text-teal-400 font-bold shrink-0 animate-pulse flex items-center gap-1.5">
                  <BsTruck className="h-3.5 w-3.5" />
                  <span>{activeOrder.status}</span>
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
