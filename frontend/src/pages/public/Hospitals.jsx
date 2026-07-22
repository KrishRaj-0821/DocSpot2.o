import React, { useState, useEffect } from 'react';
import api from '../../services/apiService';
import { FiHome, FiMapPin, FiPhone, FiStar, FiChevronRight, FiUsers, FiSliders } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { SEO } from '../../components/SEO';

export const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  
  // Modal state
  const [selectedHospital, setSelectedHospital] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hospRes = await api.get('/hospitals');
        const docRes = await api.get('/doctors');
        setHospitals(hospRes.data);
        setDoctors(docRes.data);
      } catch (err) {
        toast.error("Failed to load hospital databases.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = hospitals;
    
    if (searchTerm) {
      result = result.filter(h => 
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        h.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedDept) {
      result = result.filter(h => h.departments.includes(selectedDept));
    }
    
    setFilteredHospitals(result);
  }, [hospitals, searchTerm, selectedDept]);

  const getDoctorsForHospital = (hospId) => {
    return doctors.filter(d => d.hospitalId === hospId);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-250">
      <SEO 
        title="Partner Hospitals" 
        description="Explore top hospitals in Purnia. Check real-time bed availability, specialized departments, and advanced clinical services." 
      />
      
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Partner Hospitals & Clinics
        </h1>
        <p className="mt-2 text-sm text-slate-550 dark:text-slate-400">
          Find equipped hospitals with specialized departments and book direct OPD consultations.
        </p>
      </div>

      {/* Search Header Bar */}
      <div className="mt-8 grid grid-cols-1 gap-4 rounded-2xl bg-white p-4 shadow-md dark:bg-slate-800 sm:grid-cols-12">
        <div className="relative sm:col-span-8">
          <FiHome className="absolute top-3.5 left-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search hospitals by name, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="">All Departments</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Gynecology">Gynecology</option>
            <option value="Neurology">Neurology</option>
            <option value="Dermatology">Dermatology</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="h-72 animate-pulse rounded-2xl bg-white dark:bg-slate-800" />
          <div className="h-72 animate-pulse rounded-2xl bg-white dark:bg-slate-800" />
        </div>
      ) : filteredHospitals.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-lg font-semibold text-slate-500">No partner hospitals match your search criteria.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredHospitals.map((hosp) => (
            <div 
              key={hosp.id}
              className="overflow-hidden rounded-2xl bg-white shadow-lg border border-slate-100 dark:bg-slate-800 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <img src={hosp.image} alt={hosp.name} className="h-52 w-full object-cover" />
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                      {hosp.name}
                    </h3>
                    <div className="flex items-center space-x-1 rounded bg-amber-50 px-2 py-0.5 dark:bg-amber-950/40 text-xs font-bold text-amber-700 dark:text-amber-400">
                      <FiStar className="fill-amber-400 stroke-amber-400" />
                      <span>{hosp.rating}</span>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center">
                    <FiMapPin className="mr-1.5 shrink-0 text-primary-500" /> {hosp.address}
                  </p>

                  <div className="mt-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Departments Available</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {hosp.departments.map((dept, idx) => (
                        <span 
                          key={idx}
                          className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-350"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 bg-slate-50/50 p-6 dark:border-slate-700/60 dark:bg-slate-900 flex justify-between items-center mt-auto">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center">
                  <FiUsers className="mr-1.5 text-primary-500" /> {getDoctorsForHospital(hosp.id).length} Doctors Staffed
                </span>
                <button
                  onClick={() => setSelectedHospital(hosp)}
                  className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-primary-750 transition-colors cursor-pointer"
                >
                  <span>View Details</span>
                  <FiChevronRight className="ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hospital Detail Overlay Modal */}
      {selectedHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedHospital(null)} />
          
          <div className="w-full max-w-2xl z-10 overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-150 dark:border-slate-800">
            <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-850 dark:text-white">{selectedHospital.name}</h3>
                <p className="text-[10px] text-slate-400">Hospital Directory & Verification</p>
              </div>
              <button 
                onClick={() => setSelectedHospital(null)} 
                className="text-slate-400 hover:text-slate-800 dark:hover:text-white text-xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <img src={selectedHospital.image} alt={selectedHospital.name} className="h-56 w-full object-cover rounded-2xl" />
              
              <div>
                <h4 className="text-sm font-bold text-slate-850 dark:text-white">About the Facility</h4>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                  {selectedHospital.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
                  <p className="font-bold text-slate-400 uppercase tracking-wide text-[9px]">Contact Center</p>
                  <p className="mt-1 font-bold text-slate-800 dark:text-slate-200 flex items-center">
                    <FiPhone className="mr-1 text-primary-500" /> {selectedHospital.contact}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
                  <p className="font-bold text-slate-400 uppercase tracking-wide text-[9px]">Bed Capacity</p>
                  <p className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                    {selectedHospital.bedsCount} Total Beds
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-850 dark:text-white">Core Facilities</h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedHospital.facilities.map((fac, i) => (
                    <span key={i} className="rounded bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/30 px-2.5 py-1 text-xs text-teal-800 dark:text-teal-400 font-semibold">
                      ✓ {fac}
                    </span>
                  ))}
                </div>
              </div>

              {/* On-Staff Doctors */}
              <div>
                <h4 className="text-sm font-bold text-slate-850 dark:text-white">Doctors on Staff</h4>
                <div className="mt-3 space-y-3">
                  {getDoctorsForHospital(selectedHospital.id).length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No verified doctors currently staffed on our platform.</p>
                  ) : (
                    getDoctorsForHospital(selectedHospital.id).map(doc => (
                      <div key={doc.id} className="flex items-center justify-between border border-slate-100 p-3 rounded-xl dark:border-slate-800">
                        <div className="flex items-center space-x-3">
                          <img src={doc.photo} alt={doc.name} className="h-10 w-10 rounded-lg object-cover ring-2 ring-primary-500" />
                          <div>
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white">{doc.name}</h5>
                            <p className="text-[10px] text-slate-450">{doc.specialization} | {doc.qualification}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{doc.availableTime}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Hospitals;
