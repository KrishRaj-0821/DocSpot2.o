import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../../services/apiService';
import { useAuth } from '../../../context/AuthContext';
import { generatePrescriptionPDF } from '../../../utils/pdfUtils';
import {
  FiUsers, FiDollarSign, FiCalendar, FiClock,
  FiPlusCircle, FiCheck, FiInfo, FiUser, FiHeart,
  FiFileText, FiDownload, FiPrinter, FiX, FiActivity,
  FiTrash2
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const FREQUENCY_OPTIONS = ['Morning', 'Afternoon', 'Night', 'Morning & Night', 'Morning, Afternoon, Night', 'Twice daily', 'SOS', 'Once daily', 'As directed'];

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

  // Enhanced Prescription Form state
  const [activePrescribeApt, setActivePrescribeApt] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [medsList, setMedsList] = useState([{ name: '', dosage: '', frequency: 'Morning', duration: '' }]);
  const [testsList, setTestsList] = useState([]);
  const [testInput, setTestInput] = useState('');
  const [advice, setAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
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
    setMedsList([...medsList, { name: '', dosage: '', frequency: 'Morning', duration: '' }]);
  };

  const handleMedChange = (idx, field, val) => {
    const updated = [...medsList];
    updated[idx][field] = val;
    setMedsList(updated);
  };

  const handleRemoveMedRow = (idx) => {
    setMedsList(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddTest = () => {
    if (!testInput.trim()) return;
    setTestsList(prev => [...prev, testInput.trim()]);
    setTestInput('');
  };

  const handleRemoveTest = (idx) => {
    setTestsList(prev => prev.filter((_, i) => i !== idx));
  };

  const resetPrescriptionForm = () => {
    setDiagnosis('');
    setMedsList([{ name: '', dosage: '', frequency: 'Morning', duration: '' }]);
    setTestsList([]);
    setTestInput('');
    setAdvice('');
    setFollowUpDate('');
    setClinicalNotes('');
  };

  const buildPrescriptionData = (apt) => ({
    prescriptionId: `PC-${apt.id?.replace('apt-', '').padStart(6, '0')}`,
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
    doctorName: user?.name || apt.doctorName,
    specialization: user?.specialization || apt.specialization,
    qualification: user?.qualification || docQual,
    hospitalName: user?.hospitalName || 'DocSpot Central Hospital',
    patientName: apt.patientName,
    patientAge: apt.patientAge,
    patientGender: apt.patientGender,
    diagnosis,
    medicines: medsList,
    tests: testsList,
    advice,
    followUpDate,
  });

  const handlePrescriptionSubmit = (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) { toast.error("Please enter a diagnosis."); return; }
    if (medsList.some(m => !m.name || !m.dosage)) {
      toast.error("Please fill in medicine name and dosage for all rows.");
      return;
    }

    setSubmitLoading(true);
    setTimeout(() => {
      const prescriptionData = {
        id: `rx-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        diagnosis,
        medicines: medsList,
        tests: testsList,
        advice,
        followUpDate,
        notes: clinicalNotes,
      };

      setAppointments(prev => prev.map(a =>
        a.id === activePrescribeApt.id
          ? { ...a, status: 'Completed', prescription: prescriptionData }
          : a
      ));
      toast.success(`Prescription issued to ${activePrescribeApt.patientName}!`);
      setActivePrescribeApt(null);
      resetPrescriptionForm();
      setSubmitLoading(false);
    }, 800);
  };

  const handleGeneratePDF = (apt) => {
    const rxData = apt.prescription
      ? { ...buildPrescriptionData(apt), ...apt.prescription, patientName: apt.patientName, patientAge: apt.patientAge, patientGender: apt.patientGender, doctorName: user?.name || apt.doctorName, qualification: docQual }
      : buildPrescriptionData(apt);

    if (!rxData.diagnosis) { toast.error('No prescription data to generate PDF.'); return; }
    generatePrescriptionPDF(rxData);
    toast.success('Prescription PDF downloaded!');
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
            Today's Appointments
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-slate-650">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-750 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3">Patient</th>
                  <th className="py-3">Time</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-750">
                {appointments.map(apt => {
                  const patientName = apt.patient_details ? `${apt.patient_details.first_name} ${apt.patient_details.last_name}` : apt.patientName;
                  return (
                  <tr key={apt.id}>
                    <td className="py-4 font-bold text-slate-900 dark:text-white">{patientName}</td>
                    <td className="py-4">{apt.time}</td>
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
                      {apt.status === 'Upcoming' && (
                        <>
                          <button
                            onClick={async () => {
                              try {
                                await api.patch(`/appointments/${apt.id}/status/`, { status: 'Checked In' });
                                fetchDoctorAppointments();
                                toast.success("Marked as Checked In");
                              } catch (e) {
                                toast.error("Failed to update status");
                              }
                            }}
                            className="rounded-lg bg-teal-100 px-3 py-1.5 text-[10px] font-bold text-teal-700 hover:bg-teal-200 dark:bg-teal-900 dark:text-teal-300 dark:hover:bg-teal-800 shadow-sm"
                          >
                            Check In
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await api.post(`/appointments/${apt.id}/cancel/`);
                                fetchDoctorAppointments();
                                toast.success("Appointment Cancelled");
                              } catch (e) {
                                toast.error("Failed to cancel");
                              }
                            }}
                            className="rounded-lg bg-red-50 px-3 py-1.5 text-[10px] font-bold text-red-600 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-900/60 shadow-sm"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => ['Upcoming', 'Checked In'].includes(apt.status) ? setActivePrescribeApt(apt) : setSelectedPatientApt(apt)}
                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 shadow-sm"
                      >
                        {['Upcoming', 'Checked In'].includes(apt.status) ? 'Complete Consult' : 'View History'}
                      </button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Enhanced Prescription Modal ──────────────────────── */}
        {activePrescribeApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => { setActivePrescribeApt(null); resetPrescriptionForm(); }} />
            <div className="w-full max-w-2xl bg-white rounded-3xl z-10 shadow-2xl overflow-hidden dark:bg-slate-900 border border-slate-150 dark:border-slate-800 max-h-[92vh] flex flex-col">

              {/* Modal Header */}
              <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-primary-600 to-teal-500 shrink-0">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <FiFileText className="h-4 w-4" /> Write Prescription
                  </h3>
                  <p className="text-[10px] text-primary-100">Patient: {activePrescribeApt.patient_details ? `${activePrescribeApt.patient_details.first_name} ${activePrescribeApt.patient_details.last_name}` : activePrescribeApt.patientName} · {activePrescribeApt.date} at {activePrescribeApt.time}</p>
                </div>
                <button onClick={() => { setActivePrescribeApt(null); resetPrescriptionForm(); }} className="text-white/70 hover:text-white text-xl font-bold">&times;</button>
              </div>

              <form onSubmit={handlePrescriptionSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">

                {/* Patient Info */}
                <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <div><span className="text-slate-400 block text-[10px]">Patient</span>{activePrescribeApt.patient_details ? `${activePrescribeApt.patient_details.first_name} ${activePrescribeApt.patient_details.last_name}` : activePrescribeApt.patientName}</div>
                  <div><span className="text-slate-400 block text-[10px]">Age / Gender</span>{activePrescribeApt.patient_details?.age || activePrescribeApt.patientAge || '—'} / {activePrescribeApt.patient_details?.gender || activePrescribeApt.patientGender || '—'}</div>
                  <div><span className="text-slate-400 block text-[10px]">Symptoms</span><span className="truncate block">{activePrescribeApt.reason || activePrescribeApt.notes}</span></div>
                </div>

                {/* Diagnosis */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                    Diagnosis <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. Viral Fever with URTI, Hypertension Stage 1..."
                    value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-white resize-none focus:border-primary-500 focus:outline-none"
                  />
                </div>

                {/* Medicines */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                      Medicines <span className="text-red-500">*</span>
                    </label>
                    <button type="button" onClick={handleAddMedRow} className="text-[10px] font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center space-x-0.5">
                      <FiPlusCircle className="mr-0.5" /> Add Medicine
                    </button>
                  </div>

                  <div className="space-y-2">
                    {medsList.map((med, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-1.5 items-center">
                        <input
                          type="text" required placeholder="Medicine Name (e.g. Paracetamol 650mg)" value={med.name}
                          onChange={e => handleMedChange(idx, 'name', e.target.value)}
                          className="col-span-4 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-white focus:border-primary-500 focus:outline-none"
                        />
                        <input
                          type="text" required placeholder="Dosage (e.g. 1 tab after food)" value={med.dosage}
                          onChange={e => handleMedChange(idx, 'dosage', e.target.value)}
                          className="col-span-3 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-white focus:border-primary-500 focus:outline-none"
                        />
                        <select
                          value={med.frequency}
                          onChange={e => handleMedChange(idx, 'frequency', e.target.value)}
                          className="col-span-3 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-white focus:border-primary-500 focus:outline-none"
                        >
                          {FREQUENCY_OPTIONS.map(f => <option key={f}>{f}</option>)}
                        </select>
                        <input
                          type="text" placeholder="Duration" value={med.duration}
                          onChange={e => handleMedChange(idx, 'duration', e.target.value)}
                          className="col-span-1 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-white focus:border-primary-500 focus:outline-none"
                        />
                        {medsList.length > 1 && (
                          <button type="button" onClick={() => handleRemoveMedRow(idx)} className="col-span-1 text-red-400 hover:text-red-600 flex justify-center">
                            <FiTrash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1.5">Fields: Name · Dosage · Frequency · Duration</p>
                </div>

                {/* Tests */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Tests Recommended</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. CBC, Dengue NS1, Lipid Profile..."
                      value={testInput}
                      onChange={e => setTestInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTest(); } }}
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-white focus:border-primary-500 focus:outline-none"
                    />
                    <button type="button" onClick={handleAddTest} className="rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200">
                      Add
                    </button>
                  </div>
                  {testsList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {testsList.map((test, i) => (
                        <span key={i} className="flex items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 text-[10px] font-bold text-teal-700 dark:text-teal-400">
                          {test}
                          <button type="button" onClick={() => handleRemoveTest(i)} className="hover:text-red-500">
                            <FiX className="h-2.5 w-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Advice */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Advice / Clinical Remarks</label>
                  <textarea
                    placeholder="Dietary advice, precautions, lifestyle modifications..."
                    rows={2}
                    value={advice}
                    onChange={e => setAdvice(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-white resize-none focus:border-primary-500 focus:outline-none"
                  />
                </div>

                {/* Follow-up + Notes */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                      <FiCalendar className="inline mr-1 text-primary-500" />Follow-up Date
                    </label>
                    <input
                      type="date"
                      value={followUpDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setFollowUpDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-white focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Internal Notes (Optional)</label>
                    <input
                      type="text"
                      placeholder="Notes for records..."
                      value={clinicalNotes}
                      onChange={e => setClinicalNotes(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-white focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { setActivePrescribeApt(null); resetPrescriptionForm(); }}
                    className="w-1/4 border border-slate-200 rounded-xl py-3 text-xs font-bold hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!diagnosis || medsList.some(m => !m.name)}
                    onClick={() => {
                      const rxData = buildPrescriptionData(activePrescribeApt);
                      generatePrescriptionPDF(rxData);
                      toast.success('Prescription PDF preview generated!');
                    }}
                    className="w-1/3 border border-teal-300 rounded-xl py-3 text-xs font-bold text-teal-700 hover:bg-teal-50 dark:border-teal-700 dark:text-teal-400 dark:hover:bg-teal-950/30 flex items-center justify-center gap-1.5 disabled:opacity-40"
                  >
                    <FiPrinter className="h-3.5 w-3.5" /> Preview PDF
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-teal-500 rounded-xl py-3 text-xs font-extrabold text-white hover:shadow-lg flex items-center justify-center gap-1.5"
                  >
                    {submitLoading ? 'Issuing...' : <><FiCheck className="h-3.5 w-3.5" /> Issue Prescription</>}
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
              <div className="flex justify-between items-center border-b pb-3 mb-4 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-850 dark:text-white">Clinical Case Details</h3>
                <button onClick={() => setSelectedPatientApt(null)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white text-xl">&times;</button>
              </div>
              <div className="space-y-3 text-xs font-semibold text-slate-650 dark:text-slate-350">
                <p><span className="text-slate-400">Patient:</span> {selectedPatientApt.patientName}</p>
                <p><span className="text-slate-400">Age / Gender:</span> {selectedPatientApt.patientAge || '—'} / {selectedPatientApt.patientGender || '—'}</p>
                <p><span className="text-slate-400">Phone:</span> {selectedPatientApt.patientPhone}</p>
                <p><span className="text-slate-400">Symptoms:</span> "{selectedPatientApt.reason}"</p>
                {selectedPatientApt.prescription && (
                  <div className="mt-3 bg-slate-50 p-3 rounded-xl dark:bg-slate-950 space-y-2">
                    <p className="font-bold text-slate-900 dark:text-white">Diagnosis: <span className="text-primary-600">{selectedPatientApt.prescription.diagnosis}</span></p>
                    <p className="font-bold text-slate-900 dark:text-white">Medicines:</p>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {selectedPatientApt.prescription.medicines?.map((m, i) => (
                        <li key={i}>{m.name} — {m.dosage} ({m.frequency}, {m.duration})</li>
                      ))}
                    </ul>
                    {selectedPatientApt.prescription.tests?.length > 0 && (
                      <p><span className="text-slate-400">Tests:</span> {selectedPatientApt.prescription.tests.join(', ')}</p>
                    )}
                    {selectedPatientApt.prescription.followUpDate && (
                      <p><span className="text-slate-400">Follow-up:</span> {selectedPatientApt.prescription.followUpDate}</p>
                    )}
                  </div>
                )}
                {selectedPatientApt.prescription && (
                  <button
                    onClick={() => { handleGeneratePDF(selectedPatientApt); setSelectedPatientApt(null); }}
                    className="w-full mt-2 rounded-xl bg-primary-600 py-2.5 text-xs font-bold text-white hover:bg-primary-700 flex items-center justify-center gap-1.5"
                  >
                    <FiDownload className="h-3.5 w-3.5" /> Download Prescription PDF
                  </button>
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
                  {apt.prescription?.diagnosis && (
                    <p className="text-[10px] text-primary-600 mt-0.5">{apt.prescription.diagnosis}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {apt.prescription && (
                    <button
                      onClick={() => handleGeneratePDF(apt)}
                      className="rounded border border-teal-200 px-2.5 py-1 font-bold text-teal-600 hover:bg-teal-50 dark:border-teal-700 dark:text-teal-400 flex items-center gap-1"
                    >
                      <FiDownload className="h-3 w-3" /> PDF
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedPatientApt(apt)}
                    className="rounded border border-slate-200 px-3 py-1 font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  >
                    Inspect History
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Patient detail Modal */}
        {selectedPatientApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedPatientApt(null)} />
            <div className="w-full max-w-md bg-white rounded-3xl z-10 shadow-2xl p-6 dark:bg-slate-900 border border-slate-150">
              <div className="flex justify-between items-center border-b pb-3 mb-4 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-850 dark:text-white">Clinical Case Details</h3>
                <button onClick={() => setSelectedPatientApt(null)} className="text-slate-400 hover:text-slate-800 text-xl">&times;</button>
              </div>
              <div className="space-y-3 text-xs font-semibold text-slate-650">
                <p><span className="text-slate-400">Patient:</span> {selectedPatientApt.patientName}</p>
                <p><span className="text-slate-400">Phone:</span> {selectedPatientApt.patientPhone}</p>
                <p><span className="text-slate-400">Symptoms:</span> "{selectedPatientApt.reason}"</p>
                {selectedPatientApt.prescription && (
                  <div className="mt-3 bg-slate-50 p-3 rounded-xl dark:bg-slate-950 space-y-1.5">
                    <p className="font-bold text-slate-900 dark:text-white">Diagnosis: <span className="text-primary-600">{selectedPatientApt.prescription.diagnosis}</span></p>
                    <ul className="list-disc pl-4">
                      {selectedPatientApt.prescription.medicines?.map((m, i) => (
                        <li key={i}>{m.name} — {m.dosage}</li>
                      ))}
                    </ul>
                    {selectedPatientApt.prescription.advice && (
                      <p><span className="text-slate-400">Advice:</span> {selectedPatientApt.prescription.advice}</p>
                    )}
                  </div>
                )}
                {selectedPatientApt.prescription && (
                  <button
                    onClick={() => handleGeneratePDF(selectedPatientApt)}
                    className="w-full mt-2 rounded-xl bg-primary-600 py-2.5 text-xs font-bold text-white hover:bg-primary-700 flex items-center justify-center gap-1.5"
                  >
                    <FiDownload className="h-3.5 w-3.5" /> Download PDF
                  </button>
                )}
              </div>
            </div>
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
                onChange={e => setDocFees(parseInt(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block mb-1">Qualifications</label>
              <input
                type="text"
                value={docQual}
                onChange={e => setDocQual(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Specialist Experience (Years)</label>
            <input
              type="number"
              value={docExp}
              onChange={e => setDocExp(parseInt(e.target.value))}
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
