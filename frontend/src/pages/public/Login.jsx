import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiActivity, FiKey } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { SEO } from '../../components/SEO';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect target
  const from = location.state?.from?.pathname || '/';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all credentials.");
      return;
    }

    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);

    if (res.success && res.user) {
      toast.success(`Welcome back, ${res.user.name || 'User'}!`);
      
      // Determine landing page depending on role if redirect was '/'
      if (from === '/') {
        if (res.user.role === 'patient') navigate('/patient/dashboard');
        else if (res.user.role === 'doctor') navigate('/doctor/dashboard');
        else if (res.user.role === 'hospital') navigate('/hospital/dashboard');
        else if (res.user.role === 'admin') navigate('/admin/dashboard');
      } else {
        navigate(from, { replace: true });
      }
    } else {
      toast.error(res.message);
    }
  };

  // Quick credentials selectors for demo purposes
  const triggerQuickLogin = async (role) => {
    setSubmitting(true);
    let credentials = { email: '', password: 'password123' };

    switch (role) {
      case 'patient': credentials.email = 'patient@purniacare.com'; break;
      case 'doctor': credentials.email = 'doctor@purniacare.com'; break;
      case 'hospital': credentials.email = 'hospital@purniacare.com'; break;
      case 'admin': credentials.email = 'admin@purniacare.com'; break;
      default: return;
    }

    const res = await login(credentials.email, credentials.password);
    setSubmitting(false);

    if (res.success) {
      toast.success(`Demo Login Successful as ${res.user.role.toUpperCase()}`);
      if (role === 'patient') navigate('/patient/dashboard');
      else if (role === 'doctor') navigate('/doctor/dashboard');
      else if (role === 'hospital') navigate('/hospital/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-12 transition-colors duration-250">
      <SEO 
        title="Account Login" 
        description="Access your patient records, doctor consulting dashboards, hospital admin panels, or pharmacy orders portal." 
      />
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 shadow-xl border border-slate-100 dark:bg-slate-800 dark:border-slate-800">
        
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 text-primary-700 dark:text-primary-400">
            <FiActivity className="h-8 w-8 stroke-[2.5]" />
            <span className="font-sans text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
              Purnia<span className="text-primary-600 dark:text-primary-400 font-extrabold">Care</span>
            </span>
          </Link>
          <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            Log in to your account
          </h1>
          <p className="mt-1.5 text-xs text-slate-500">
            Access consultations, orders, and patient records.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <FiMail className="absolute top-3 left-3 text-slate-400" />
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Account Password</label>
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

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-primary-600 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-primary-750 transition-colors cursor-pointer"
          >
            {submitting ? 'Authenticating credentials...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Accounts Panel */}
        <div className="border-t border-slate-100 pt-6 dark:border-slate-700/60">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-450 dark:text-slate-400 mb-3 justify-center">
            <FiKey className="text-primary-550" />
            <span>QUICK ACCESS (TESTING DEMO DECK)</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-[10px] font-extrabold text-slate-700 dark:text-slate-300">
            <button
              onClick={() => triggerQuickLogin('patient')}
              className="rounded-lg border border-slate-200 py-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900 cursor-pointer"
            >
              Patient Dashboard
            </button>
            <button
              onClick={() => triggerQuickLogin('doctor')}
              className="rounded-lg border border-slate-200 py-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900 cursor-pointer"
            >
              Doctor Dashboard
            </button>
            <button
              onClick={() => triggerQuickLogin('hospital')}
              className="rounded-lg border border-slate-200 py-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900 cursor-pointer"
            >
              Hospital Dashboard
            </button>
            <button
              onClick={() => triggerQuickLogin('admin')}
              className="rounded-lg border border-slate-200 py-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900 cursor-pointer"
            >
              Admin Dashboard
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-primary-600 hover:underline dark:text-primary-400">
            Create Profile
          </Link>
        </div>

      </div>
    </div>
  );
};
export default Login;
