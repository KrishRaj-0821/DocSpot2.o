import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/apiService';
import SEO from '../../components/SEO';
import {
  FiMapPin, FiStar, FiCalendar, FiClock, FiCheckCircle,
  FiAward, FiPhone, FiChevronRight, FiShield, FiHeart
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export const DoctorDetail = () => {
  const { doctor_slug } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get('/doctors');
        const docList = res.data;
        const found = docList.find(d => 
          (d.slug || d.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')) === doctor_slug || d.id === doctor_slug
        ) || docList[0];
        setDoctor(found);
      } catch {
        toast.error('Failed to load doctor profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctor_slug]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (!doctor) return null;

  const physicianSchema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": doctor.name,
    "image": doctor.photo,
    "@id": `https://docspot.vercel.app/doctor/${doctor_slug}`,
    "url": `https://docspot.vercel.app/doctor/${doctor_slug}`,
    "priceRange": `₹${doctor.fees}`,
    "medicalSpecialty": doctor.specialization,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": doctor.city || 'Purnia',
      "addressRegion": "Bihar",
      "addressCountry": "IN"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": String(doctor.rating || 4.9),
      "reviewCount": String(doctor.reviewsCount || 120)
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
      <SEO
        title={`${doctor.name} - ${doctor.specialization} in ${doctor.city || 'Purnia'}`}
        description={`Book appointment with ${doctor.name} (${doctor.qualification}). ${doctor.specialization} specialist at ${doctor.hospitalName}. OPD fee ₹${doctor.fees}.`}
        canonicalUrl={`https://docspot.vercel.app/doctor/${doctor_slug}`}
        ogImage={doctor.photo}
        schemaData={physicianSchema}
      />

      <div className="max-w-4xl mx-auto space-y-6">

        {/* Doctor Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-6 items-start">
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="h-32 w-32 rounded-2xl object-cover ring-4 ring-primary-100 dark:ring-primary-900 shrink-0"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300'; }}
          />
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  {doctor.name} <FiShield className="text-teal-500 h-5 w-5" />
                </h1>
                <p className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wide mt-0.5">
                  {doctor.specialization} · {doctor.experience || 12} Years Experience
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{doctor.qualification}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-semibold">Consultation Fee</span>
                <span className="text-2xl font-black text-teal-600">₹{doctor.fees}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-400 border-t border-b border-slate-100 dark:border-slate-800 py-3">
              <span className="flex items-center gap-1 font-bold">
                <FiStar className="text-amber-400 fill-amber-400" /> {doctor.rating || 4.9} ({doctor.reviewsCount || 120} Reviews)
              </span>
              <span className="flex items-center gap-1 font-bold">
                <FiMapPin className="text-primary-500" /> {doctor.hospitalName || 'DocSpot Central Hospital'}, {doctor.city || 'Purnia'}
              </span>
              <span className="flex items-center gap-1 font-bold">
                <FiClock className="text-teal-500" /> {doctor.availableTime || '10:00 AM - 01:00 PM'}
              </span>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => navigate(`/book-doctor?speciality=${encodeURIComponent(doctor.specialization)}`)}
                className="flex-1 rounded-2xl bg-gradient-to-r from-primary-600 to-teal-500 py-3.5 text-xs font-extrabold text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <FiCalendar className="h-4 w-4" /> Book OPD Appointment <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Details breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800 space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b pb-2 dark:border-slate-800">About Practitioner</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {doctor.name} is a highly respected specialist in {doctor.specialization} with over {doctor.experience || 12} years of clinical experience. Specializing in advanced diagnostics, preventive healthcare, and personalized patient management at {doctor.hospitalName}.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800 space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b pb-2 dark:border-slate-800">Clinical Services Provided</h3>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {['OPD Consultation', 'Emergency Telemedicine', 'Prescription Renewal', 'Post-Op Follow-up'].map((srv, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">
                    <FiCheckCircle className="text-teal-500 h-4 w-4 shrink-0" /> {srv}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Hospital Location</h3>
              <p className="text-xs font-bold text-primary-600">{doctor.hospitalName}</p>
              <p className="text-xs text-slate-500">NH-31 Line Bazar, {doctor.city || 'Purnia'}, Bihar</p>
              <div className="pt-2 text-[10px] text-slate-400 font-bold uppercase">OPD Timings</div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{doctor.availableTime || '10:00 AM - 01:00 PM'}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorDetail;
