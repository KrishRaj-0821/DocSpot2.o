import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import {
  FiSearch, FiMapPin, FiCalendar, FiClock, FiStar, FiUser,
  FiCheck, FiChevronRight, FiChevronLeft, FiFilter, FiPhone,
  FiVideo, FiHeart, FiActivity, FiAward
} from 'react-icons/fi';
import { BsCameraVideo, BsHospital, BsPhone, BsEnvelope, BsCapsule } from 'react-icons/bs';
import toast from 'react-hot-toast';

const SPECIALITIES = [
  'All', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Gynecology',
  'Neurology', 'Dermatology', 'Oncology', 'Ophthalmology', 'General Medicine'
];
const CITIES = ['All Cities', 'Purnia', 'Katihar'];
const MORNING_SLOTS = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
const AFTERNOON_SLOTS = ['12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'];
const EVENING_SLOTS = ['04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'];
const TIME_SLOTS = [...MORNING_SLOTS, ...AFTERNOON_SLOTS, ...EVENING_SLOTS];

const StepIndicator = ({ currentStep, totalSteps }) => {
  const labels = ['Search', 'Select Doctor', 'Pick Slot', 'Confirm', 'Done'];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {labels.map((label, idx) => {
        const step = idx + 1;
        const isActive = step === currentStep;
        const isDone = step < currentStep;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all duration-300 ${
                isDone ? 'bg-teal-500 text-white shadow-md shadow-teal-200'
                : isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 ring-4 ring-primary-100'
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
              }`}>
                {isDone ? <FiCheck className="h-3.5 w-3.5" /> : step}
              </div>
              <span className={`text-[9px] mt-1.5 font-bold tracking-wide ${
                isActive ? 'text-primary-600' : isDone ? 'text-teal-600' : 'text-slate-400'
              }`}>{label}</span>
            </div>
            {idx < labels.length - 1 && (
              <div className={`h-0.5 w-10 sm:w-16 mb-5 transition-all duration-500 ${
                step < currentStep ? 'bg-teal-400' : 'bg-slate-200 dark:bg-slate-700'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const DoctorCard = ({ doctor, selected, onSelect }) => (
  <div
    onClick={() => onSelect(doctor)}
    className={`relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 hover:shadow-lg ${
      selected
        ? 'border-primary-500 bg-primary-50/60 shadow-md shadow-primary-100 dark:bg-primary-950/20 dark:border-primary-500'
        : 'border-slate-100 bg-white hover:border-primary-200 dark:border-slate-800 dark:bg-slate-800'
    }`}
  >
    {selected && (
      <div className="absolute top-3 right-3 rounded-full bg-primary-600 p-1">
        <FiCheck className="h-3 w-3 text-white" />
      </div>
    )}
    <div className="flex gap-3">
      <img
        src={doctor.photo}
        alt={doctor.name}
        className="h-16 w-16 rounded-xl object-cover shrink-0 ring-2 ring-slate-100 dark:ring-slate-700"
        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150'; }}
      />
      <div className="overflow-hidden flex-1 min-w-0">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{doctor.name}</h3>
        <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wide">{doctor.specialization}</p>
        <p className="text-[10px] text-slate-450 mt-0.5 truncate">{doctor.qualification}</p>
        <div className="flex items-center gap-3 mt-2 text-[10px] font-semibold text-slate-500">
          <span className="flex items-center gap-1">
            <FiStar className="text-amber-400" /> {doctor.rating}
            <span className="text-slate-350">({doctor.reviewsCount})</span>
          </span>
          <span className="flex items-center gap-1">
            <FiMapPin className="text-primary-400" /> {doctor.city}
          </span>
        </div>
      </div>
    </div>
    <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-3">
      <div>
        <p className="text-[10px] text-slate-400 font-semibold">Available</p>
        <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{doctor.availableDays?.join(', ')}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-slate-400 font-semibold">Consultation Fee</p>
        <p className="text-sm font-black text-teal-600">₹{doctor.fees}</p>
      </div>
    </div>
  </div>
);

const SlotButton = ({ time, selected, booked, onSelect }) => (
  <button
    disabled={booked}
    onClick={() => onSelect(time)}
    className={`relative rounded-xl border py-2.5 text-xs font-bold transition-all duration-150 ${
      booked
        ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600'
        : selected
        ? 'border-primary-500 bg-primary-600 text-white shadow-md shadow-primary-200'
        : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-primary-600'
    }`}
  >
    <FiClock className={`h-3 w-3 mx-auto mb-0.5 ${selected ? 'text-white' : booked ? 'text-slate-300' : 'text-primary-500'}`} />
    {time}
    {booked && <span className="absolute -top-1 -right-1 text-[8px] bg-red-100 text-red-500 rounded px-1 font-bold">Booked</span>}
  </button>
);

export const BookDoctor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Step 1 - Filters
  const [speciality, setSpeciality] = useState(searchParams.get('speciality') || 'All');
  const [city, setCity] = useState('All Cities');
  const [hospital, setHospital] = useState('');
  const [searchDate, setSearchDate] = useState('');

  // Step 2 - Selected doctor
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Step 3 - Slot
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isOnline, setIsOnline] = useState(false);

  // Step 4 - Form
  const [reason, setReason] = useState('');
  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '');

  // Step 5 - Confirmation
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Randomly booked slots for realism
  const bookedSlots = ['10:00 AM', '11:30 AM', '02:30 PM', '04:00 PM'];

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/doctors');
      setDoctors(res.data);
    } catch {
      toast.error('Failed to load doctors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(d => {
    const matchSpec = speciality === 'All' || d.specialization === speciality;
    const matchCity = city === 'All Cities' || d.city === city;
    const matchHosp = !hospital || d.hospitalName?.toLowerCase().includes(hospital.toLowerCase());
    return matchSpec && matchCity && matchHosp;
  });

  const handleSelectDoctor = (doc) => {
    if (!user) {
      toast.error('Please login to book an appointment.');
      navigate('/login');
      return;
    }
    setSelectedDoctor(doc);
  };

  const handleBook = async () => {
    if (!reason.trim()) { toast.error('Please describe your reason for visit.'); return; }
    setBookingLoading(true);
    try {
      const payload = {
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        specialization: selectedDoctor.specialization,
        hospitalName: selectedDoctor.hospitalName,
        date: searchDate || new Date().toISOString().split('T')[0],
        time: selectedSlot,
        fees: selectedDoctor.fees,
        online_consultation: isOnline,
        reason,
        patientName: patientName || user?.name,
        patientEmail: user?.email,
        patientPhone: patientPhone || user?.phone,
        status: 'Upcoming'
      };
      const res = await api.post('/book-appointment', payload);
      setConfirmedAppointment({ ...res.data, ...payload, id: res.data?.id || `apt-${Math.floor(1000 + Math.random() * 9000)}` });
      setStep(5);
      toast.success('Appointment booked successfully!');
    } catch (err) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-teal-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-xs font-bold text-primary-700 dark:bg-primary-950/50 dark:text-primary-400 mb-3">
            <FiActivity className="h-3.5 w-3.5" />
            DocSpot · Online Booking
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Book a Doctor Consultation</h1>
          <p className="text-sm text-slate-500 mt-1.5">Search · Select · Confirm — in under 2 minutes</p>
        </div>

        <StepIndicator currentStep={step} totalSteps={5} />

        {/* ── STEP 1: Search & Filter ────────────────────────── */}
        {step === 1 && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <FiFilter className="text-primary-500" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Find your Doctor</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Speciality</label>
                <select
                  value={speciality}
                  onChange={e => setSpeciality(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  {SPECIALITIES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">City / Location</label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Hospital (Optional)</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search hospital name..."
                    value={hospital}
                    onChange={e => setHospital(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 pl-9 text-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Preferred Date</label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    value={searchDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setSearchDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 pl-9 text-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full rounded-2xl bg-gradient-to-r from-primary-600 to-teal-500 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 transition-all flex items-center justify-center gap-2"
            >
              <FiSearch className="h-4 w-4" />
              Search Available Doctors
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ── STEP 2: Doctor Selection ───────────────────────── */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {filteredDoctors.length} Doctor{filteredDoctors.length !== 1 ? 's' : ''} Found
                </h2>
                <p className="text-xs text-slate-500">{speciality !== 'All' ? speciality : 'All Specialities'} · {city}</p>
              </div>
              <button onClick={() => setStep(1)} className="flex items-center gap-1 text-xs font-bold text-primary-600 hover:underline">
                <FiChevronLeft className="h-3.5 w-3.5" /> Edit Search
              </button>
            </div>

            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-10 text-center">
                <FiUser className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400 italic">No doctors found matching your criteria.</p>
                <button onClick={() => setStep(1)} className="mt-4 text-xs font-bold text-primary-600 hover:underline">
                  Adjust Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filteredDoctors.map(doc => (
                  <DoctorCard
                    key={doc.id}
                    doctor={doc}
                    selected={selectedDoctor?.id === doc.id}
                    onSelect={handleSelectDoctor}
                  />
                ))}
              </div>
            )}

            {selectedDoctor && (
              <button
                onClick={() => setStep(3)}
                className="w-full rounded-2xl bg-gradient-to-r from-primary-600 to-teal-500 py-3.5 text-sm font-extrabold text-white shadow-lg flex items-center justify-center gap-2 mt-2"
              >
                Continue with {selectedDoctor.name}
                <FiChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* ── STEP 3: Slot Selection ─────────────────────────── */}
        {step === 3 && selectedDoctor && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Select Time Slot</h2>
                <p className="text-xs text-slate-500 mt-0.5">with {selectedDoctor.name} · {selectedDoctor.availableTime}</p>
              </div>
              <button onClick={() => setStep(2)} className="flex items-center gap-1 text-xs font-bold text-primary-600 hover:underline">
                <FiChevronLeft className="h-3.5 w-3.5" /> Back
              </button>
            </div>

            {/* Doctor mini card */}
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 rounded-2xl p-3">
              <img src={selectedDoctor.photo} alt={selectedDoctor.name}
                className="h-12 w-12 rounded-xl object-cover ring-2 ring-primary-100"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150'; }}
              />
              <div>
                <p className="text-xs font-extrabold text-slate-900 dark:text-white">{selectedDoctor.name}</p>
                <p className="text-[10px] text-primary-600 font-bold">{selectedDoctor.specialization}</p>
                <p className="text-[10px] text-slate-400">{selectedDoctor.hospitalName}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[10px] text-slate-400">Fee</p>
                <p className="text-sm font-black text-teal-600">₹{selectedDoctor.fees}</p>
              </div>
            </div>

            {/* Available days */}
            <div>
              <p className="text-xs font-bold text-slate-500 mb-2">Available Days</p>
              <div className="flex gap-2 flex-wrap">
                {selectedDoctor.availableDays?.map(day => (
                  <span key={day} className="rounded-lg bg-primary-50 dark:bg-primary-950/40 px-3 py-1 text-xs font-bold text-primary-700 dark:text-primary-400">
                    {day}
                  </span>
                ))}
              </div>
            </div>

            {/* Consultation type */}
            <div>
              <p className="text-xs font-bold text-slate-500 mb-2">Consultation Type</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsOnline(false)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition-all ${
                    !isOnline ? 'border-primary-500 bg-primary-600 text-white' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-300'
                  }`}
                >
                  <FiUser className="h-3.5 w-3.5" /> In-Person OPD
                </button>
                <button
                  onClick={() => setIsOnline(true)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition-all ${
                    isOnline ? 'border-teal-500 bg-teal-600 text-white' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-teal-300'
                  }`}
                >
                  <FiVideo className="h-3.5 w-3.5" /> Online / Video
                </button>
              </div>
            </div>

            {/* Time slots segmented into Morning, Afternoon, Evening */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> Morning Slots (09:00 AM - 11:30 AM)
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {MORNING_SLOTS.map(t => (
                    <SlotButton
                      key={t}
                      time={t}
                      selected={selectedSlot === t}
                      booked={bookedSlots.includes(t)}
                      onSelect={setSelectedSlot}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary-500" /> Afternoon Slots (12:00 PM - 03:30 PM)
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {AFTERNOON_SLOTS.map(t => (
                    <SlotButton
                      key={t}
                      time={t}
                      selected={selectedSlot === t}
                      booked={bookedSlots.includes(t)}
                      onSelect={setSelectedSlot}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-teal-500" /> Evening Slots (04:00 PM - 05:30 PM)
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {EVENING_SLOTS.map(t => (
                    <SlotButton
                      key={t}
                      time={t}
                      selected={selectedSlot === t}
                      booked={bookedSlots.includes(t)}
                      onSelect={setSelectedSlot}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex gap-4 text-[10px] font-semibold">
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-primary-600 inline-block" /> Selected</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-white border border-primary-600 inline-block" /> Available</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-slate-100 border border-slate-200 inline-block" /> Booked</span>
                </div>

                <button
                  onClick={() => toast.success(`Added to Smart Waitlist for ${selectedDoctor?.name}! You will be alerted instantly if a slot is cancelled.`)}
                  className="text-[10px] font-extrabold text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center gap-1 transition-all"
                >
                  <FiZap className="h-3.5 w-3.5 text-amber-500" /> Join Smart Cancellation Waitlist
                </button>
              </div>
            </div>

            <button
              disabled={!selectedSlot}
              onClick={() => setStep(4)}
              className="w-full rounded-2xl bg-gradient-to-r from-primary-600 to-teal-500 py-3.5 text-sm font-extrabold text-white shadow-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirm Slot: {selectedSlot || 'Not Selected'}
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ── STEP 4: Confirm Details ────────────────────────── */}
        {step === 4 && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Confirm Appointment</h2>
              <button onClick={() => setStep(3)} className="flex items-center gap-1 text-xs font-bold text-primary-600 hover:underline">
                <FiChevronLeft className="h-3.5 w-3.5" /> Back
              </button>
            </div>

            {/* Booking & Price Breakdown Card */}
            <div className="rounded-2xl border border-primary-100 bg-primary-50/50 dark:border-primary-900/30 dark:bg-primary-950/20 p-4 space-y-2.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Doctor</span><span>{selectedDoctor?.name}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Speciality</span><span>{selectedDoctor?.specialization}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Hospital</span><span>{selectedDoctor?.hospitalName}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Date & Time</span><span className="font-bold text-slate-700 dark:text-slate-300">{searchDate || 'Today'} at {selectedSlot}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Consultation Mode</span>
                <span className="flex items-center gap-1.5 font-semibold">
                  {isOnline ? (
                    <><BsCameraVideo className="text-sky-500" /> Online / Video</>
                  ) : (
                    <><BsHospital className="text-teal-500" /> In-Person OPD</>
                  )}
                </span>
              </div>

              <div className="border-t border-primary-200 dark:border-primary-800/60 pt-2 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Consultation Fee</span><span>₹{selectedDoctor?.fees}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Platform & Processing Fee</span><span>₹50</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>DocSpot Welcome Discount</span><span>-₹50</span>
                </div>
                <div className="border-t border-primary-200 dark:border-primary-800/60 pt-2 flex justify-between text-sm font-black text-teal-600">
                  <span>Total Amount Payable</span><span>₹{selectedDoctor?.fees}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:border-primary-500 focus:outline-none dark:text-white"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={e => setPatientPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 pl-9 text-sm focus:border-primary-500 focus:outline-none dark:text-white"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Reason for Visit / Symptoms *</label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  rows={2}
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:border-primary-500 focus:outline-none dark:text-white resize-none"
                  placeholder="Describe your symptoms or reason for consultation..."
                />
              </div>

              {/* Pre-Visit Digital Intake (Zocdoc Model) */}
              <div className="rounded-2xl border border-teal-100 bg-teal-50/60 dark:border-teal-900/40 dark:bg-teal-950/20 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                    <FiShield className="h-4 w-4 text-teal-600" /> Optional Pre-Visit Digital Intake
                  </span>
                  <span className="text-[9px] font-bold bg-teal-200 dark:bg-teal-900 text-teal-800 dark:text-teal-200 px-2 py-0.5 rounded-full">
                    Saves OPD Time
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Known Allergies</label>
                    <input
                      type="text"
                      placeholder="e.g. Penicillin, Sulfa, Dust..."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs focus:outline-none dark:text-white"
                      onChange={e => sessionStorage.setItem('intake_allergies', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Current Medications</label>
                    <input
                      type="text"
                      placeholder="e.g. Amlodipine 5mg, Metformin..."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs focus:outline-none dark:text-white"
                      onChange={e => sessionStorage.setItem('intake_medications', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Insurance Policy / Ayushman Bharat ID</label>
                  <input
                    type="text"
                    placeholder="e.g. ABHA-12-3456-7890 or Star Health #987213"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs focus:outline-none dark:text-white"
                    onChange={e => sessionStorage.setItem('intake_insurance', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleBook}
              disabled={bookingLoading || !reason.trim()}
              className="w-full rounded-2xl bg-gradient-to-r from-primary-600 to-teal-500 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-primary-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bookingLoading ? (
                <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Booking...</>
              ) : (
                <><FiHeart className="h-4 w-4" /> Confirm & Book Appointment</>
              )}
            </button>
          </div>
        )}

        {/* ── STEP 5: Confirmation ───────────────────────────── */}
        {step === 5 && confirmedAppointment && (
          <div className="text-center space-y-6">
            {/* Success animation */}
            <div className="flex justify-center">
              <div className="relative h-24 w-24">
                <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-ping" />
                <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-teal-500 to-primary-600 flex items-center justify-center shadow-xl shadow-teal-200">
                  <FiCheck className="h-12 w-12 text-white stroke-[3]" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Appointment Confirmed!</h2>
              <p className="text-sm text-slate-500 mt-1">You'll receive a confirmation via SMS / WhatsApp</p>
            </div>

            {/* Appointment ID card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl p-6 text-left space-y-4 max-w-md mx-auto">
              <div className="text-center pb-3 border-b border-slate-100 dark:border-slate-700">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Appointment ID</p>
                <p className="text-xl font-black text-primary-600 mt-1 tracking-wider">{confirmedAppointment.id?.toUpperCase()}</p>
              </div>

              {[
                { label: 'Doctor', value: confirmedAppointment.doctorName },
                { label: 'Speciality', value: confirmedAppointment.specialization },
                { label: 'Hospital', value: confirmedAppointment.hospitalName },
                { label: 'Date', value: confirmedAppointment.date || 'Next Available' },
                { label: 'Time', value: confirmedAppointment.time },
                { label: 'Mode', value: confirmedAppointment.online_consultation ? 'Online / Video' : 'In-Person OPD' },
                { label: 'Fee', value: `₹${confirmedAppointment.fees}` }
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-slate-400 font-semibold">{label}</span>
                  <span className="font-bold text-slate-800 dark:text-white">{value}</span>
                </div>
              ))}
            </div>

            {/* Next steps info boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md mx-auto text-left">
              {[
                { icon: BsPhone, label: 'SMS Alert', desc: 'Sent to your registered mobile', color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40' },
                { icon: BsEnvelope, label: 'Email Confirmation', desc: 'Sent to your email address', color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/40' },
                { icon: BsCapsule, label: 'Post-Consultation', desc: 'Prescription PDF available here', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 text-center flex flex-col items-center">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.color} mb-1`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <p className="text-[10px] font-extrabold text-slate-800 dark:text-white mt-1">{item.label}</p>
                    <p className="text-[9px] text-slate-400">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setStep(1); setSelectedDoctor(null); setSelectedSlot(''); setReason(''); setConfirmedAppointment(null); }}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Book Another
              </button>
              <button
                onClick={() => navigate('/patient/appointments')}
                className="rounded-2xl bg-primary-600 px-6 py-3 text-sm font-bold text-white hover:bg-primary-700 shadow-lg shadow-primary-200"
              >
                View My Appointments
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDoctor;
