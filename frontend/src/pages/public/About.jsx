import React from 'react';
import { FiCheckCircle, FiAward, FiUsers, FiHeart } from 'react-icons/fi';
import { SEO } from '../../components/SEO';

export const About = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-250">
      <SEO 
        title="About Us" 
        description="Learn about Purnia Care's mission, values, our premium facilities, and our dedication to providing accessible healthcare in Seemanchal." 
      />
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-400">
          Our Vision & Mission
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl leading-tight">
          Pioneering Digital Healthcare in Seemanchal
        </h1>
        <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
          Purnia Care is a patient-centric, unified digital healthcare ecosystem built specifically to bridge the clinical accessibility gap in Purnia, Katihar, Araria, and Kishanganj.
        </p>
      </div>

      {/* Grid of Values */}
      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-3">
          <div className="inline-flex p-3 rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400">
            <FiHeart className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-905 dark:text-white">Patient Centricity</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every feature on our platform—from slot rescheduling to one-click ambulance dispatch—is designed around patient convenience and immediate care response.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-3">
          <div className="inline-flex p-3 rounded-xl bg-teal-50 text-teal-650 dark:bg-teal-950/40 dark:text-teal-405">
            <FiAward className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-905 dark:text-white">NABL Partners</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We collaborate only with certified pathology labs and verified clinical specialists so that diagnostic reports and treatment guidelines are always accurate.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-3">
          <div className="inline-flex p-3 rounded-xl bg-accent-50 text-accent-600 dark:bg-accent-950/40 dark:text-accent-400">
            <FiUsers className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-905 dark:text-white">Unified System</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Connecting patients, clinics, pharmacists, and ambulances under a single portal, offering structured notifications and invoice tracking records.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Our Journey & Community Impact
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
            Purnia Care was founded to solve a critical issue: patients traveling hours from surrounding towns to Line Bazar only to find that doctors were unavailable, clinics were full, or diagnostic scans were priced unpredictably.
            <br /><br />
            By bringing doctors' OPD calendars online, aggregating local pharmacies for home delivery, and creating a transparent booking engine for pathology labs, we have reduced clinical wait times by 65% and optimized emergency response.
          </p>

          <div className="mt-6 space-y-3 text-xs sm:text-sm">
            <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
              <FiCheckCircle className="text-teal-600 dark:text-teal-400" />
              <span>100% Verified Medical Profiles</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
              <FiCheckCircle className="text-teal-600 dark:text-teal-400" />
              <span>Real-time booking and dispatch engine</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
              <FiCheckCircle className="text-teal-600 dark:text-teal-400" />
              <span>Secure, encrypted clinical report storage</span>
            </div>
          </div>
        </div>

        {/* Brand Showcase */}
        <div className="rounded-3xl bg-primary-950 p-10 text-white relative overflow-hidden shadow-xl text-center space-y-6">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-36 w-36 rounded-full bg-teal-500/10 blur-xl" />
          <h3 className="text-lg font-bold">Purnia Care Numbers</h3>
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div>
              <p className="text-3xl font-extrabold text-teal-300">10,000+</p>
              <p className="text-[10px] text-teal-150 uppercase font-bold mt-1">Happy Patients</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-teal-300">50+</p>
              <p className="text-[10px] text-teal-150 uppercase font-bold mt-1">Verified Doctors</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-teal-300">98%</p>
              <p className="text-[10px] text-teal-150 uppercase font-bold mt-1">Order Accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-teal-300">15 min</p>
              <p className="text-[10px] text-teal-150 uppercase font-bold mt-1">Ambulance dispatch</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
export default About;
