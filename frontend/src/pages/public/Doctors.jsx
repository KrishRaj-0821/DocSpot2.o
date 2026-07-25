import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/apiService';
import { mockHospitals } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import { FiFilter, FiSearch, FiCalendar, FiClock, FiDollarSign, FiUser, FiInfo, FiCheckCircle, FiHome } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { SEO } from '../../components/SEO';

export const Doctors = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  // States
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get('specialization') || '');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  
  // Booking modal state
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '');
  const [bookingReason, setBookingReason] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/doctors');
        setDoctors(res.data);
      } catch (err) {
        toast.error("Failed to load doctor database.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Filter application
  useEffect(() => {
    let result = doctors;

    if (searchTerm) {
      result = result.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedSpecialty) {
      result = result.filter(doc => doc.specialization === selectedSpecialty);
    }
    if (selectedHospital) {
      result = result.filter(doc => doc.hospitalId === selectedHospital);
    }
    if (selectedExperience) {
      const expLimit = parseInt(selectedExperience);
      result = result.filter(doc => doc.experience >= expLimit);
    }

    setFilteredDoctors(result);
  }, [doctors, searchTerm, selectedSpecialty, selectedHospital, selectedExperience]);

  // Open booking modal if query parameter ?book=doc-id is present
  useEffect(() => {
    const bookId = searchParams.get('book');
    if (bookId && doctors.length > 0) {
      const doc = doctors.find(d => d.id === bookId);
      if (doc) {
        setSelectedDoc(doc);
      }
    }
  }, [searchParams, doctors]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime || !patientName || !patientPhone) {
      toast.error("Please fill in all booking details.");
      return;
    }

    setBookingLoading(true);
    try {
      const payload = {
        doctorId: selectedDoc.id,
        doctorName: selectedDoc.name,
        specialization: selectedDoc.specialization,
        patientName,
        patientPhone,
        date: bookingDate,
        time: bookingTime,
        fees: selectedDoc.fees,
        reason: bookingReason,
      };

      await api.post('/book-appointment', payload);
      toast.success(`Successfully booked appointment with ${selectedDoc.name}!`);
      
      // Reset & close
      setSelectedDoc(null);
      setBookingDate('');
      setBookingTime('');
      setBookingReason('');
    } catch (err) {
      toast.error("Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-250">
      <SEO 
        title="Find Doctors" 
        description="Browse and book appointments with leading cardiologists, pediatricians, gynecologists, neurologists, and dermatologists in Purnia." 
      />
      
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Consult Certified Doctors
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Search specialist doctors and book slots at local Purnia hospitals.
        </p>
      </div>

      {/* Search & Filter Header Bar */}
      <div className="mt-8 grid grid-cols-1 gap-4 rounded-2xl bg-white p-4 shadow-md dark:bg-slate-800 lg:grid-cols-12">
        <div className="relative lg:col-span-4">
          <FiSearch className="absolute top-3.5 left-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by doctor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <div className="lg:col-span-3">
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="">All Specializations</option>
            <option value="Cardiology">Cardiology (Heart)</option>
            <option value="Pediatrics">Pediatrics (Children)</option>
            <option value="Orthopedics">Orthopedics (Bones)</option>
            <option value="Gynecology">Gynecology (Maternity)</option>
            <option value="Neurology">Neurology (Brain)</option>
            <option value="Dermatology">Dermatology (Skin)</option>
            <option value="Oncology">Oncology (Cancer)</option>
            <option value="Ophthalmology">Ophthalmology (Eyes)</option>
          </select>
        </div>

        <div className="lg:col-span-3">
          <select
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="">All Associated Hospitals</option>
            {mockHospitals.map(hosp => (
              <option key={hosp.id} value={hosp.id}>{hosp.name}</option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <select
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="">Experience</option>
            <option value="5">5+ Years</option>
            <option value="10">10+ Years</option>
            <option value="15">15+ Years</option>
          </select>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-white dark:bg-slate-800" />
          ))}
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-lg font-semibold text-slate-500 dark:text-slate-400">No doctors match your search filters.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedSpecialty(''); setSelectedHospital(''); setSelectedExperience(''); }}
            className="mt-4 rounded-lg bg-primary-650 px-4 py-2 text-xs font-bold text-white hover:bg-primary-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doc) => (
            <motion.div 
              key={doc.id}
              layout
              className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-lg border border-slate-100 dark:bg-slate-800 dark:border-slate-800"
            >
              <div>
                <div className="flex items-start space-x-4">
                  <img 
                    src={doc.photo} 
                    alt={doc.name} 
                    className="h-20 w-20 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-700 shrink-0"
                  />
                  <div>
                    <span className="inline-block rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-bold text-primary-700 dark:bg-primary-950/60 dark:text-primary-400">
                      {doc.specialization}
                    </span>
                    <h3 className="mt-1.5 text-base font-bold text-slate-900 dark:text-white leading-tight">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{doc.qualification}</p>
                    <p className="mt-1.5 text-[11px] font-semibold text-slate-400 flex items-center">
                      <FiFilter className="mr-1 text-primary-500" /> {doc.experience} years experience
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-700/60 space-y-2 text-xs text-slate-600 dark:text-slate-350">
                  <p className="flex items-center">
                    <FiHome className="mr-2 text-slate-400" />
                    <span className="truncate">{doc.hospitalName}</span>
                  </p>
                  <p className="flex items-center">
                    <FiClock className="mr-2 text-slate-400" />
                    <span>{doc.availableTime} ({doc.availableDays.join(', ')})</span>
                  </p>
                  <p className="flex items-center">
                    <FiDollarSign className="mr-2 text-slate-400" />
                    <span className="font-semibold text-slate-950 dark:text-white">Consultation Fees: ₹{doc.fees}</span>
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="w-full rounded-xl bg-primary-600 py-3 text-xs font-bold text-white shadow-md hover:bg-primary-750 transition-colors cursor-pointer"
                >
                  Book Appointment
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Appointment Booking Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedDoc(null)} />
          
          <div className="w-full max-w-lg z-10 overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-150 dark:border-slate-800">
            <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-850 dark:text-white">Schedule Appointment</h3>
                <p className="text-[10px] text-slate-400">Consultation with {selectedDoc.name}</p>
              </div>
              <button 
                onClick={() => setSelectedDoc(null)} 
                className="text-slate-450 hover:text-slate-800 dark:hover:text-white text-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              <div className="flex items-center space-x-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/40">
                <img src={selectedDoc.photo} alt={selectedDoc.name} className="h-12 w-12 rounded-xl object-cover ring-2 ring-primary-500" />
                <div>
                  <h4 className="text-sm font-bold text-slate-905 dark:text-white">{selectedDoc.name}</h4>
                  <p className="text-xs text-slate-500">{selectedDoc.specialization} | Fees: ₹{selectedDoc.fees}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Patient Full Name</label>
                <div className="relative">
                  <FiUser className="absolute top-3 left-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter patient name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Appointment Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Time Slot</label>
                  <select
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="">Select slot</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="12:30 PM">12:30 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Patient Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="Enter phone number"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Reason (Optional)</label>
                <textarea
                  placeholder="Describe your health symptoms briefly"
                  rows="2"
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 resize-none"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="w-1/3 rounded-xl border border-slate-200 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-350 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="flex-1 rounded-xl bg-primary-600 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-primary-750 transition-colors"
                >
                  {bookingLoading ? 'Requesting slot...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Doctors;
