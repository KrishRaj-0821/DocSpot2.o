import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { SEO } from '../../components/SEO';

export const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in name, email, and message.");
      return;
    }

    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Query sent successfully! Our customer support team will contact you shortly.");
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-250">
      <SEO 
        title="Contact Support" 
        description="Get in touch with DocSpot hospital network for general queries, technical support, partner requests, or emergency assistance." 
      />
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl tracking-tight">
          Contact Customer Support
        </h1>
        <p className="text-sm text-slate-550 dark:text-slate-400">
          Have queries about medicine orders, test schedules, or want to list your clinic? Reach out.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 flex items-start space-x-4">
            <div className="rounded-xl bg-primary-50 p-3 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400 shrink-0">
              <FiMapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Main Office</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                NH-31, Line Bazar Crossway, Purnia, Bihar - 854301
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 flex items-start space-x-4">
            <div className="rounded-xl bg-teal-50 p-3 text-teal-650 dark:bg-teal-950/40 dark:text-teal-405 shrink-0">
              <FiPhone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Support & Emergency Call</h3>
              <p className="text-xs text-slate-500 mt-1">
                Helpdesk: +91 6454 224488 <br />
                Ambulance/Emergency: +91 911 0000 911
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 flex items-start space-x-4">
            <div className="rounded-xl bg-accent-50 p-3 text-accent-600 dark:bg-accent-950/40 dark:text-accent-400 shrink-0">
              <FiMail className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Email Address</h3>
              <p className="text-xs text-slate-500 mt-1">
                support@DocSpot.com <br />
                admin@DocSpot.com
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 flex items-start space-x-4">
            <div className="rounded-xl bg-slate-55 p-3 text-slate-500 dark:bg-slate-900 shrink-0">
              <FiClock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">OPD Operating Hours</h3>
              <p className="text-xs text-slate-500 mt-1">
                Monday to Saturday: 08:00 AM - 08:00 PM <br />
                Sunday: Closed (Except Emergency Room)
              </p>
            </div>
          </div>

        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">Send a Support Query</h3>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Mobile Phone (Optional)</label>
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Message Body *</label>
                <textarea
                  required
                  placeholder="Describe your issue, feedback, or listing query in detail..."
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-primary-600 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-primary-750 transition-colors cursor-pointer"
              >
                <FiSend className="mr-1" />
                <span>{sending ? 'Sending message...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
export default Contact;
