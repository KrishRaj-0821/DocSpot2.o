import React, { useState, useEffect } from 'react';
import api from '../../../services/apiService';
import { useAuth } from '../../../context/AuthContext';
import { FiFileText, FiEye, FiDownload, FiActivity, FiUser, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const PatientPrescriptions = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await api.get('/appointments');
        // Filter those belonging to the patient that contain prescription details
        const patientVisits = res.data.filter(a => a.patientEmail === user?.email && a.prescription);
        setAppointments(patientVisits);
      } catch (err) {
        toast.error("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [user]);

  const handleDownload = (doctorName) => {
    toast.success(`PDF prescription by ${doctorName} started downloading.`);
  };

  if (loading) {
    return <div className="text-center py-10">Loading medical prescriptions...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Medical Prescriptions</h1>
        <p className="text-xs text-slate-500">Access official slips, medication dosages, and directions issued by consult doctors.</p>
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-md border dark:bg-slate-800 dark:border-slate-800">
          <FiFileText className="h-12 w-12 text-slate-350 mx-auto mb-3" />
          <p className="text-xs text-slate-400 italic">No prescriptions found. Prescriptions are automatically updated following consultations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {appointments.map(apt => (
            <div key={apt.id} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5 overflow-hidden">
                <div className="rounded-xl bg-primary-50 p-3 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400 shrink-0">
                  <FiFileText className="h-6 w-6" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-850 dark:text-white leading-tight truncate">
                    Prescription by {apt.doctorName}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{apt.prescription.date} | {apt.specialization}</p>
                  <p className="text-[11px] text-slate-500 truncate mt-1">Dosage: {apt.prescription.medicines.map(m => m.name).join(', ')}</p>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setSelectedPrescription(apt)}
                  className="rounded-lg p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30"
                  title="View Prescription"
                >
                  <FiEye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDownload(apt.doctorName)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  title="Download PDF"
                >
                  <FiDownload className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF Mockup Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedPrescription(null)} />
          
          <div className="w-full max-w-2xl bg-white rounded-3xl z-10 shadow-2xl overflow-hidden border border-slate-200 dark:bg-slate-900 dark:border-slate-850">
            {/* Header info */}
            <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800/80 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Clinical PDF Preview</h3>
                <p className="text-[10px] text-slate-405">Reference: #{selectedPrescription.id}</p>
              </div>
              <button 
                onClick={() => setSelectedPrescription(null)}
                className="text-slate-400 hover:text-slate-800 text-xl font-bold dark:hover:text-white"
              >
                &times;
              </button>
            </div>

            {/* Prescription sheet mock */}
            <div className="p-8 text-slate-700 bg-white font-sans text-xs max-h-[70vh] overflow-y-auto space-y-6">
              
              {/* Doctor letterhead */}
              <div className="flex justify-between items-start border-b-2 border-primary-700 pb-4">
                <div>
                  <h2 className="text-base font-extrabold text-primary-750">{selectedPrescription.doctorName}</h2>
                  <p className="text-[10px] text-slate-500 font-semibold">{selectedPrescription.qualification}</p>
                  <p className="text-[10px] text-slate-400">{selectedPrescription.specialization}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-black text-slate-850 uppercase">Purnia Care Labs</h3>
                  <p className="text-[10px] text-slate-400">NH-31 Line Bazar, Purnia</p>
                  <p className="text-[10px] text-slate-400">Phone: +91 6454 224488</p>
                </div>
              </div>

              {/* Patient details block */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-slate-600 font-semibold">
                <div>
                  <p><span className="text-slate-400">Patient:</span> {selectedPrescription.patientName}</p>
                  <p><span className="text-slate-400">Phone:</span> {selectedPrescription.patientPhone}</p>
                </div>
                <div className="text-right">
                  <p><span className="text-slate-400">Date:</span> {selectedPrescription.prescription.date}</p>
                  <p><span className="text-slate-400">Ref:</span> {selectedPrescription.id}</p>
                </div>
              </div>

              {/* Rx prescription sign */}
              <div className="space-y-4 pt-2">
                <span className="text-2xl font-black text-primary-700 font-mono">Rₓ</span>
                
                <table className="w-full text-left font-semibold text-slate-750">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wide">
                      <th className="py-2 w-1/2">Medicine Name & Formulation</th>
                      <th className="py-2 text-right">Dosage & Directions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {selectedPrescription.prescription.medicines.map((med, i) => (
                      <tr key={i}>
                        <td className="py-3 font-bold text-slate-900">{med.name}</td>
                        <td className="py-3 text-right text-slate-600">{med.dosage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Notes */}
              <div className="border-t border-slate-100 pt-4 space-y-1">
                <h4 className="font-bold text-slate-450 uppercase text-[9px] tracking-wide">Clinical Directions</h4>
                <p className="text-slate-600 italic">"{selectedPrescription.prescription.notes}"</p>
              </div>

              {/* Sign */}
              <div className="pt-10 flex justify-end">
                <div className="text-center border-t border-slate-205 pt-2 w-48 text-[10px]">
                  <p className="font-bold text-slate-800">{selectedPrescription.doctorName}</p>
                  <p className="text-slate-400 uppercase tracking-wide">Authorized Signatory</p>
                </div>
              </div>
            </div>

            {/* Print/Download actions */}
            <div className="bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedPrescription(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350 dark:hover:bg-slate-800"
              >
                Close Preview
              </button>
              <button
                onClick={() => handleDownload(selectedPrescription.doctorName)}
                className="rounded-xl bg-primary-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-primary-750"
              >
                Print/Download PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default PatientPrescriptions;
