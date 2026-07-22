import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../../services/apiService';
import { useAuth } from '../../../context/AuthContext';
import { 
  FiUsers, FiDollarSign, FiCalendar, FiClock, 
  FiPlusCircle, FiCheck, FiInfo, FiUser, FiHeart 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export const DoctorDashboard = () => {
  const { user, updateProfile } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);

  // Profile States
  const [docFees, setDocFees] = useState(user?.fees || 800);
  const [docQual, setDocQual] = useState(user?.qualification || 'MD, DM - AIIMS');
  const [docExp, setDocExp] = useState(user?.experience || 15);

  // Prescription Form state
  const [activePrescribeApt, setActivePrescribeApt] = useState(null);
  const [medsList, setMedsList] = useState([{ name: '', dosage: '' }]);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Patient detail modal
  const [selectedPatientApt, setSelectedPatientApt] = useState(null);

  const fetchDoctorAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      const docId = user?.id || 'doc-1';
      setAppointments(res.data.filter(a => a.doctorId === docId));
    } catch (err) {
      toast.error("Failed to load doctor appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, [user]);

  const handleAddMedRow = () => {
    setMedsList([...medsList, { name: '', dosage: '' }]);
  };

  const handleMedChange = (idx, field, val) => {
    const updated = [...medsList];
    updated[idx][field] = val;
    setMedsList(updated);
  };

  const handleRemoveMedRow = (idx) => {
    setMedsList(prev => prev.filter((_, i) => i !== idx));
  };

  const handlePrescriptionSubmit = (e) => {
    e.preventDefault();
    if (medsList.some(m => !m.name || !m.dosage)) {
      toast.error("Please fill in medicine name and dosage instructions.");
      return;
    }

    setSubmitLoading(true);
    setTimeout(() => {
      setAppointments(prev => prev.map(a => 
        a.id === activePrescribeApt.id 
          ? { 
              ...a, 
              status: 'Completed', 
              prescription: { 
                date: new Date().toISOString().split('T')[0], 
                notes: clinicalNotes, 
                medicines: medsList 
              } 
            } 
          : a
      ));
      toast.success(`Prescription issued successfully to ${activePrescribeApt.patientName}!`);
      
      setActivePrescribeApt(null);
      setMedsList([{ name: '', dosage: '' }]);
      setClinicalNotes('');
      setSubmitLoading(false);
    }, 1000);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    toast.success("Consultation profile parameters saved.");
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-650 border-t-transparent"></div>
      </div>
    );
  }

  // Calculate metrics
  const completed = appointments.filter(a => a.status === 'Completed');
  const upcoming = appointments.filter(a => a.status === 'Upcoming');
  const revenue = completed.reduce((sum, a) => sum + a.fees, 0);

  // VIEW 1: Main Dashboard Overview & Appointments Tab
  if (path === '/doctor/dashboard' || path === '/doctor/appointments' || path === '/doctor') {
    return (
      <div className="space-y-6">
        
        {/* Availability banner */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 gap-4">
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Consultant Panel: {user?.name}</h1>
            <p className="text-xs text-slate-500">{user?.specialization} Department | {docQual}</p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <span className="text-xs font-bold text-slate-500">OPD Status:</span>
            <button
              onClick={() => {
                setIsAvailable(!isAvailable);
                toast.success(`OPD status set to ${!isAvailable ? 'ACTIVE' : 'ON LEAVE'}`);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                isAvailable ? 'bg-primary-600' : 'bg-slate-205 dark:bg-slate-700'
              }`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                isAvailable ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
            <span className={`text-xs font-extrabold ${isAvailable ? 'text-teal-600' : 'text-slate-400'}`}>
              {isAvailable ? 'Active' : 'On Leave'}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-805 flex items-center space-x-4">
            <div className="rounded-xl bg-primary-50 p-3 text-primary-655 dark:bg-primary-950/40">
              <FiUsers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Total Checked</p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{completed.length} Patients</h3>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-805 flex items-center space-x-4">
            <div className="rounded-xl bg-accent-50 p-3 text-accent-600 dark:bg-accent-950/40">
              <FiCalendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Pending Slots</p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{upcoming.length} patients</h3>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-805 flex items-center space-x-4">
            <div className="rounded-xl bg-teal-50 p-3 text-teal-650 dark:bg-teal-950/40">
              <FiDollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Accumulated Fees</p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">₹{revenue}</h3>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b pb-3 dark:border-slate-700/60 mb-4">
            Outpatient Consultations Queue
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-slate-650">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-750 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3">Patient Name</th>
                  <th className="py-3">Date/Time</th>
                  <th className="py-3">Details / symptoms</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-750">
                {appointments.map(apt => (
                  <tr key={apt.id}>
                    <td className="py-4 font-bold text-slate-900 dark:text-white">{apt.patientName}</td>
                    <td className="py-4">{apt.date} | {apt.time}</td>
                    <td className="py-4 max-w-[200px] truncate">{apt.reason}</td>
                    <td className="py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                        apt.status === 'Completed' 
                          ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400' 
                          : 'bg-accent-50 text-accent-650 dark:bg-accent-950/30'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedPatientApt(apt)}
                        className="text-slate-400 hover:text-slate-805 p-1 dark:hover:text-white"
                      >
                        <FiInfo className="h-4.5 w-4.5" />
                      </button>
                      {apt.status === 'Upcoming' && (
                        <button
                          onClick={() => setActivePrescribeApt(apt)}
                          className="rounded bg-primary-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-primary-750 cursor-pointer"
                        >
                          Prescribe
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Prescription Modal */}
        {activePrescribeApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActivePrescribeApt(null)} />
            <div className="w-full max-w-lg bg-white rounded-3xl z-10 shadow-2xl overflow-hidden dark:bg-slate-900 border border-slate-150 dark:border-slate-800">
              <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-850 dark:text-white">Write Prescription</h3>
                  <p className="text-[10px] text-slate-400">Patient: {activePrescribeApt.patientName}</p>
                </div>
                <button onClick={() => setActivePrescribeApt(null)} className="text-slate-400 hover:text-slate-800 text-xl font-bold dark:hover:text-white">&times;</button>
              </div>

              <form onSubmit={handlePrescriptionSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-500">Medicines list</label>
                  <button type="button" onClick={handleAddMedRow} className="text-[10px] font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center space-x-0.5">
                    <FiPlusCircle /> <span>Add Row</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {medsList.map((med, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text" required placeholder="Medicine Name" value={med.name}
                        onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-705 dark:bg-slate-950"
                      />
                      <input
                        type="text" required placeholder="Dosage (e.g. 1-0-1)" value={med.dosage}
                        onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                        className="w-1/3 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-705 dark:bg-slate-950"
                      />
                      {medsList.length > 1 && (
                        <button type="button" onClick={() => handleRemoveMedRow(idx)} className="text-red-500 text-sm font-bold">&times;</button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Clinical Remarks & Directions</label>
                  <textarea
                    required placeholder="Directions, precautions, diagnostics..." rows="3"
                    value={clinicalNotes} onChange={(e) => setClinicalNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-705 dark:bg-slate-950 resize-none"
                  />
                </div>

                <div className="flex space-x-2">
                  <button type="button" onClick={() => setActivePrescribeApt(null)} className="w-1/3 border border-slate-200 rounded-xl py-3 text-xs font-bold hover:bg-slate-50 dark:border-slate-700">Cancel</button>
                  <button type="submit" disabled={submitLoading} className="flex-1 bg-primary-600 rounded-xl py-3 text-xs font-bold text-white hover:bg-primary-750">
                    {submitLoading ? 'Issuing Rx...' : 'Issue Prescription'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Patient detail Modal */}
        {selectedPatientApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedPatientApt(null)} />
            <div className="w-full max-w-md bg-white rounded-3xl z-10 shadow-2xl p-6 dark:bg-slate-900 border border-slate-150">
              <h3 className="text-base font-bold text-slate-850 dark:text-white border-b pb-3 mb-3">Clinical Case Details</h3>
              <div className="space-y-3 text-xs font-semibold text-slate-650">
                <p><span className="text-slate-400">Patient:</span> {selectedPatientApt.patientName}</p>
                <p><span className="text-slate-400">Phone:</span> {selectedPatientApt.patientPhone}</p>
                <p><span className="text-slate-400">Symptoms:</span> "{selectedPatientApt.reason}"</p>
                {selectedPatientApt.prescription && (
                  <div className="mt-3 bg-slate-50 p-3 rounded-xl dark:bg-slate-950">
                    <p className="font-bold text-slate-900 dark:text-white">Prescribed Treatment:</p>
                    <ul className="list-disc pl-4 mt-1">
                      {selectedPatientApt.prescription.medicines.map((m, i) => (
                        <li key={i}>{m.name} - {m.dosage}</li>
                      ))}
                    </ul>
                    <p className="mt-2 font-bold text-slate-900 dark:text-white">Remarks:</p>
                    <p className="italic">"{selectedPatientApt.prescription.notes}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // VIEW 2: My Patients list
  if (path === '/doctor/patients') {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b pb-3 dark:border-slate-700/60 mb-4">
          Historical Patient Registry
        </h3>

        {completed.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-6">No patients verified in past consult logs.</p>
        ) : (
          <div className="space-y-3">
            {completed.map(apt => (
              <div key={apt.id} className="flex justify-between items-center border border-slate-50 p-3 rounded-xl dark:border-slate-750/60 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{apt.patientName}</h4>
                  <p className="text-[10px] text-slate-450">Phone: {apt.patientPhone} | Consulted: {apt.date}</p>
                </div>
                <button
                  onClick={() => setSelectedPatientApt(apt)}
                  className="rounded border border-slate-200 px-3 py-1 font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Inspect History
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // VIEW 3: Availability & Hours settings
  if (path === '/doctor/schedule') {
    return (
      <div className="max-w-xl rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-6">
        <div className="border-b pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">OPD Operating Slots & Availability</h3>
          <p className="text-[10px] text-slate-400">Configure clinic timings and active days shown to patients.</p>
        </div>

        <div className="space-y-4 text-xs font-semibold text-slate-655">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Weekly Availability</p>
              <p className="text-[10px] text-slate-400">Monday, Wednesday, Friday consultation days</p>
            </div>
            <span className="rounded bg-teal-50 px-2.5 py-1 text-teal-850 font-bold dark:bg-teal-950/40 dark:text-teal-400">
              Mon, Wed, Fri
            </span>
          </div>

          <div className="flex justify-between items-center pb-4">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Consultation Timings</p>
              <p className="text-[10px] text-slate-400">OPD hours window</p>
            </div>
            <span className="rounded bg-primary-50 px-2.5 py-1 text-primary-750 font-bold dark:bg-primary-950/40">
              10:00 AM - 01:00 PM
            </span>
          </div>

          <button 
            onClick={() => toast.success("Availability timetable metrics saved.")}
            className="w-full rounded-xl bg-primary-600 py-3 text-xs font-bold text-white hover:bg-primary-750 transition-colors"
          >
            Apply Timetable Updates
          </button>
        </div>
      </div>
    );
  }

  // VIEW 4: Profile Settings
  if (path === '/doctor/profile') {
    return (
      <div className="max-w-2xl rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800">
        <h3 className="text-base font-extrabold text-slate-905 dark:text-white mb-4">Edit Consultation Profile</h3>
        
        <form onSubmit={handleProfileSave} className="space-y-4 text-xs font-bold text-slate-500">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block mb-1">Consultation Fees (₹)</label>
              <input
                type="number"
                value={docFees}
                onChange={(e) => setDocFees(parseInt(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block mb-1">Qualifications</label>
              <input
                type="text"
                value={docQual}
                onChange={(e) => setDocQual(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Specialist Experience (Years)</label>
            <input
              type="number"
              value={docExp}
              onChange={(e) => setDocExp(parseInt(e.target.value))}
              className="w-24 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-primary-600 py-3.5 text-white hover:bg-primary-750 transition-colors"
          >
            Apply Profile Settings
          </button>
        </form>
      </div>
    );
  }

  return null;
};
export default DoctorDashboard;
