import React from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      {/* Upper Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Column 1: Info & Logo */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-primary-700 dark:text-primary-400">
              <FiActivity className="h-6 w-6 stroke-[2.5]" />
              <span className="font-sans text-lg font-bold tracking-tight text-slate-800 dark:text-white">
                Purnia<span className="text-primary-600 dark:text-primary-400 font-extrabold">Care</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Simplifying healthcare access across Purnia and Seemanchal regions. Book doctors, query diagnostics, get medicines, and summon emergency care in one click.
            </p>
            <div className="flex space-x-3 text-sm text-slate-500 dark:text-slate-400">
              <FiClock className="h-4.5 w-4.5 mt-0.5 text-primary-600 dark:text-primary-400" />
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">OPD & Support Hours</p>
                <p>Mon - Sat: 08:00 AM - 08:00 PM</p>
                <p className="text-red-500 font-medium">Emergency Care: 24/7 Available</p>
              </div>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Healthcare Services
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/doctors" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Find a Doctor
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Associated Hospitals
                </Link>
              </li>
              <li>
                <Link to="/diagnostics" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Lab & Diagnostic Tests
                </Link>
              </li>
              <li>
                <Link to="/medicines" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Online Medicine Store
                </Link>
              </li>
              <li>
                <Link to="/ambulance" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Emergency Ambulance Book
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Corporate/Support */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Support & Company
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <a href="#faqs" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Partner Portal Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Register as Doctor/Hospital
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <FiMapPin className="mr-2 h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
                <span className="leading-relaxed">
                  Line Bazar, Chowk Road, Purnia, Bihar, Pin - 854301
                </span>
              </li>
              <li className="flex items-center">
                <FiPhone className="mr-2 h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
                <span>+91 6454 224488 / +91 99887 76655</span>
              </li>
              <li className="flex items-center">
                <FiMail className="mr-2 h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
                <span>support@purniacare.com</span>
              </li>
            </ul>
            <div className="mt-4 rounded-lg bg-red-50 p-3 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
              <p className="text-xs font-bold text-red-800 dark:text-red-300">Emergency Hotline:</p>
              <p className="text-sm font-extrabold text-red-650 dark:text-red-400">+91 911 0000 911</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Footer (Copyright and policies) */}
      <div className="bg-slate-50 py-6 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row text-xs">
            <p className="text-slate-500 dark:text-slate-400">
              &copy; {currentYear} Purnia Care. All rights reserved. Made for the people of Purnia.
            </p>
            <div className="flex space-x-4 text-slate-500 dark:text-slate-400">
              <a href="#privacy" className="hover:text-primary-600 hover:underline">Privacy Policy</a>
              <a href="#terms" className="hover:text-primary-600 hover:underline">Terms of Use</a>
              <a href="#disclaimer" className="hover:text-primary-600 hover:underline">Disclaimer</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
