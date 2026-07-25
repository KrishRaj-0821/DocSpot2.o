import React, { useState, useEffect } from 'react';
import api from '../../../services/apiService';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { generatePrescriptionPDF } from '../../../utils/pdfUtils';
import {
  FiFileText, FiEye, FiDownload, FiShoppingCart,
  FiStar, FiX, FiCalendar, FiActivity, FiCheck
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const StarRating = ({ rating, onRate }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        onClick={() => onRate(star)}
        className={`transition-colors ${star <= rating ? 'text-amber-400' : 'text-slate-300 hover:text-amber-300'}`}
      >
        <FiStar className={`h-5 w-5 ${star <= rating ? 'fill-amber-400' : ''}`} />
      </button>
    ))}
  </div>
);

export const PatientPrescriptions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [ratingModal, setRatingModal] = useState(null);
  const [currentRating, setCurrentRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [submittedRatings, setSubmittedRatings] = useState({});

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await api.get('/appointments');
        const patientVisits = res.data.filter(
          a => a.patientEmail === user?.email && a.prescription
        );
        setAppointments(patientVisits);
      } catch {
        toast.error("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [user]);

  const buildPdfData = (apt) => ({
    prescriptionId: apt.prescription?.id || `PC-${apt.id?.replace('apt-', '').padStart(6, '0')}`,
    date: apt.prescription?.date || apt.date,
    doctorName: apt.doctorName,
    specialization: apt.specialization,
    qualification: apt.qualification || '',
    hospitalName: apt.hospitalName || 'Purnia Care Central Hospital',
    patientName: apt.patientName,
    patientAge: apt.patientAge,
    patientGender: apt.patientGender,
    diagnosis: apt.prescription?.diagnosis || '',
    medicines: apt.prescription?.medicines || [],
    tests: apt.prescription?.tests || [],
    advice: apt.prescription?.advice || '',
    followUpDate: apt.prescription?.followUpDate || '',
  });

  const handleDownload = (apt) => {
    const data = buildPdfData(apt);
    if (!data.diagnosis && !data.medicines?.length) {
      toast.error('Prescription data is incomplete for PDF generation.');
      return;
    }
    generatePrescriptionPDF(data);
    toast.success(`Prescription PDF by ${apt.doctorName} downloaded!`);
  };

  const handleOrderFromRx = (apt) => {
    // Store medicines in sessionStorage so the orders page can pre-fill
    const medicineNames = apt.prescription?.medicines?.map(m => m.name) || [];
    sessionStorage.setItem('rx_medicines', JSON.stringify(medicineNames));
    toast.success('Medicines from prescription added to order!');
    navigate('/patient/orders');
  };

  const handleSubmitRating = () => {
    if (currentRating === 0) { toast.error('Please select a rating.'); return; }
    setSubmittedRatings(prev => ({ ...prev, [ratingModal.id]: currentRating }));
    toast.success(`⭐ Thank you for rating ${ratingModal.doctorName}!`);
    setRatingModal(null);
    setCurrentRating(0);
    setRatingComment('');
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Medical Prescriptions</h1>
        <p className="text-xs text-slate-500">Access official prescriptions, medication dosages, and download PDF slips issued by your doctors.</p>
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-md border dark:bg-slate-800 dark:border-slate-800">
          <FiFileText className="h-12 w-12 text-slate-350 mx-auto mb-3" />
          <p className="text-xs text-slate-400 italic">No prescriptions found. Prescriptions are automatically updated following consultations.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map(apt => (
            <div key={apt.id} className="rounded-2xl bg-white shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 overflow-hidden">
              {/* Card header */}
              <div className="flex items-center gap-4 p-4">
                <div className="rounded-xl bg-primary-50 p-3 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400 shrink-0">
                  <FiFileText className="h-6 w-6" />
                </div>
                <div className="overflow-hidden flex-1">
                  <h4 className="text-xs font-extrabold text-slate-850 dark:text-white leading-tight">
                    Prescription by {apt.doctorName}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {apt.prescription?.date || apt.date} · {apt.specialization}
                  </p>
                  {apt.prescription?.diagnosis && (
                    <p className="text-[10px] text-primary-600 font-semibold mt-0.5 truncate">
                      Dx: {apt.prescription.diagnosis}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    💊 {apt.prescription?.medicines?.map(m => m.name).join(', ')}
                  </p>
                </div>

                {/* Rating badge */}
                {submittedRatings[apt.id] && (
                  <div className="flex items-center gap-0.5 shrink-0">
                    {[...Array(submittedRatings[apt.id])].map((_, i) => (
                      <FiStar key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons row */}
              <div className="flex gap-2 px-4 pb-4 flex-wrap">
                <button
                  onClick={() => setSelectedPrescription(apt)}
                  className="flex items-center gap-1.5 rounded-xl border border-primary-200 bg-primary-50 px-3 py-1.5 text-[10px] font-bold text-primary-700 hover:bg-primary-100 dark:bg-primary-950/30 dark:border-primary-800 dark:text-primary-400"
                >
                  <FiEye className="h-3.5 w-3.5" /> View
                </button>
                <button
                  onClick={() => handleDownload(apt)}
                  className="flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-[10px] font-bold text-teal-700 hover:bg-teal-100 dark:bg-teal-950/30 dark:border-teal-800 dark:text-teal-400"
                >
                  <FiDownload className="h-3.5 w-3.5" /> Download PDF
                </button>
                {apt.prescription?.medicines?.length > 0 && (
                  <button
                    onClick={() => handleOrderFromRx(apt)}
                    className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-bold text-amber-700 hover:bg-amber-100 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400"
                  >
                    <FiShoppingCart className="h-3.5 w-3.5" /> Order Medicines
                  </button>
                )}
                {!submittedRatings[apt.id] && (
                  <button
                    onClick={() => setRatingModal(apt)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400"
                  >
                    <FiStar className="h-3.5 w-3.5" /> Rate Doctor
                  </button>
                )}
              </div>

              {/* Tests & Follow-up badges */}
              {(apt.prescription?.tests?.length > 0 || apt.prescription?.followUpDate) && (
                <div className="flex gap-2 px-4 pb-4 flex-wrap">
                  {apt.prescription?.tests?.map((t, i) => (
                    <span key={i} className="flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 text-[9px] font-bold text-slate-600 dark:text-slate-300">
                      <FiActivity className="h-2.5 w-2.5 text-teal-500" /> {t}
                    </span>
                  ))}
                  {apt.prescription?.followUpDate && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/30 px-2.5 py-0.5 text-[9px] font-bold text-amber-700 dark:text-amber-400">
                      <FiCalendar className="h-2.5 w-2.5" /> Follow-up: {apt.prescription.followUpDate}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Prescription Viewer Modal ────────────────────────── */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedPrescription(null)} />
          <div className="w-full max-w-2xl bg-white rounded-3xl z-10 shadow-2xl overflow-hidden border border-slate-200 dark:bg-slate-900 dark:border-slate-850 max-h-[90vh] flex flex-col">

            {/* Modal header */}
            <div className="bg-gradient-to-r from-primary-600 to-teal-500 px-6 py-4 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-sm font-extrabold text-white">Prescription Preview</h3>
                <p className="text-[10px] text-primary-100">ID: {selectedPrescription.prescription?.id || selectedPrescription.id}</p>
              </div>
              <button onClick={() => setSelectedPrescription(null)} className="text-white/70 hover:text-white text-xl font-bold">&times;</button>
            </div>

            {/* Prescription sheet */}
            <div className="p-8 text-slate-700 bg-white dark:bg-slate-900 font-sans text-xs overflow-y-auto flex-1 space-y-5">

              {/* Doctor letterhead */}
              <div className="flex justify-between items-start border-b-2 border-primary-600 pb-4">
                <div>
                  <h2 className="text-base font-extrabold text-primary-700">{selectedPrescription.doctorName}</h2>
                  <p className="text-[10px] text-slate-500 font-semibold">{selectedPrescription.qualification}</p>
                  <p className="text-[10px] text-slate-400">{selectedPrescription.specialization}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-black text-slate-850 dark:text-white uppercase">Purnia Care</h3>
                  <p className="text-[10px] text-slate-400">NH-31 Line Bazar, Purnia</p>
                  <p className="text-[10px] text-slate-400">Phone: +91 6454 224488</p>
                </div>
              </div>

              {/* Patient details */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-slate-600 dark:text-slate-300 font-semibold">
                <div className="space-y-1">
                  <p><span className="text-slate-400">Patient:</span> {selectedPrescription.patientName}</p>
                  <p><span className="text-slate-400">Age / Gender:</span> {selectedPrescription.patientAge} / {selectedPrescription.patientGender}</p>
                  <p><span className="text-slate-400">Phone:</span> {selectedPrescription.patientPhone}</p>
                </div>
                <div className="text-right space-y-1">
                  <p><span className="text-slate-400">Date:</span> {selectedPrescription.prescription?.date || selectedPrescription.date}</p>
                  <p><span className="text-slate-400">Rx ID:</span> {selectedPrescription.prescription?.id}</p>
                  <p><span className="text-slate-400">Hospital:</span> {selectedPrescription.hospitalName}</p>
                </div>
              </div>

              {/* Diagnosis */}
              {selectedPrescription.prescription?.diagnosis && (
                <div>
                  <h4 className="font-extrabold text-slate-400 uppercase text-[9px] tracking-wide mb-2 border-b border-slate-100 dark:border-slate-700 pb-1">Diagnosis</h4>
                  <p className="text-sm font-bold text-orange-700 dark:text-orange-400">{selectedPrescription.prescription.diagnosis}</p>
                </div>
              )}

              {/* Rx sign + medicines */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-black text-primary-700 font-mono">Rₓ</span>
                  <div className="flex-1 h-0.5 bg-slate-100 dark:bg-slate-700" />
                </div>

                <table className="w-full text-left font-semibold text-slate-750 dark:text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 font-bold uppercase text-[9px] tracking-wide">
                      <th className="py-2">#</th>
                      <th className="py-2">Medicine</th>
                      <th className="py-2">Dosage</th>
                      <th className="py-2">Frequency</th>
                      <th className="py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {selectedPrescription.prescription?.medicines?.map((med, i) => (
                      <tr key={i}>
                        <td className="py-2.5 text-slate-400">{i + 1}.</td>
                        <td className="py-2.5 font-bold text-slate-900 dark:text-white">{med.name}</td>
                        <td className="py-2.5 text-slate-600 dark:text-slate-400">{med.dosage}</td>
                        <td className="py-2.5">{med.frequency}</td>
                        <td className="py-2.5 text-teal-600 font-bold">{med.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tests */}
              {selectedPrescription.prescription?.tests?.length > 0 && (
                <div>
                  <h4 className="font-extrabold text-slate-400 uppercase text-[9px] tracking-wide mb-2 border-b border-slate-100 dark:border-slate-700 pb-1">Tests Recommended</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPrescription.prescription.tests.map((t, i) => (
                      <span key={i} className="rounded-full bg-teal-50 dark:bg-teal-950/40 px-3 py-1 text-xs font-bold text-teal-700 dark:text-teal-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Advice */}
              {selectedPrescription.prescription?.advice && (
                <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                  <h4 className="font-bold text-slate-400 uppercase text-[9px] tracking-wide mb-1">Advice</h4>
                  <p className="text-slate-600 dark:text-slate-400 italic">"{selectedPrescription.prescription.advice}"</p>
                </div>
              )}

              {/* Follow-up */}
              {selectedPrescription.prescription?.followUpDate && (
                <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-xl">
                  <FiCalendar className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-400">
                    Follow-up: {new Date(selectedPrescription.prescription.followUpDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              )}

              {/* Signature */}
              <div className="pt-6 flex justify-end">
                <div className="text-center border-t-2 border-slate-200 dark:border-slate-700 pt-2 w-48">
                  <p className="font-bold text-slate-800 dark:text-white text-xs">{selectedPrescription.doctorName}</p>
                  <p className="text-[10px] text-slate-400">{selectedPrescription.qualification}</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">Authorized Signatory</p>
                </div>
              </div>
            </div>

            {/* Modal footer actions */}
            <div className="bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setSelectedPrescription(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350 dark:hover:bg-slate-800"
              >
                Close
              </button>
              {selectedPrescription.prescription?.medicines?.length > 0 && (
                <button
                  onClick={() => { handleOrderFromRx(selectedPrescription); setSelectedPrescription(null); }}
                  className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-700 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 flex items-center gap-1.5"
                >
                  <FiShoppingCart className="h-3.5 w-3.5" /> Order Medicines
                </button>
              )}
              <button
                onClick={() => handleDownload(selectedPrescription)}
                className="rounded-xl bg-primary-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-primary-750 flex items-center gap-1.5"
              >
                <FiDownload className="h-3.5 w-3.5" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Doctor Rating Modal ──────────────────────────────── */}
      {ratingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setRatingModal(null)} />
          <div className="w-full max-w-sm bg-white rounded-3xl z-10 shadow-2xl p-6 dark:bg-slate-900 border border-slate-150 dark:border-slate-800">
            <div className="text-center mb-5">
              <div className="text-4xl mb-2">⭐</div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Rate Your Doctor</h3>
              <p className="text-xs text-slate-500 mt-1">How was your experience with <strong>{ratingModal.doctorName}</strong>?</p>
            </div>

            <div className="flex justify-center mb-4">
              <StarRating rating={currentRating} onRate={setCurrentRating} />
            </div>

            <div className="mb-4">
              <textarea
                rows={3}
                value={ratingComment}
                onChange={e => setRatingComment(e.target.value)}
                placeholder="Share your experience (optional)..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs resize-none focus:border-primary-500 focus:outline-none dark:text-white"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setRatingModal(null)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                className="flex-1 rounded-xl bg-primary-600 py-2.5 text-xs font-bold text-white hover:bg-primary-700 flex items-center justify-center gap-1.5"
              >
                <FiCheck className="h-3.5 w-3.5" /> Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PatientPrescriptions;
