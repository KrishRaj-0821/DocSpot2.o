import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

export const NotFound = () => {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center bg-slate-50 text-center px-4 dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-md space-y-5">
        <FiAlertCircle className="h-16 w-16 text-primary-500 mx-auto animate-bounce" />
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Page Not Found</h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          The link you requested may be broken, or the page might have been removed. Let's redirect you back to the home portal.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 rounded-xl bg-primary-600 px-6 py-3.5 text-xs font-bold text-white shadow hover:bg-primary-750 transition-transform hover:scale-[1.02]"
        >
          <FiHome />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};
export default NotFound;
