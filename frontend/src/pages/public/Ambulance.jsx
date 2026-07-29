import React, { useState } from 'react';
import { FiPhoneCall, FiMapPin, FiTruck, FiNavigation, FiClock, FiCheckSquare, FiAlertCircle, FiUser } from 'react-icons/fi';
import { mockAmbulances } from '../../services/mockData';
import toast from 'react-hot-toast';
import { SEO } from '../../components/SEO';

export const Ambulance = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [dispatchMode, setDispatchMode] = useState('EMERGENCY'); // EMERGENCY | SCHEDULED_NEMT
  const [nemtTime, setNemtTime] = useState('09:00 AM');
  const [ambulanceType, setAmbulanceType] = useState('Basic Life Support (BLS)');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!pickup || !destination) {
      toast.error("Please fill in pickup and hospital drop locations.");
      return;
    }

    setBookingLoading(true);
    setTimeout(() => {
      // Find matching ambulance or mock one
      const matched = mockAmbulances.find(a => a.type === ambulanceType && a.status === 'Available') || mockAmbulances[0];
      setBookingDetails({
        pickup,
        destination,
        dispatchMode,
        nemtTime,
        ambulanceType,
        driver: matched.driver,
        vehicleNumber: matched.vehicleNumber,
        phone: matched.phone,
        eta: dispatchMode === 'EMERGENCY' ? matched.etaMinutes : `Scheduled for ${nemtTime}`,
        location: matched.locationName
      });
      setBookingLoading(false);
      toast.success(dispatchMode === 'EMERGENCY' ? "🚨 Emergency ride dispatched! Driver is on the way." : `🚘 Scheduled NEMT ride confirmed for ${nemtTime}!`);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-250">
      <SEO 
        title="Emergency & NEMT Medical Transportation" 
        description="Book 24/7 emergency ambulance dispatch or schedule non-emergency medical transportation (NEMT) for elderly, dialysis, and post-op care." 
      />
      
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Medical Transportation & Fleet Dispatch
        </h1>
        <p className="mt-2 text-sm text-slate-550 dark:text-slate-400">
          Instant 24/7 Emergency Ambulance Dispatch & Uber Health-style Scheduled NEMT Assistance.
        </p>
      </div>

      {/* Emergency Helpline Banner */}
      <div className="mt-6 rounded-2xl bg-red-600 p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-bold">Need Immediate Life-Saving Emergency Transit?</h3>
          <p className="text-xs text-red-105 mt-1">For acute trauma, stroke, or heart attack, call our emergency dispatch hotline immediately.</p>
        </div>
        <a
          href="tel:+919110000911"
          className="flex items-center space-x-2 rounded-xl bg-white px-6 py-3.5 text-sm font-extrabold text-red-650 hover:bg-slate-50 hover:scale-[1.03] transition-all shrink-0 cursor-pointer"
        >
          <FiPhoneCall className="h-5 w-5 animate-ping" />
          <span>CALL HELPLINE: 911</span>
        </a>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left: Dispatch Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Request Transport</h3>
              <span className="text-[10px] font-bold bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">Uber Health Integration</span>
            </div>

            {/* Mode Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
              <button
                type="button"
                onClick={() => setDispatchMode('EMERGENCY')}
                className={`py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  dispatchMode === 'EMERGENCY'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FiAlertCircle className="h-3.5 w-3.5" /> Emergency Dispatch
              </button>
              <button
                type="button"
                onClick={() => setDispatchMode('SCHEDULED_NEMT')}
                className={`py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  dispatchMode === 'SCHEDULED_NEMT'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FiTruck className="h-3.5 w-3.5" /> Scheduled NEMT Ride
              </button>
            </div>
            
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Patient Pickup Location</label>
                <div className="relative">
                  <FiMapPin className="absolute top-3 left-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter pickup address / landmark..."
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Destination Hospital / Clinic</label>
                <div className="relative">
                  <FiNavigation className="absolute top-3 left-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter target hospital..."
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {dispatchMode === 'SCHEDULED_NEMT' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Scheduled Pickup Time</label>
                  <select
                    value={nemtTime}
                    onChange={(e) => setNemtTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    <option value="08:00 AM">08:00 AM (Pre-OPD)</option>
                    <option value="10:00 AM">10:00 AM (Dialysis Shift)</option>
                    <option value="02:00 PM">02:00 PM (Afternoon OPD)</option>
                    <option value="05:00 PM">05:00 PM (Post-Op Discharge)</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Ambulance Equipment Type</label>
                  <select
                    value={ambulanceType}
                    onChange={(e) => setAmbulanceType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    <option value="Basic Life Support (BLS)">Basic Life Support (BLS) - Oxygen, Stretchers</option>
                    <option value="Advanced Life Support (ALS)">Advanced Life Support (ALS) - ICU Wards, Ventilators</option>
                    <option value="Neonatal/Pediatric Ambulance">Neonatal/Pediatric - Baby Incubators</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={bookingLoading}
                className={`w-full rounded-xl py-3.5 text-xs font-extrabold text-white shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  dispatchMode === 'EMERGENCY' ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-600 hover:bg-teal-700'
                }`}
              >
                {bookingLoading ? 'Processing telemetry...' : (dispatchMode === 'EMERGENCY' ? <><FiAlertCircle className="h-4 w-4" /> Dispatch Ambulance Now</> : <><FiTruck className="h-4 w-4" /> Schedule NEMT Transport</>)}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Map Tracking Mock */}
        <div className="lg:col-span-7">
          {bookingDetails ? (
            <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 dark:border-slate-700/60">
                <div>
                  <span className="inline-block rounded-full bg-red-50 text-red-600 px-2 py-0.5 text-[9px] font-bold dark:bg-red-950/40 dark:text-red-400">
                    Live Booking Tracking
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">Dispatched to Pickup</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Estimated Arrival</p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center justify-end">
                    <FiClock className="mr-1 text-primary-500" /> {bookingDetails.eta} minutes
                  </p>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="relative">
                <div className="absolute left-4 top-1 h-3/4 w-0.5 bg-slate-100 dark:bg-slate-700" />
                <div className="space-y-6 relative">
                  <div className="flex items-center space-x-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white text-xs font-bold">1</span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Ambulance Dispatched</p>
                      <p className="text-[10px] text-slate-400">Matched from {bookingDetails.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600 text-xs font-bold dark:bg-primary-950/50">2</span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">En route to Patient Location</p>
                      <p className="text-[10px] text-slate-400">Heading towards: {bookingDetails.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-405 text-xs font-bold dark:bg-slate-900">3</span>
                    <div>
                      <p className="text-xs font-bold text-slate-400">Arrival and Hospital Delivery</p>
                      <p className="text-[10px] text-slate-400">Target hospital: {bookingDetails.destination}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver profile */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700/60">
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/40">
                    <FiUser className="text-primary-600 dark:text-primary-400 h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{bookingDetails.driver}</h4>
                    <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wide">{bookingDetails.vehicleNumber}</p>
                  </div>
                </div>
                
                <a
                  href={`tel:${bookingDetails.phone}`}
                  className="rounded-lg bg-primary-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-750 transition-colors"
                >
                  Call Driver
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-100 p-8 text-center border-2 border-dashed border-slate-200 dark:bg-slate-950/20 dark:border-slate-800 flex flex-col items-center justify-center h-full min-h-[300px]">
              <FiTruck className="h-14 w-14 text-slate-300 dark:text-slate-700 mb-3 animate-pulse-slow" />
              <h3 className="text-sm font-bold text-slate-705 dark:text-slate-300">Live Status Screen</h3>
              <p className="text-[11px] text-slate-450 max-w-xs mt-1.5 leading-relaxed">
                Submit pickup and drop details on the left panel to request live coordinates, ETA schedules, and phone links for the designated driver.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
export default Ambulance;
