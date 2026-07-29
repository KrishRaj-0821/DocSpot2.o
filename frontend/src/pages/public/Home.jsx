import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/apiService';
import { mockFAQs, mockReviews } from '../../services/mockData';
import { FiSearch, FiActivity, FiPhoneCall, FiChevronDown, FiPlusCircle, 
  FiCheckCircle, FiStar, FiChevronRight, FiMapPin, FiTruck, FiVideo, FiCheck
} from 'react-icons/fi';
import { FaStethoscope } from 'react-icons/fa';
import { BsCameraVideo, BsShieldCheck, BsFillRecordCircleFill } from 'react-icons/bs';
import { SEO } from '../../components/SEO';
import SymptomTriage from '../../components/SymptomTriage';

export const Home = () => {
  const [searchDocName, setSearchDocName] = useState('');
  const [searchSpecialization, setSearchSpecialization] = useState('');
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [popularDoctors, setPopularDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [instantConsultModal, setInstantConsultModal] = useState(false);
  const [consultStatus, setConsultStatus] = useState('MATCHING'); // MATCHING | CONNECTED
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch popular doctors
    const fetchDocs = async () => {
      try {
        const res = await api.get('/doctors');
        // slice to top 3 doctors
        setPopularDoctors(res.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const handleSearchDocs = (e) => {
    e.preventDefault();
    navigate(`/doctors?search=${searchDocName}&specialization=${searchSpecialization}`);
  };

  const departments = [
    { name: 'Cardiology', desc: 'Heart care, stents, and ECG diagnostics', icon: '❤️' },
    { name: 'Pediatrics', desc: 'Vaccinations, child growth and health checks', icon: '👶' },
    { name: 'Orthopedics', desc: 'Joint replacements, fractures and muscle therapy', icon: '🦴' },
    { name: 'Gynecology', desc: 'Maternity services and prenatal care solutions', icon: '🤰' },
    { name: 'Neurology', desc: 'Stroke treatment and nerve disorders specialty', icon: '🧠' },
    { name: 'Dermatology', desc: 'Skin care, acne therapy, and allergy management', icon: '✨' },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900 transition-colors duration-250">
      <SEO 
        title="Home" 
        description="DocSpot connects you with the finest local doctors, advanced diagnostics, same-day pharmacy, and 24/7 emergency response in Seemanchal." 
      />
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-teal-950 py-20 text-white md:py-28">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Hero Left Content */}
            <div className="space-y-6 lg:col-span-7">
              <motion.span 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center rounded-full bg-teal-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-teal-350 border border-teal-500/30"
              >
                🩺 Region's Pioneer Healthcare Network
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-sans text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]"
              >
                Modern Healthcare, <br />
                <span className="bg-gradient-to-r from-teal-300 to-sky-350 bg-clip-text text-transparent">
                  Right at Your Fingertips
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base text-teal-100 sm:text-lg max-w-xl leading-relaxed"
              >
                DocSpot connects you instantly with the finest local doctors, advanced diagnostics, same-day pharmacy services, and 24/7 emergency response in Seemanchal.
              </motion.p>

              {/* Emergency Banner */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <a 
                  href="tel:+919110000911"
                  className="flex items-center justify-center space-x-2 rounded-xl bg-red-650 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-red-900/30 hover:bg-red-700 transition-all hover:scale-[1.02]"
                >
                  <FiPhoneCall className="h-5 w-5 animate-bounce" />
                  <span>EMERGENCY CALL: 911</span>
                </a>
                <Link 
                  to="/ambulance"
                  className="flex items-center justify-center space-x-2 rounded-xl bg-white px-6 py-4 text-sm font-bold text-primary-900 hover:bg-slate-50 transition-all hover:scale-[1.02] shadow-lg"
                >
                  <span>Book Ambulance</span>
                  <FiChevronRight />
                </Link>
              </motion.div>
            </div>

            {/* Hero Right Widget (Search doctor panel) */}
            <div className="lg:col-span-5">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-3xl p-6 shadow-2xl text-slate-800 dark:text-white"
              >
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                  Find Professional Consultation
                </h2>
                <form onSubmit={handleSearchDocs} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Doctor Name
                    </label>
                    <div className="relative">
                      <FiSearch className="absolute top-3.5 left-4 text-slate-400" />
                      <input 
                        type="text"
                        placeholder="Search by name..."
                        value={searchDocName}
                        onChange={(e) => setSearchDocName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-55 py-3.5 pl-11 pr-4 text-sm focus:border-primary-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Specialization
                    </label>
                    <select
                      value={searchSpecialization}
                      onChange={(e) => setSearchSpecialization(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-55 p-3.5 text-sm focus:border-primary-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 appearance-none"
                    >
                      <option value="">All Specializations</option>
                      <option value="Cardiology">Cardiology (Heart)</option>
                      <option value="Pediatrics">Pediatrics (Children)</option>
                      <option value="Orthopedics">Orthopedics (Bones)</option>
                      <option value="Gynecology">Gynecology (Maternity)</option>
                      <option value="Neurology">Neurology (Brain)</option>
                      <option value="Dermatology">Dermatology (Skin)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-primary-600 py-4 text-sm font-bold text-white shadow-lg hover:bg-primary-750 transition-colors cursor-pointer"
                  >
                    Search Doctors & Hospitals
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Symptom Triaging & 24/7 Instant GP Teleconsult Section */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 relative z-10 space-y-4">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <FaStethoscope className="text-white h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                Need Urgent Doctor Advice Right Now? <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase">Practo Consult</span>
              </h3>
              <p className="text-[11px] text-teal-100 mt-0.5">Connect to an online General Practitioner in &lt;60 seconds via 24/7 HD Video/Chat.</p>
            </div>
          </div>

          <button
            onClick={() => {
              setInstantConsultModal(true);
              setConsultStatus('MATCHING');
              setTimeout(() => setConsultStatus('CONNECTED'), 3000);
            }}
            className="w-full sm:w-auto rounded-2xl bg-white text-slate-900 hover:bg-teal-50 px-5 py-3 text-xs font-black shadow-lg transition-all hover:scale-105 shrink-0 flex items-center justify-center gap-2"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            Talk to a GP Now (₹299)
          </button>
        </div>

        <SymptomTriage />
      </section>

      {/* 2. ACTION TILES */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          
          <Link to="/doctors" className="group rounded-2xl bg-white p-6 shadow-xl border border-slate-100 dark:bg-slate-800 dark:border-slate-800 transition-all hover:-translate-y-1 hover:shadow-2xl">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
              <FiActivity className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-primary-600 dark:text-white">Book Consult</h3>
            <p className="mt-2 text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
              Query 10+ certified doctors online and secure virtual or walk-in slots in Line Bazar.
            </p>
          </Link>

          <Link to="/medicines" className="group rounded-2xl bg-white p-6 shadow-xl border border-slate-100 dark:bg-slate-800 dark:border-slate-800 transition-all hover:-translate-y-1 hover:shadow-2xl">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600 dark:bg-accent-950/60 dark:text-accent-400">
              <FiTruck className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-accent-650 dark:text-white">Order Medicines</h3>
            <p className="mt-2 text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
              Browse pharmacies, add prescriptions, and receive home delivery in under 4 hours.
            </p>
          </Link>

          <Link to="/diagnostics" className="group rounded-2xl bg-white p-6 shadow-xl border border-slate-100 dark:bg-slate-800 dark:border-slate-800 transition-all hover:-translate-y-1 hover:shadow-2xl">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-650 dark:bg-teal-950/60 dark:text-teal-400">
              <FiCheckCircle className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-teal-650 dark:text-white">Lab Diagnostics</h3>
            <p className="mt-2 text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
              Compare local pathology rates, schedule home samples, and get verified online PDF reports.
            </p>
          </Link>

          <Link to="/ambulance" className="group rounded-2xl bg-white p-6 shadow-xl border border-slate-100 dark:bg-slate-800 dark:border-slate-800 transition-all hover:-translate-y-1 hover:shadow-2xl">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-650 dark:bg-red-950/60 dark:text-red-400">
              <FiPhoneCall className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-red-650 dark:text-white">Live Ambulance</h3>
            <p className="mt-2 text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
              Dispatch BLS/ALS ambulances with real-time ETA tracking and direct dispatching.
            </p>
          </Link>
        </div>
      </section>

      {/* 3. DEPARTMENTS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Medical Departments
          </h2>
          <p className="mt-2 text-slate-550 dark:text-slate-455 max-w-2xl mx-auto text-sm">
            Specialized departments utilizing state-of-the-art procedures to diagnose and administer comprehensive treatments.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept, index) => (
            <div 
              key={index}
              className="flex items-start space-x-4 rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800/60"
            >
              <span className="text-3xl p-3 bg-slate-50 rounded-xl dark:bg-slate-900">{dept.icon}</span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{dept.name}</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{dept.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. POPULAR DOCTORS */}
      <section className="bg-slate-100 py-16 dark:bg-slate-950/60 transition-colors duration-250">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Featured Medical Experts
              </h2>
              <p className="mt-2 text-sm text-slate-550 dark:text-slate-400">
                Highly experienced consultants offering patient-first diagnostics.
              </p>
            </div>
            <Link 
              to="/doctors" 
              className="group inline-flex items-center space-x-1 text-sm font-bold text-primary-600 dark:text-primary-400"
            >
              <span>View All Doctors</span>
              <FiChevronRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="h-64 animate-pulse rounded-2xl bg-white dark:bg-slate-900" />
              <div className="h-64 animate-pulse rounded-2xl bg-white dark:bg-slate-900" />
              <div className="h-64 animate-pulse rounded-2xl bg-white dark:bg-slate-900" />
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {popularDoctors.map((doc) => (
                <div 
                  key={doc.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-lg border border-slate-100 dark:bg-slate-900 dark:border-slate-800 transition-all hover:scale-[1.01]"
                >
                  <img 
                    src={doc.photo} 
                    alt={doc.name} 
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-6">
                    <span className="inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-750 dark:bg-primary-950/60 dark:text-primary-400">
                      {doc.specialization}
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{doc.name}</h3>
                    <p className="text-xs text-slate-450 dark:text-slate-400 truncate mt-0.5">{doc.qualification}</p>
                    
                    <div className="mt-4 flex items-center space-x-1">
                      <FiStar className="fill-amber-400 stroke-amber-400 text-sm" />
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{doc.rating}</span>
                      <span className="text-xs text-slate-400">({doc.reviewsCount} reviews)</span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">Consultation Fees</p>
                        <p className="text-sm font-extrabold text-slate-900 dark:text-white">₹{doc.fees}</p>
                      </div>
                      <Link 
                        to={`/doctors?book=${doc.id}`}
                        className="rounded-lg bg-primary-600 px-4 py-2 text-xs font-bold text-white hover:bg-primary-750 cursor-pointer"
                      >
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Why DocSpot?
            </h2>
            <p className="mt-4 text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
              We understand that seeking medical care locally is often stressful. DocSpot was engineered to eliminate lines, hidden pricing, and medical availability confusion by bridging patient demands directly to reliable partners.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-start space-x-3">
                <FiCheckCircle className="h-6 w-6 shrink-0 text-teal-600 dark:text-teal-405" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Verified Specialists</p>
                  <p className="text-xs text-slate-500 leading-relaxed">All doctors and hospitals hold active medical certifications.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <FiCheckCircle className="h-6 w-6 shrink-0 text-teal-600 dark:text-teal-405" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">No Price Gaps</p>
                  <p className="text-xs text-slate-500 leading-relaxed">Compare costs for scans and diagnostic procedures upfront before booking.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <FiCheckCircle className="h-6 w-6 shrink-0 text-teal-600 dark:text-teal-405" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">24/7 Assistance Desk</p>
                  <p className="text-xs text-slate-500 leading-relaxed">Real-time chat, calls, and ambulance dispatch in any medical emergencies.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Stats Widget */}
          <div className="grid grid-cols-2 gap-6 bg-primary-950 p-8 rounded-3xl text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-40 w-40 rounded-full bg-teal-500/10 blur-xl" />
            
            <div className="space-y-1">
              <p className="text-4xl font-extrabold text-teal-300">10k+</p>
              <p className="text-xs text-teal-150 font-bold uppercase">Patients Served</p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-extrabold text-teal-300">50+</p>
              <p className="text-xs text-teal-150 font-bold uppercase">Doctors Verified</p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-extrabold text-teal-300">15+</p>
              <p className="text-xs text-teal-150 font-bold uppercase">Clinics & Labs</p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-extrabold text-teal-300">20 min</p>
              <p className="text-xs text-teal-150 font-bold uppercase">Avg Ambulance ETA</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PATIENT REVIEWS */}
      <section className="bg-slate-100 py-16 dark:bg-slate-950/60 transition-colors duration-250">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Patient Testimonials
            </h2>
            <p className="mt-2 text-slate-550 dark:text-slate-400 max-w-2xl mx-auto text-sm">
              Read honest stories from residents who trusted DocSpot.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {mockReviews.map((rev) => (
              <div 
                key={rev.id}
                className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-900 dark:border-slate-800"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar 
                        key={i} 
                        className={`text-sm ${
                          i < Math.floor(rev.rating) 
                            ? 'fill-amber-400 stroke-amber-400' 
                            : 'text-slate-200 dark:text-slate-700'
                        }`} 
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="mt-6 flex items-center space-x-3 border-t border-slate-105 pt-4 dark:border-slate-800">
                  <img src={rev.avatar} alt={rev.user} className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-850 dark:text-white">{rev.user}</h4>
                    <span className="text-[10px] uppercase font-bold text-slate-400">{rev.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQs */}
      <section id="faqs" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Common Inquiries
          </h2>
          <p className="mt-2 text-slate-550 dark:text-slate-400 text-sm">
            Answers to general questions regarding appointment booking, delivery, and testing.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {mockFAQs.map((faq, idx) => {
            const isSelected = selectedFaq === idx;
            return (
              <div 
                key={idx}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              >
                <button
                  onClick={() => setSelectedFaq(isSelected ? null : idx)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left font-bold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  <FiChevronDown 
                    className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${
                      isSelected ? 'rotate-180 text-primary-500' : ''
                    }`} 
                  />
                </button>

                {isSelected && (
                  <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-800/80">
                    <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-350 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 24/7 Instant GP WebRTC Call Modal */}
      {instantConsultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setInstantConsultModal(false)} />
          <div className="w-full max-w-lg bg-slate-900 text-white rounded-3xl z-10 shadow-2xl p-6 border border-teal-500/30 text-center space-y-5 relative overflow-hidden">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-extrabold text-teal-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" /> Live 24/7 Triage Queue
              </span>
              <button onClick={() => setInstantConsultModal(false)} className="text-slate-400 hover:text-white text-xl font-bold">&times;</button>
            </div>

            {consultStatus === 'MATCHING' ? (
              <div className="py-8 space-y-4">
                <div className="mx-auto w-20 h-20 rounded-full border-4 border-teal-500/30 border-t-teal-400 animate-spin flex items-center justify-center">
                  <FaStethoscope className="text-teal-400 h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Matching Available Online GP...</h3>
                  <p className="text-xs text-teal-200 mt-1">Connecting to certified General Practitioner via WebRTC (&lt;60s)</p>
                </div>
              </div>
            ) : (
              <div className="py-4 space-y-4">
                <div className="bg-slate-800 rounded-2xl p-4 border border-teal-400/40 flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200"
                    alt="Dr. Ananya Roy"
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-teal-400"
                  />
                  <div className="text-left">
                    <h4 className="text-sm font-extrabold text-white">Dr. Ananya Roy (MBBS, MD)</h4>
                    <p className="text-[10px] text-teal-300">General Physician · Connected via Secure WebRTC</p>
                    <p className="text-[10px] text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
                      <BsFillRecordCircleFill className="h-2 w-2 text-emerald-400 animate-ping" /> Live Encrypted Call Active
                    </p>
                  </div>
                </div>

                <div className="h-44 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
                  <div className="text-center space-y-2">
                    <BsCameraVideo className="h-10 w-10 text-teal-400 mx-auto" />
                    <p className="text-xs text-slate-400">HD WebRTC Video Room Connected</p>
                    <span className="px-3 py-1 bg-emerald-950 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-800">
                      Audio & Video Encrypted
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setInstantConsultModal(false)}
                    className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 py-3 text-xs font-extrabold text-white shadow"
                  >
                    End Teleconsultation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
export default Home;
