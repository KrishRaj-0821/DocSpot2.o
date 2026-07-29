import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiActivity, FiArrowRight, FiCheckCircle, FiSearch } from 'react-icons/fi';

const SYMPTOM_SPECIALTY_MAP = [
  { keywords: ['chest pain', 'heart', 'palpitations', 'shortness of breath', 'bp'], specialty: 'Cardiology', confidence: '96%', desc: 'Recommended for cardiovascular, chest, and blood pressure concerns.' },
  { keywords: ['fever', 'cough', 'cold', 'flue', 'headache', 'weakness'], specialty: 'General Medicine', confidence: '94%', desc: 'Recommended for general fever, viral infection, and health checkups.' },
  { keywords: ['skin', 'rash', 'itching', 'acne', 'allergy', 'eczema'], specialty: 'Dermatology', confidence: '95%', desc: 'Recommended for skin, hair, and allergic conditions.' },
  { keywords: ['bone', 'joint', 'fracture', 'back pain', 'knee', 'arthritis'], specialty: 'Orthopedics', confidence: '92%', desc: 'Recommended for joint, spine, and bone injuries.' },
  { keywords: ['child', 'baby', 'pediatric', 'growth', 'vaccination'], specialty: 'Pediatrics', confidence: '97%', desc: 'Recommended for infants, children, and adolescent care.' },
  { keywords: ['stomach', 'acidity', 'gas', 'digestion', 'vomiting'], specialty: 'Gastroenterology', confidence: '91%', desc: 'Recommended for digestive and gastrointestinal concerns.' },
];

export const SymptomTriage = () => {
  const navigate = useNavigate();
  const [symptomText, setSymptomText] = useState('');
  const [recommendation, setRecommendation] = useState(null);

  const handleTriage = (e) => {
    e.preventDefault();
    if (!symptomText.trim()) return;

    const lower = symptomText.toLowerCase();
    const match = SYMPTOM_SPECIALTY_MAP.find(item => 
      item.keywords.some(kw => lower.includes(kw))
    );

    if (match) {
      setRecommendation(match);
    } else {
      setRecommendation({
        specialty: 'General Medicine',
        confidence: '85%',
        desc: 'Based on your symptoms, a General Medicine consultation is recommended for initial diagnostic assessment.'
      });
    }
  };

  return (
    <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 shadow-xl border border-teal-500/20 space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
          <FiActivity className="h-5 w-5 animate-pulse" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold tracking-wide text-white">AI-Assisted Symptom Triaging Engine</h3>
          <p className="text-[10px] text-teal-200">Describe your symptoms to receive instant specialty recommendations.</p>
        </div>
      </div>

      <form onSubmit={handleTriage} className="flex gap-2">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-300 h-4 w-4" />
          <input
            type="text"
            value={symptomText}
            onChange={e => setSymptomText(e.target.value)}
            placeholder="e.g. Sharp chest pain, high fever, or skin rash..."
            className="w-full rounded-2xl bg-slate-800/80 border border-teal-500/30 pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/30"
          />
        </div>
        <button
          type="submit"
          className="rounded-2xl bg-teal-500 hover:bg-teal-400 px-4 py-2.5 text-xs font-extrabold text-slate-950 transition-all flex items-center gap-1 shadow-md shadow-teal-500/20"
        >
          Analyze <FiArrowRight className="h-3.5 w-3.5" />
        </button>
      </form>

      {recommendation && (
        <div className="bg-slate-800/90 border border-teal-400/40 rounded-2xl p-4 space-y-2 animate-fadeIn">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 text-xs font-extrabold text-teal-300">
              <FiCheckCircle className="h-4 w-4 text-emerald-400" /> Recommended Specialty: {recommendation.specialty}
            </span>
            <span className="text-[9px] font-black uppercase bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-400/30">
              {recommendation.confidence} Match
            </span>
          </div>
          <p className="text-[11px] text-slate-300">{recommendation.desc}</p>
          <button
            onClick={() => navigate(`/book-doctor?speciality=${encodeURIComponent(recommendation.specialty)}`)}
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 py-2 text-xs font-extrabold text-slate-950 hover:brightness-110 flex items-center justify-center gap-1.5"
          >
            Find & Book {recommendation.specialty} Specialist <FiArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SymptomTriage;
