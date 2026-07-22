import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiMenu, FiBell, FiSun, FiMoon, FiUser, FiLogOut, FiHome } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Convert pathname to breadcrumb format
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return paths.map((path, idx) => {
      const routeTo = `/${paths.slice(0, idx + 1).join('/')}`;
      const isLast = idx === paths.length - 1;
      const label = path.charAt(0).toUpperCase() + path.slice(1);
      return { label, routeTo, isLast };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  const mockAlerts = [
    { id: 1, text: "Appointment confirmed with Dr. Rajesh Kumar for Jul 22.", time: "2 hours ago" },
    { id: 2, text: "Your CBC test reports are ready. View in Patient Portal.", time: "1 day ago" },
    { id: 3, text: "Order #8802 has been shipped and is in transit.", time: "2 days ago" }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar isMobileOpen={isMobileSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:px-6 z-10">
          
          {/* Mobile Menu & Breadcrumbs */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSidebar}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            
            {/* Breadcrumb Navigation */}
            <nav className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Link to="/" className="flex items-center hover:text-primary-600">
                <FiHome className="h-3.5 w-3.5" />
              </Link>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.routeTo}>
                  <span className="text-slate-350 dark:text-slate-600">/</span>
                  {crumb.isLast ? (
                    <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link to={crumb.routeTo} className="hover:text-primary-600 capitalize">
                      {crumb.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Quick Info Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Dark Mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>

            {/* Notification drop */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <FiBell className="h-5 w-5" />
                <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    {/* Overlay click catcher */}
                    <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-850 dark:bg-slate-950 z-20"
                    >
                      <h4 className="border-b border-slate-100 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-slate-900">
                        System Notifications
                      </h4>
                      <div className="mt-1 divide-y divide-slate-50 dark:divide-slate-900/60 max-h-64 overflow-y-auto">
                        {mockAlerts.map(alert => (
                          <div key={alert.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-900">
                            <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-semibold">
                              {alert.text}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {alert.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Logged in profile */}
            {user && (
              <div className="flex items-center space-x-2 border-l border-slate-200 pl-4 dark:border-slate-800">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8.5 w-8.5 rounded-full object-cover ring-2 ring-primary-550"
                />
                <span className="hidden lg:block text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-150 hover:text-red-500 dark:hover:bg-slate-800"
                  title="Logout"
                >
                  <FiLogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Dynamic View Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50 dark:bg-slate-900/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
