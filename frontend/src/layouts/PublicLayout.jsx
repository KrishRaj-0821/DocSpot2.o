import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const PublicLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-850 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Navigation bar */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
export default PublicLayout;
