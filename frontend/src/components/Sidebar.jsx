import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiGrid, FiCalendar, FiFileText, FiPackage, FiUser, 
  FiSettings, FiUsers, FiClock, FiLayers, FiCheckSquare, 
  FiHome, FiLogOut, FiActivity, FiArrowLeft 
} from 'react-icons/fi';

export const Sidebar = ({ isMobileOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    if (toggleSidebar) toggleSidebar();
  };

  const getLinks = (role) => {
    switch (role) {
      case 'patient':
        return [
          { path: '/patient/dashboard', label: 'Dashboard', icon: FiGrid },
          { path: '/patient/appointments', label: 'Appointments', icon: FiCalendar },
          { path: '/patient/prescriptions', label: 'Prescriptions', icon: FiFileText },
          { path: '/patient/orders', label: 'Medicine Orders', icon: FiPackage },
          { path: '/patient/profile', label: 'My Profile', icon: FiUser },
        ];
      case 'doctor':
        return [
          { path: '/doctor/dashboard', label: 'Dashboard', icon: FiGrid },
          { path: '/doctor/appointments', label: 'Appointments', icon: FiCalendar },
          { path: '/doctor/patients', label: 'My Patients', icon: FiUsers },
          { path: '/doctor/schedule', label: 'Availability/Schedule', icon: FiClock },
          { path: '/doctor/profile', label: 'Profile Settings', icon: FiUser },
        ];
      case 'hospital':
        return [
          { path: '/hospital/dashboard', label: 'Overview', icon: FiGrid },
          { path: '/hospital/doctors', label: 'Doctors (Staff)', icon: FiUsers },
          { path: '/hospital/departments', label: 'Departments', icon: FiLayers },
          { path: '/hospital/appointments', label: 'Bookings', icon: FiCalendar },
        ];
      case 'admin':
        return [
          { path: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
          { path: '/admin/users', label: 'User Directory', icon: FiUsers },
          { path: '/admin/doctors', label: 'Verify Doctors', icon: FiCheckSquare },
          { path: '/admin/hospitals', label: 'Verify Hospitals', icon: FiHome },
          { path: '/admin/orders', label: 'System Orders', icon: FiPackage },
          { path: '/admin/settings', label: 'Global Settings', icon: FiSettings },
        ];
      default:
        return [];
    }
  };

  const links = getLinks(user?.role);

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="px-4 py-6">
        {/* Brand/Role title */}
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center space-x-2 text-primary-700 dark:text-primary-400">
            <FiActivity className="h-6 w-6 stroke-[2.5]" />
            <span className="font-sans text-lg font-bold text-slate-850 dark:text-white">
              Purnia<span className="text-primary-600 dark:text-primary-400 font-extrabold">Care</span>
            </span>
          </NavLink>
        </div>

        {/* User Mini Card */}
        {user && (
          <div className="mt-6 flex items-center space-x-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-500"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
              <span className="inline-block rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold capitalize text-primary-800 dark:bg-primary-950/60 dark:text-primary-400">
                {user.role}
              </span>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="mt-8 space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={toggleSidebar}
                className={({ isActive }) =>
                  `flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20 dark:bg-primary-700'
                      : 'text-slate-650 hover:bg-slate-55 dark:text-slate-350 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`
                }
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout / Exit */}
      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <button
          onClick={() => navigate('/')}
          className="flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-605 hover:bg-slate-55 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <FiArrowLeft className="h-4.5 w-4.5" />
          <span>Exit Dashboard</span>
        </button>
        <button
          onClick={handleLogout}
          className="mt-1 flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <FiLogOut className="h-4.5 w-4.5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (visible md+) */}
      <aside className="hidden w-64 md:block shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (visible md-) */}
      {isMobileOpen && (
        <div className="relative z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={toggleSidebar} 
          />
          {/* Content */}
          <div className="fixed inset-y-0 left-0 flex w-64 max-w-xs animate-in slide-in-from-left duration-250">
            <div className="w-full">{sidebarContent}</div>
          </div>
        </div>
      )}
    </>
  );
};
export default Sidebar;
