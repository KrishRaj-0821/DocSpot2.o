import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiMail, 
  FiLock, 
  FiActivity, 
  FiUser, 
  FiPlusSquare, 
  FiShield, 
  FiArrowRight 
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { SEO } from '../../components/SEO';

const demoUsers = [
  {
    role: 'patient',
    name: 'Aman Verma',
    email: 'patient@purniacare.com',
    icon: FiUser,
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200/50 dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-900/50',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    desc: 'Access patient records, appointments & order drugs'
  },
  {
    role: 'doctor',
    name: 'Dr. Rajesh Kumar',
    email: 'doctor@purniacare.com',
    icon: FiActivity,
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200/50 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900/50',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150',
    desc: 'Consulting dashboard, schedules & medical records'
  },
  {
    role: 'hospital',
    name: 'Purnia Care Central Hospital',
    email: 'hospital@purniacare.com',
    icon: FiPlusSquare,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/50 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50',
    avatar: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=150',
    desc: 'Bed management, departments & hospital listings'
  },
  {
    role: 'admin',
    name: 'Global Administrator',
    email: 'admin@purniacare.com',
    icon: FiShield,
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    desc: 'Platform administration, security logs & users management'
  },
  {
    role: 'diagnostic_admin',
    name: 'Lal Path Lab Technician',
    email: 'labs@purniacare.com',
    icon: FiActivity,
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200/50 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-900/50',
    avatar: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=150',
    desc: 'Manage diagnostic requests, result entries & pathologist reports'
  }
];

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeDemoRole, setActiveDemoRole] = useState(null);

  // Redirect target
  const from = location.state?.from?.pathname || '/';

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
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
        else if (res.user.role === 'diagnostic_admin') navigate('/diagnostics-admin/dashboard');
      } else {
        navigate(from, { replace: true });
      }
    } else {
      toast.error(res.message);
    }
  };

  const handleDemoLogin = async (role, demoEmail) => {
    setActiveDemoRole(role);
    
    // Simulate natural typing delay for user feedback
    setEmail('');
    setPassword('');
    
    const charsEmail = demoEmail.split('');
    const charsPass = 'password123'.split('');
    
    let currentEmail = '';
    for (let i = 0; i < charsEmail.length; i++) {
      await new Promise(r => setTimeout(r, 12));
      currentEmail += charsEmail[i];
      setEmail(currentEmail);
    }
    
    let currentPass = '';
    for (let i = 0; i < charsPass.length; i++) {
      await new Promise(r => setTimeout(r, 15));
      currentPass += charsPass[i];
      setPassword(currentPass);
    }
    
    // Slight pause before login submit
    await new Promise(r => setTimeout(r, 150));
    
    setSubmitting(true);
    const res = await login(demoEmail, 'password123');
    setSubmitting(false);
    setActiveDemoRole(null);

    if (res.success && res.user) {
      toast.success(`Logged in as ${res.user.name} (Demo Mode)`);
      if (res.user.role === 'patient') navigate('/patient/dashboard');
      else if (res.user.role === 'doctor') navigate('/doctor/dashboard');
      else if (res.user.role === 'hospital') navigate('/hospital/dashboard');
      else if (res.user.role === 'admin') navigate('/admin/dashboard');
      else if (res.user.role === 'diagnostic_admin') navigate('/diagnostics-admin/dashboard');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-10 transition-colors duration-250">
      <SEO 
        title="Account Login" 
        description="Access your patient records, doctor consulting dashboards, hospital admin panels, or pharmacy orders portal." 
      />
      
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl border border-slate-100 dark:bg-slate-800 dark:border-slate-800 grid md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700/50">
        
        {/* Left Side: Login Form */}
        <div className="md:col-span-6 p-8 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Brand Header */}
            <div className="text-center md:text-left">
              <Link to="/" className="inline-flex items-center space-x-2 text-primary-700 dark:text-primary-400">
                <FiActivity className="h-8 w-8 stroke-[2.5]" />
                <span className="font-sans text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
                  Purnia<span className="text-primary-600 dark:text-primary-400 font-extrabold">Care</span>
                </span>
              </Link>
              <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                Log in to your account
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Access consultations, orders, and patient records.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute top-3.5 left-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-xs font-medium focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Account Password</label>
                <div className="relative">
                  <FiLock className="absolute top-3.5 left-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-xs font-medium focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-primary-600 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-primary-700 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Authenticating credentials...' : 'Sign In'}
              </button>
            </form>
          </div>

          <div className="text-center text-xs text-slate-500 border-t border-slate-100 dark:border-slate-700/50 pt-6">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-primary-600 hover:underline dark:text-primary-400">
              Create Profile
            </Link>
          </div>
        </div>

        {/* Right Side: Demo Quick Login Panel */}
        <div className="md:col-span-6 p-8 sm:p-10 bg-slate-50/40 dark:bg-slate-900/10 flex flex-col justify-center space-y-6">
          <div>
            <span className="inline-block rounded-full bg-primary-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-700 dark:bg-primary-950/40 dark:text-primary-400 mb-2">
              Preview Mode
            </span>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Demo Accounts Quick Login
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select a role below to auto-fill the login form and sign in instantly.
            </p>
          </div>

          <div className="grid gap-3">
            {demoUsers.map((demo) => {
              const Icon = demo.icon;
              const isActive = activeDemoRole === demo.role;

              return (
                <motion.button
                  key={demo.role}
                  onClick={() => !submitting && handleDemoLogin(demo.role, demo.email)}
                  disabled={submitting}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`w-full text-left flex items-center p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/20 shadow-md shadow-primary-500/5' 
                      : 'border-slate-100 bg-white hover:bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  <div className="relative shrink-0">
                    <img 
                      src={demo.avatar} 
                      alt={demo.name} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-white dark:border-slate-800 shadow-sm">
                      <Icon className="w-2.5 h-2.5" />
                    </span>
                  </div>

                  <div className="ml-3.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {demo.name}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border tracking-wide ${demo.badgeColor}`}>
                        {demo.role}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate leading-relaxed">
                      {demo.desc}
                    </p>
                  </div>

                  <div className="ml-2 text-slate-350 dark:text-slate-650 group-hover:text-primary-500 transition-colors">
                    <FiArrowRight className="w-4 h-4" />
                  </div>
                </motion.button>
              );
            })}
          </div>
          
          <div className="text-[10px] text-center text-slate-400 bg-slate-50 dark:bg-slate-900/30 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800/60">
            <strong>Mock Password:</strong> <code className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200 dark:border-slate-750 font-mono">password123</code>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;

