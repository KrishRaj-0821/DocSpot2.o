import React, { useState, useEffect } from 'react';
import api from '../../../services/apiService';
import { useAuth } from '../../../context/AuthContext';
import { FiCalendar, FiClock, FiDollarSign, FiTrash2, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const PatientAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reschedule state
  const [rescheduleApt, setRescheduleApt] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data.filter(a => a.patientEmail === user?.email));
    } catch (err) {
      toast.error("Failed to load consultations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleCancelAppointment = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
    toast.success("Appointment slot cancelled successfully.");
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!newDate || !newTime) return;

    setAppointments(prev => prev.map(a => 
      a.id === rescheduleApt.id 
        ? { ...a, date: newDate, time: newTime, status: 'Upcoming' } 
        : a
    ));
    toast.success(`Successfully rescheduled consultation for ${newDate} at ${newTime}!`);
    setRescheduleApt(null);
    setNewDate('');
    setNewTime('');
  };

  if (loading) {
    return <div className="text-center py-10">Loading consultations...</div>;
  }

  const upcoming = appointments.filter(a => a.status === 'Upcoming');
  const past = appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Clinical Consultations</h1>
          <p className="text-xs text-slate-500">Review upcoming bookings, reschedule sessions, or verify prescription history.</p>
        </div>
      </div>

      {/* Upcoming Section */}
      <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-700/60 mb-4">
          Upcoming Consultations
        </h3>
        
        {upcoming.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-4">No active upcoming consultations scheduled.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {upcoming.map(apt => (
              <div key={apt.id} className="border border-slate-100 dark:border-slate-700 p-4 rounded-xl space-y-4 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-extrabold text-slate-850 dark:text-white">{apt.doctorName}</h4>
                    <span className="rounded bg-teal-50 px-2 py-0.5 text-[9px] font-extrabold text-teal-700 dark:bg-teal-950/60 dark:text-teal-400">
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{apt.specialization}</p>
                  <p className="text-xs text-slate-500 italic mt-1">"{apt.reason}"</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs border-t border-slate-50 pt-3 dark:border-slate-750 font-semibold text-slate-650">
                  <span className="flex items-center"><FiCalendar className="mr-1.5 text-primary-500" /> {apt.date}</span>
                  <span className="flex items-center"><FiClock className="mr-1.5 text-primary-500" /> {apt.time}</span>
                  <span className="flex items-center"><FiDollarSign className="mr-1.5 text-primary-500" /> ₹{apt.fees}</span>
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setRescheduleApt(apt)}
                    className="flex-1 border border-slate-200 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-350 dark:hover:bg-slate-800 flex items-center justify-center space-x-1"
                  >
                    <FiEdit2 className="h-3 w-3" />
                    <span>Reschedule</span>
                  </button>
                  <button
                    onClick={() => handleCancelAppointment(apt.id)}
                    className="flex-1 bg-red-50 py-2 rounded-lg text-xs font-bold text-red-650 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 flex items-center justify-center space-x-1"
                  >
                    <FiTrash2 className="h-3 w-3" />
                    <span>Cancel Slot</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past/Cancelled Section */}
      <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-105 pb-3 dark:border-slate-700/60 mb-4">
          Consultation History
        </h3>

        {past.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-4">No past visits recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-slate-650">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-750 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3">Doctor</th>
                  <th className="py-3">Specialization</th>
                  <th className="py-3">Date/Time</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Fee Charge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-750">
                {past.map(apt => (
                  <tr key={apt.id}>
                    <td className="py-4.5 font-bold text-slate-900 dark:text-white">{apt.doctorName}</td>
                    <td className="py-4.5">{apt.specialization}</td>
                    <td className="py-4.5">{apt.date} at {apt.time}</td>
                    <td className="py-4.5">
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        apt.status === 'Completed' 
                          ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400' 
                          : 'bg-red-50 text-red-655 dark:bg-red-950/30'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-4.5 text-right font-bold text-slate-900 dark:text-white">₹{apt.fees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reschedule Modal Overlay */}
      {rescheduleApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setRescheduleApt(null)} />
          <div className="w-full max-w-md bg-white p-6 rounded-3xl z-10 shadow-2xl dark:bg-slate-900 border border-slate-150 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b pb-3 dark:border-slate-800">
              Reschedule with {rescheduleApt.doctorName}
            </h3>
            
            <form onSubmit={handleRescheduleSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">New Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">New Time Slot</label>
                <select
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="">Select slot</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleApt(null)}
                  className="w-1/3 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-350 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-primary-600 py-3 text-xs font-bold text-white shadow hover:bg-primary-750"
                >
                  Confirm Date Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default PatientAppointments;
