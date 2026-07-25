import React, { useState, useEffect } from 'react';
import api from '../../services/apiService';
import { FiCheckCircle, FiFileText, FiUpload, FiDollarSign, FiClock, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { SEO } from '../../components/SEO';

export const Diagnostics = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Prescription Form state
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [patientPhone, setPatientPhone] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await api.get('/diagnostics');
        setTests(res.data);
      } catch (err) {
        toast.error("Failed to load test packages.");
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredTests(tests.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredTests(tests);
    }
  }, [tests, searchTerm]);

  const handleBookTest = (testName) => {
    toast.success(`Diagnostic booking request received for "${testName}"! Our representative will call to schedule home collection.`);
  };

  const handlePrescriptionSubmit = (e) => {
    e.preventDefault();
    if (!prescriptionFile) {
      toast.error("Please upload a prescription PDF or image.");
      return;
    }
    if (!patientPhone) {
      toast.error("Please enter your contact phone number.");
      return;
    }

    setUploadLoading(true);
    setTimeout(() => {
      setUploadLoading(false);
      toast.success("Prescription uploaded successfully! A medical specialist will contact you in 15 minutes to confirm your test suite.");
      setPrescriptionFile(null);
      setPatientPhone('');
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-250">
      <SEO 
        title="Book Diagnostic Tests" 
        description="Schedule pathology and radiology tests. Compare pricing, packages, and book online for home sample collection in Purnia." 
      />
      
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Lab Tests & Diagnostic Center
        </h1>
        <p className="mt-2 text-sm text-slate-550 dark:text-slate-400">
          Compare pricing, book home blood collection, or upload doctor prescriptions for package formulation.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left Column: Test Listing & Filter */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Search Bar */}
          <div className="relative bg-white p-3 rounded-2xl shadow-sm dark:bg-slate-800">
            <FiSearch className="absolute top-6 left-6 text-slate-400" />
            <input
              type="text"
              placeholder="Search diagnostic packages (e.g. CBC, Lipid, Full Body)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
            />
          </div>

          {/* comparative prices header card */}
          <div className="rounded-2xl bg-teal-900 p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-x-6 translate-y-6 opacity-10">
              <FiCheckCircle className="h-48 w-48" />
            </div>
            <h3 className="text-lg font-bold">DocSpot Price Guarantee</h3>
            <p className="mt-1.5 text-xs text-teal-150 leading-relaxed">
              We partner directly with NABL-accredited diagnostic centers in Line Bazar. You get up to 50% discount on standard scanning and blood profiles.
            </p>
          </div>

          {/* Test Cards List */}
          {loading ? (
            <div className="space-y-4">
              <div className="h-28 animate-pulse rounded-2xl bg-white dark:bg-slate-800" />
              <div className="h-28 animate-pulse rounded-2xl bg-white dark:bg-slate-800" />
            </div>
          ) : filteredTests.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">No diagnostic tests match your keyword.</p>
          ) : (
            <div className="space-y-4">
              {filteredTests.map((test) => {
                const savingsPercent = Math.round(
                  ((test.comparison.othersAvg - test.comparison.DocSpot) / test.comparison.othersAvg) * 100
                );
                return (
                  <div 
                    key={test.id} 
                    className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 flex flex-col md:flex-row justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <span className="inline-block rounded bg-teal-50 px-2 py-0.5 text-[9px] font-bold text-teal-700 dark:bg-teal-950/60 dark:text-teal-400">
                        {test.category}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">{test.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{test.description}</p>
                      
                      <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-slate-450 dark:text-slate-400 font-semibold">
                        <span className="flex items-center"><FiClock className="mr-1 text-primary-500" /> Report within: {test.duration}</span>
                        <span className="flex items-center"><FiFileText className="mr-1 text-primary-500" /> {test.instructions}</span>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-t-0 border-slate-50 pt-4 md:pt-0 shrink-0 md:pl-4 dark:border-slate-700/60">
                      
                      <div className="text-left md:text-right">
                        <div className="flex items-center md:justify-end text-lg font-black text-slate-900 dark:text-white">
                          <FiDollarSign className="text-sm" />
                          <span>₹{test.price}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Others Avg: <span className="line-through">₹{test.comparison.othersAvg}</span>
                        </p>
                        <span className="inline-block rounded bg-red-50 px-1.5 py-0.5 text-[9px] font-bold text-red-650 dark:bg-red-950/40">
                          Save {savingsPercent}%
                        </span>
                      </div>

                      <button
                        onClick={() => handleBookTest(test.name)}
                        className="rounded-lg bg-primary-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-primary-750 transition-colors cursor-pointer"
                      >
                        Book Test
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Upload Prescription Form */}
        <div>
          <div className="sticky top-20 rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">Have a Prescription?</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Don't waste time choosing individual scans. Upload your doctor's slip here. We'll automatically identify and coordinate the correct tests.
            </p>

            <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
              {/* File Upload Box */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50 hover:bg-slate-100 transition-colors dark:border-slate-700 dark:bg-slate-900 text-center">
                <FiUpload className="h-8 w-8 text-primary-500 mb-2 animate-bounce" />
                <label className="cursor-pointer block text-xs font-bold text-slate-700 dark:text-slate-350">
                  <span>Upload Medical Slip</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setPrescriptionFile(e.target.files[0]);
                        toast.success(`Selected file: ${e.target.files[0].name}`);
                      }
                    }}
                  />
                </label>
                <p className="text-[10px] text-slate-400 mt-1">Accepts PDF, JPG, PNG (Max 5MB)</p>
                {prescriptionFile && (
                  <span className="mt-2 text-[10px] font-bold text-teal-650 bg-teal-50 dark:bg-teal-950/60 dark:text-teal-400 px-2 py-0.5 rounded">
                    Selected: {prescriptionFile.name}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Contact Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="Enter phone for confirmation"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={uploadLoading}
                className="w-full rounded-xl bg-primary-600 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-primary-750 transition-colors cursor-pointer"
              >
                {uploadLoading ? 'Processing upload...' : 'Submit Doctor Prescription'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
export default Diagnostics;
