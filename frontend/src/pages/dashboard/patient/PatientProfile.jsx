import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { FiUser, FiPhone, FiMail, FiMapPin, FiCalendar, FiActivity } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const PatientProfile = () => {
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || 'O+ve');
  const [dob, setDob] = useState(user?.dob || '');
  const [address, setAddress] = useState(user?.address || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [updating, setUpdating] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    const payload = { name, phone, bloodGroup, dob, address, avatar };
    const res = await updateProfile(payload);
    setUpdating(false);

    if (res.success) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-905 dark:text-white">Profile Settings</h1>
        <p className="text-xs text-slate-500">Manage your clinical metrics, contact phone records, and location address details.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left Column: Mini Card preview */}
        <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <img 
              src={avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
              alt={name} 
              className="h-28 w-28 rounded-full object-cover ring-4 ring-primary-500 shadow-md"
            />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{name || 'User Profile'}</h3>
            <span className="inline-block rounded-full bg-primary-100 px-2 py-0.5 text-[9px] font-bold text-primary-800 capitalize dark:bg-primary-950/60 dark:text-primary-400">
              {user?.role}
            </span>
          </div>
          <div className="w-full border-t border-slate-50 pt-4 dark:border-slate-700/60 text-left text-[11px] text-slate-500 space-y-2 font-semibold">
            <p className="flex items-center"><FiMail className="mr-2 text-primary-500" /> {user?.email}</p>
            <p className="flex items-center"><FiPhone className="mr-2 text-primary-500" /> {phone || 'Not provided'}</p>
            <p className="flex items-center"><FiActivity className="mr-2 text-primary-500" /> Blood Group: {bloodGroup}</p>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">Edit Demographic Details</h3>
            
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute top-3 left-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute top-3 left-3 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Date of Birth</label>
                  <div className="relative">
                    <FiCalendar className="absolute top-3 left-3 text-slate-400" />
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="A+ve">A+ve</option>
                    <option value="A-ve">A-ve</option>
                    <option value="B+ve">B+ve</option>
                    <option value="B-ve">B-ve</option>
                    <option value="AB+ve">AB+ve</option>
                    <option value="AB-ve">AB-ve</option>
                    <option value="O+ve">O+ve</option>
                    <option value="O-ve">O-ve</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Home Address</label>
                <div className="relative">
                  <FiMapPin className="absolute top-3 left-3 text-slate-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full rounded-xl bg-primary-600 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-primary-750 transition-colors cursor-pointer"
              >
                {updating ? 'Updating portal logs...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
export default PatientProfile;
