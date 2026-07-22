import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../../services/apiService';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { 
  FiUsers, FiPackage, FiHome, FiCheckSquare, FiDollarSign, 
  FiSettings, FiSearch, FiCheck, FiX, FiRefreshCw, FiAlertTriangle 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, ArcElement, Title, Tooltip, Legend
);

export const AdminDashboard = () => {
  const location = useLocation();
  const path = location.pathname;

  // Global counts
  const [usersCount, setUsersCount] = useState(1280);
  const [ordersCount, setOrdersCount] = useState(342);
  const [revenue, setRevenue] = useState(482000);
  
  // Lists
  const [doctorsList, setDoctorsList] = useState([]);
  const [hospitalsList, setHospitalsList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search filter inside User Directory
  const [searchUser, setSearchUser] = useState('');
  
  // Settings page parameters
  const [deliveryCharge, setDeliveryCharge] = useState(30);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Approval requests lists
  const [doctorRequests, setDoctorRequests] = useState([
    { id: 'req-doc-1', name: "Dr. Prem Sagar", specialty: "Urology", hospital: "Sadar Hospital", status: "Pending Verification" },
    { id: 'req-doc-2', name: "Dr. Niharika Sen", specialty: "Dentistry", hospital: "Max Care Clinic", status: "Pending Verification" }
  ]);

  const [hospitalRequests, setHospitalRequests] = useState([
    { id: 'req-hosp-1', name: "Seemanchal Cardiac Center", address: "Line Bazar Road, Purnia", status: "Pending Approval" }
  ]);

  const fetchAdminData = async () => {
    try {
      const docRes = await api.get('/doctors');
      const hospRes = await api.get('/hospitals');
      const ordRes = await api.get('/orders');
      
      setDoctorsList(docRes.data);
      setHospitalsList(hospRes.data);
      setOrders(ordRes.data);
    } catch (err) {
      toast.error("Failed to load platform data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApproveDoctor = (id, name) => {
    setDoctorRequests(prev => prev.filter(r => r.id !== id));
    toast.success(`Doctor credentials verified for ${name}.`);
    setDoctorsList(prev => [...prev, { id, name, specialization: 'General', qualification: 'MD', experience: 5, fees: 500, rating: 5, photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150', hospitalName: 'Verified' }]);
    setUsersCount(prev => prev + 1);
  };

  const handleApproveHospital = (id, name) => {
    setHospitalRequests(prev => prev.filter(r => r.id !== id));
    toast.success(`Hospital listing approved for ${name}.`);
    setHospitalsList(prev => [...prev, { id, name, address: 'Approved', rating: 5, image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=150', departments: [] }]);
    setUsersCount(prev => prev + 1);
  };

  const handleToggleOrderStatus = (id) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: o.status === 'Delivered' ? 'In Transit' : 'Delivered' } : o));
    toast.success(`Order status updated for #${id}`);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-650 border-t-transparent"></div>
      </div>
    );
  }

  // Chart configs
  const analyticsData = {
    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Platform User Growth',
        data: [400, 600, 850, 980, 1100, 1280],
        borderColor: '#0EA5E9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.3,
        fill: false
      },
      {
        label: 'Monthly Revenue (₹100)',
        data: [1500, 1800, 2400, 3100, 3900, 4820],
        borderColor: '#0F766E',
        backgroundColor: 'rgba(15, 118, 110, 0.1)',
        tension: 0.3,
        fill: false
      }
    ]
  };

  // RENDER SECTIONS BASED ON PATH
  
  // View 1: Default Dashboard Overview
  if (path === '/admin/dashboard' || path === '/admin') {
    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 flex items-center space-x-4">
            <div className="rounded-xl bg-primary-50 p-3 text-primary-605 dark:bg-primary-950/40">
              <FiUsers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Active Accounts</p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{usersCount}</h3>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 flex items-center space-x-4">
            <div className="rounded-xl bg-accent-50 p-3 text-accent-600 dark:bg-accent-950/40">
              <FiCheckSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Doctors Verified</p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{doctorsList.length}</h3>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 flex items-center space-x-4">
            <div className="rounded-xl bg-teal-50 p-3 text-teal-650 dark:bg-teal-950/40">
              <FiHome className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Hospitals Approved</p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{hospitalsList.length}</h3>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 flex items-center space-x-4">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-650 dark:bg-emerald-950/40">
              <FiDollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Consolidated Payments</p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">₹{revenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b pb-3 dark:border-slate-700/60 mb-4">
            System Activity & Payments Growth
          </h3>
          <div className="h-64">
            <Line data={analyticsData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Dynamic Verification Requests */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b pb-3 dark:border-slate-700/60">
              Doctor Verification Claims ({doctorRequests.length})
            </h3>
            <div className="space-y-3">
              {doctorRequests.map(req => (
                <div key={req.id} className="flex justify-between items-center border border-slate-50 p-3 rounded-xl dark:border-slate-750/60 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{req.name}</h4>
                    <p className="text-[10px] text-slate-450">{req.specialty} | {req.hospital}</p>
                  </div>
                  <button
                    onClick={() => handleApproveDoctor(req.id, req.name)}
                    className="rounded bg-primary-600 px-3 py-1 text-[10px] font-bold text-white hover:bg-primary-750"
                  >
                    Verify
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b pb-3 dark:border-slate-700/60">
              Hospital Listing requests ({hospitalRequests.length})
            </h3>
            <div className="space-y-3">
              {hospitalRequests.map(req => (
                <div key={req.id} className="flex justify-between items-center border border-slate-50 p-3 rounded-xl dark:border-slate-750/60 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{req.name}</h4>
                    <p className="text-[10px] text-slate-450">{req.address}</p>
                  </div>
                  <button
                    onClick={() => handleApproveHospital(req.id, req.name)}
                    className="rounded bg-primary-600 px-3 py-1 text-[10px] font-bold text-white hover:bg-primary-750"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // View 2: User Directory
  if (path === '/admin/users') {
    // Generate some mock users
    const mockUserDirectory = [
      { name: "Aman Verma", email: "patient@purniacare.com", role: "Patient", phone: "+91 98765 43210", city: "Purnia" },
      { name: "Dr. Rajesh Kumar", email: "doctor@purniacare.com", role: "Doctor", phone: "+91 94321 00987", city: "Purnia" },
      { name: "Purnia Care Central Hospital", email: "hospital@purniacare.com", role: "Hospital", phone: "+91 6454 224488", city: "Purnia" },
      { name: "Dr. Anjali Sharma", email: "anjali@example.com", role: "Doctor", phone: "+91 99887 76655", city: "Katihar" },
      { name: "Sita Devi", email: "sita@example.com", role: "Patient", phone: "+91 88776 22114", city: "Araria" }
    ];

    const filteredUsers = mockUserDirectory.filter(u => 
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.role.toLowerCase().includes(searchUser.toLowerCase())
    );

    return (
      <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-3 dark:border-slate-700/60">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Registered User Directory</h3>
          
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute top-2.5 left-3 text-slate-400 text-xs" />
            <input 
              type="text"
              placeholder="Search by name, email or role..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="w-full rounded-lg border border-slate-205 bg-slate-50 py-1.5 pl-9 pr-3 text-xs focus:outline-none dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold text-slate-650">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-750 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3">Name</th>
                <th className="py-3">Email Address</th>
                <th className="py-3">Role</th>
                <th className="py-3">Phone</th>
                <th className="py-3 text-right">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-750">
              {filteredUsers.map((u, idx) => (
                <tr key={idx}>
                  <td className="py-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                  <td className="py-4">{u.email}</td>
                  <td className="py-4">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      u.role === 'Doctor' ? 'bg-primary-50 text-primary-750' :
                      u.role === 'Hospital' ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-700 dark:bg-slate-950'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4">{u.phone}</td>
                  <td className="py-4 text-right">{u.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // View 3: Verify Doctors
  if (path === '/admin/doctors') {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b pb-3 dark:border-slate-700/60">
            Pending Doctor Approvals
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {doctorRequests.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">No doctor licenses require verification.</p>
            ) : (
              doctorRequests.map(req => (
                <div key={req.id} className="flex justify-between items-center border border-slate-100 p-4 rounded-xl dark:border-slate-700/60 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{req.name}</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">Specialization: {req.specialty} | Facility: {req.hospital}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleApproveDoctor(req.id, req.name)}
                      className="rounded-lg bg-primary-600 px-4 py-2 font-bold text-white shadow hover:bg-primary-750"
                    >
                      Verify License
                    </button>
                    <button 
                      onClick={() => {
                        setDoctorRequests(prev => prev.filter(r => r.id !== req.id));
                        toast.error(`Doctor credentials rejected for ${req.name}`);
                      }}
                      className="rounded-lg border border-red-200 bg-white px-4 py-2 font-bold text-red-600 hover:bg-red-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-105 dark:bg-slate-800 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b pb-3 dark:border-slate-700/60">
            Platform Verified Doctors Directory
          </h3>
          <div className="space-y-3">
            {doctorsList.map(doc => (
              <div key={doc.id} className="flex justify-between items-center border border-slate-50 p-3 rounded-xl dark:border-slate-750/60 text-xs">
                <div className="flex items-center space-x-3">
                  <img src={doc.photo} alt={doc.name} className="h-9 w-9 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{doc.name}</h4>
                    <p className="text-[10px] text-slate-400">{doc.specialization} | {doc.hospitalName}</p>
                  </div>
                </div>
                <span className="rounded bg-teal-50 px-2 py-0.5 text-[9px] font-bold text-teal-800 dark:bg-teal-950/60 dark:text-teal-400">
                  Verified Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // View 4: Verify Hospitals
  if (path === '/admin/hospitals') {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-905 dark:text-white border-b pb-3 dark:border-slate-700/60">
            Pending Hospital approvals
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {hospitalRequests.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">No pending clinic listings.</p>
            ) : (
              hospitalRequests.map(req => (
                <div key={req.id} className="flex justify-between items-center border border-slate-100 p-4 rounded-xl dark:border-slate-700/60 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{req.name}</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">{req.address}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleApproveHospital(req.id, req.name)}
                      className="rounded-lg bg-primary-600 px-4 py-2 font-bold text-white shadow hover:bg-primary-750"
                    >
                      Approve Listing
                    </button>
                    <button 
                      onClick={() => {
                        setHospitalRequests(prev => prev.filter(r => r.id !== req.id));
                        toast.error(`Hospital request rejected.`);
                      }}
                      className="rounded-lg border border-red-200 bg-white px-4 py-2 font-bold text-red-650 hover:bg-red-50"
                    >
                      Flag
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-105 dark:bg-slate-800 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b pb-3 dark:border-slate-700/60">
            Approved Facilities
          </h3>
          <div className="space-y-3">
            {hospitalsList.map(h => (
              <div key={h.id} className="flex justify-between items-center border border-slate-50 p-3 rounded-xl dark:border-slate-750/60 text-xs">
                <div className="flex items-center space-x-3">
                  <img src={h.image} alt={h.name} className="h-9 w-9 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{h.name}</h4>
                    <p className="text-[10px] text-slate-400">{h.address}</p>
                  </div>
                </div>
                <span className="rounded bg-teal-50 px-2 py-0.5 text-[9px] font-bold text-teal-800 dark:bg-teal-950/60 dark:text-teal-400 font-bold">
                  Approved
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // View 5: System Orders Log
  if (path === '/admin/orders') {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-6">
        <div className="border-b pb-3 dark:border-slate-700/60">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Comprehensive System Orders</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Edit shipping tracking or download transaction logs for tax audit.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold text-slate-650">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-750 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3">Order Ref</th>
                <th className="py-3">User Email</th>
                <th className="py-3">Date</th>
                <th className="py-3">Items Purchased</th>
                <th className="py-3">Total Amount</th>
                <th className="py-3">Tracking</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-750">
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="py-4 font-bold text-slate-900 dark:text-white">#{order.id}</td>
                  <td className="py-4">{order.userEmail}</td>
                  <td className="py-4">{order.date}</td>
                  <td className="py-4 max-w-[150px] truncate">{order.items.map(i => i.name).join(', ')}</td>
                  <td className="py-4 font-extrabold text-slate-900 dark:text-white">₹{order.total}</td>
                  <td className="py-4">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      order.status === 'Delivered' 
                        ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400' 
                        : 'bg-accent-50 text-accent-650 dark:bg-accent-950/30'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleToggleOrderStatus(order.id)}
                      className="rounded bg-slate-50 border border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300"
                    >
                      Shift Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // View 6: Global Settings
  if (path === '/admin/settings') {
    return (
      <div className="max-w-2xl rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-6">
        <div className="border-b pb-3 dark:border-slate-700/60">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Global Configuration Panel</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Toggle maintenance controls, override delivery variables, and clean databases.</p>
        </div>

        <div className="space-y-6 text-xs font-semibold text-slate-650">
          
          {/* Maintenance switch */}
          <div className="flex justify-between items-center border-b border-slate-50 pb-4 dark:border-slate-750">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Platform Maintenance Mode</p>
              <p className="text-[10px] text-slate-400 leading-normal max-w-sm mt-0.5">
                Puts all pages into maintenance except dashboards. Redirects normal landing pages.
              </p>
            </div>
            <button
              onClick={() => {
                setMaintenanceMode(!maintenanceMode);
                toast.success(`Maintenance Mode toggled to ${!maintenanceMode ? 'ACTIVE' : 'INACTIVE'}`);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                maintenanceMode ? 'bg-red-500' : 'bg-slate-205 dark:bg-slate-700'
              }`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                maintenanceMode ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Delivery parameter input */}
          <div className="space-y-2 border-b border-slate-50 pb-4 dark:border-slate-750">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Standard Delivery Fee (₹)</p>
            <div className="flex gap-2">
              <input
                type="number"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(parseInt(e.target.value))}
                className="w-24 rounded-lg border border-slate-205 bg-slate-50 p-2 text-xs focus:outline-none dark:border-slate-700 dark:bg-slate-950"
              />
              <button 
                onClick={() => toast.success(`Delivery fee saved: ₹${deliveryCharge}`)}
                className="rounded-lg bg-primary-600 px-4 py-2 font-bold text-white shadow hover:bg-primary-750 cursor-pointer"
              >
                Apply Fee
              </button>
            </div>
          </div>

          {/* Clean database */}
          <div className="space-y-2">
            <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
              <FiAlertTriangle className="mr-1.5 text-amber-500" /> Database Resets
            </p>
            <p className="text-[10px] text-slate-400">Resets appointment schedules, user profile records, and carts back to baseline mock states.</p>
            <button
              onClick={() => {
                localStorage.clear();
                toast.success("Database restored. Session state reset.");
                setTimeout(() => window.location.reload(), 1000);
              }}
              className="rounded-lg bg-red-600 px-4 py-2.5 font-bold text-white shadow hover:bg-red-750 cursor-pointer"
            >
              Reset Mock Cache Database
            </button>
          </div>

        </div>
      </div>
    );
  }

  return null;
};
export default AdminDashboard;
