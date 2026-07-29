import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiActivity } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { SEO } from '../../components/SEO';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Purnia');
  const [address, setAddress] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    const payload = {
      name,
      email,
      password,
      phone,
      city,
      address,
      role,
      ...(role === 'doctor' && { specialization: specialty }),
    };

    const res = await register(payload);
    setSubmitting(false);

    if (res.success) {
      toast.success("Account registered successfully!");
      if (role === 'patient') navigate('/patient/dashboard');
      else if (role === 'doctor') navigate('/doctor/dashboard');
      else if (role === 'hospital') navigate('/hospital/dashboard');
    } else {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-12 transition-colors duration-250">
      <SEO 
        title="Register Account" 
        description="Create your patient or provider profile on DocSpot to start booking services online." 
      />
      <div className="w-full max-w-lg space-y-8 rounded-3xl bg-white p-8 shadow-xl border border-slate-100 dark:bg-slate-800 dark:border-slate-800">
        
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-3 group justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white p-1.5 shadow-md ring-1 ring-slate-200/80 dark:bg-slate-800 dark:ring-slate-700 transition-transform group-hover:scale-105">
              <img src="/favicon.svg" alt="DocSpot Logo" className="h-full w-full object-contain" />
            </div>
            <span className="font-sans text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
              Doc<span className="text-primary-600 dark:text-primary-400 font-extrabold">Spot</span>
            </span>
          </Link>
          <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            Create an Account
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Select your account type to register on the platform.
          </p>
        </div>

        {/* Role Select tabs */}
        <div className="flex rounded-xl bg-slate-55 p-1 dark:bg-slate-950 font-bold text-xs">
          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`flex-1 rounded-lg py-2.5 transition-colors cursor-pointer ${
              role === 'patient' 
                ? 'bg-white text-primary-700 shadow-sm dark:bg-slate-800 dark:text-white' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Patient
          </button>
          <button
            type="button"
            onClick={() => setRole('doctor')}
            className={`flex-1 rounded-lg py-2.5 transition-colors cursor-pointer ${
              role === 'doctor' 
                ? 'bg-white text-primary-700 shadow-sm dark:bg-slate-800 dark:text-white' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Medical Doctor
          </button>
          <button
            type="button"
            onClick={() => setRole('hospital')}
            className={`flex-1 rounded-lg py-2.5 transition-colors cursor-pointer ${
              role === 'hospital' 
                ? 'bg-white text-primary-700 shadow-sm dark:bg-slate-800 dark:text-white' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Hospital/Clinic
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                {role === 'hospital' ? 'Hospital / Clinic Name' : 'Full Name'} *
              </label>
              <div className="relative">
                <FiUser className="absolute top-3 left-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Email Address *</label>
              <div className="relative">
                <FiMail className="absolute top-3 left-3 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Account Password *</label>
              <div className="relative">
                <FiLock className="absolute top-3 left-3 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Phone Number *</label>
              <div className="relative">
                <FiPhone className="absolute top-3 left-3 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="+91 XXXXX XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Conditional Specialty Field for Doctor */}
          {role === 'doctor' && (
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Specialization specialty *</label>
              <select
                required
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="">Select Specialty</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Gynecology">Gynecology</option>
                <option value="Neurology">Neurology</option>
                <option value="Dermatology">Dermatology</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="Purnia">Purnia</option>
                <option value="Katihar">Katihar</option>
                <option value="Araria">Araria</option>
                <option value="Kishanganj">Kishanganj</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Full Location Address</label>
              <div className="relative">
                <FiMapPin className="absolute top-3 left-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Street, Landmark, Ward no."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-primary-600 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-primary-750 transition-colors cursor-pointer"
          >
            {submitting ? 'Registering account...' : 'Create DocSpot Account'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary-600 hover:underline dark:text-primary-400">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};
export default Register;
