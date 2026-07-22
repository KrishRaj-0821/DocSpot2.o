import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiCompass } from 'react-icons/fi';

export const ComingSoon = () => {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center bg-slate-50 text-center px-4 dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-md space-y-5">
        <FiCompass className="h-16 w-16 text-teal-650 mx-auto animate-pulse-slow" />
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Feature Coming Soon</h1>
        <p className="text-xs sm:text-sm text-slate-550 leading-relaxed">
          We are currently engineering this module. Stay tuned for future platform upgrades!
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 rounded-xl bg-primary-600 px-6 py-3.5 text-xs font-bold text-white shadow hover:bg-primary-750"
        >
          <FiHome />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};
export default ComingSoon;
