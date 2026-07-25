import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../../services/apiService';
import { useAuth } from '../../../context/AuthContext';
import { 
  FiGrid, FiHome, FiActivity, FiPackage, FiLayers, FiFileText, 
  FiClock, FiDollarSign, FiUsers, FiSettings, FiPlus, FiEdit2, 
  FiTrash2, FiSearch, FiCheck, FiX, FiInfo, FiTrendingUp, 
  FiAlertTriangle, FiAlertCircle, FiEye, FiDownload, FiUser, 
  FiCheckCircle, FiShield, FiPercent, FiTruck, FiMapPin, FiBriefcase, FiRefreshCw
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { SEO } from '../../../components/SEO';
import { generateInvoicePDF } from '../../../utils/generateInvoicePDF';
import { generateReportPDF } from '../../../utils/generateReportPDF';

export const PharmacyAdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Active Tab/Subview based on URL path
  const activeTab = path.split('/').pop() || 'dashboard';

  // State Management
  const [medicines, setMedicines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Modals & Selected items
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [showEditMedModal, setShowEditMedModal] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [zoomPrescription, setZoomPrescription] = useState(false);

  // Forms state
  const [medForm, setMedForm] = useState({
    name: '', brand: '', category: '', generic_name: '', manufacturer: '',
    batch_number: '', expiry_date: '', purchase_price: '', mrp: '', price: '',
    discount: '', stock: '', dosage_instructions: '', description: '', image: '',
    prescription_required: false
  });

  const [profileForm, setProfileForm] = useState({
    name: '', owner_name: '', drug_license_number: '', gst_number: '',
    address: '', store_timings: '', home_delivery_available: true,
    delivery_charges: 30, bank_name: '', bank_account_number: '', bank_ifsc: ''
  });

  const [pharmacistNotes, setPharmacistNotes] = useState('');

  // Fetch baseline data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get pharmacy profile
      const pharmRes = await api.get('/pharmacies');
      if (pharmRes.data && pharmRes.data.length > 0) {
        setPharmacy(pharmRes.data[0]);
        setProfileForm(pharmRes.data[0]);
      } else {
        // Mock fallback profile
        const mockProfile = {
          id: 'phm-1', name: 'Purnia Care Central Pharmacy', owner_name: 'Sanjay Gupta',
          drug_license_number: 'DL-98765-PUR', gst_number: '20AAECP9876F1Z5',
          address: 'Line Bazar Chowk, Purnia, Bihar - 854301', city: 'Purnia',
          phone: '+91 99999 55555', email: 'pharmacy@purniacare.com',
          store_timings: '8:00 AM - 10:00 PM', home_delivery_available: true,
          logo: 'https://images.unsplash.com/photo-1607619056574-7b8f304b3b8f?auto=format&fit=crop&q=80&w=150',
          kyc_status: 'Approved', delivery_charges: 30.00,
          bank_name: 'State Bank of India', bank_account_number: '30994883901', bank_ifsc: 'SBIN0000214'
        };
        setPharmacy(mockProfile);
        setProfileForm(mockProfile);
      }

      // Get medicines
      const medRes = await api.get('/medicines');
      setMedicines(medRes.data);

      // Get orders
      const orderRes = await api.get('/orders');
      setOrders(orderRes.data);

    } catch (err) {
      console.error("Failed to load local database, applying mock data", err);
      // Fallback mocks
      setPharmacy({
        name: 'Purnia Care Central Pharmacy', owner_name: 'Sanjay Gupta',
        drug_license_number: 'DL-98765-PUR', gst_number: '20AAECP9876F1Z5',
        address: 'Line Bazar Chowk, Purnia, Bihar - 854301', city: 'Purnia',
        phone: '+91 99999 55555', email: 'pharmacy@purniacare.com',
        store_timings: '8:00 AM - 10:00 PM', home_delivery_available: true,
        logo: 'https://images.unsplash.com/photo-1607619056574-7b8f304b3b8f?auto=format&fit=crop&q=80&w=150',
        kyc_status: 'Approved', delivery_charges: 30,
        bank_name: 'State Bank of India', bank_account_number: '30994883901', bank_ifsc: 'SBIN0000214'
      });
      setMedicines([
        { id: 1, name: 'Paracetamol 650mg (Dolo)', category_name: 'Pain Reliever & Fever', brand: 'Micro Labs', generic_name: 'Paracetamol', manufacturer: 'Micro Labs Ltd', batch_number: 'DOL-1029', expiry_date: '2027-10-15', purchase_price: 22.00, mrp: 40.00, price: 32.00, discount: 15, stock: 500, dosage_instructions: 'One tablet when required.', prescription_required: false, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300' },
        { id: 2, name: 'Pantoprazole 40mg (Pan-D)', category_name: 'Acidity & Gas', brand: 'Alkem', generic_name: 'Pantoprazole', manufacturer: 'Alkem Laboratories', batch_number: 'PND-9923', expiry_date: '2026-08-30', purchase_price: 110.00, mrp: 168.00, price: 148.00, discount: 12, stock: 15, dosage_instructions: 'One tablet morning before breakfast.', prescription_required: true, image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=300' }
      ]);
      setOrders([
        { id: 'ord-8801', user_name: 'aman_verma', date: '2026-07-24', subtotal: 180.00, tax: 9.00, delivery_charge: 30.00, total: 219.00, status: 'Pending', payment_method: 'Cash on Delivery', address: 'Bhatia Chowk, Ward 12, Purnia, Bihar', prescription_image: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', items: [{ medicine_details: { name: 'Paracetamol 650mg (Dolo)' }, quantity: 2, price: 32.00, discount: 15 }] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      if (pharmacy?.id) {
        await api.patch(`/pharmacies/${pharmacy.id}`, profileForm);
        setPharmacy(profileForm);
        toast.success("Shop Profile updated successfully!");
      } else {
        toast.error("Profile not initialized.");
      }
    } catch (err) {
      toast.success("Shop Profile mock updated!");
      setPharmacy(profileForm);
    }
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...medForm,
        category: 1, // assume default category
        price: parseFloat(medForm.price),
        stock: parseInt(medForm.stock),
        discount: parseInt(medForm.discount || 0),
        mrp: parseFloat(medForm.mrp || medForm.price),
        purchase_price: parseFloat(medForm.purchase_price || 0)
      };
      
      const res = await api.post('/medicines', payload);
      setMedicines(prev => [res.data, ...prev]);
      setShowAddMedModal(false);
      toast.success(`Medicine ${medForm.name} added successfully!`);
    } catch (err) {
      // Mock insert
      const newMed = {
        id: Math.floor(100 + Math.random() * 900),
        ...medForm,
        category_name: medForm.category || 'General',
        price: parseFloat(medForm.price),
        stock: parseInt(medForm.stock),
        discount: parseInt(medForm.discount || 0)
      };
      setMedicines(prev => [newMed, ...prev]);
      setShowAddMedModal(false);
      toast.success(`Medicine ${medForm.name} mock added!`);
    }
    // reset form
    setMedForm({
      name: '', brand: '', category: '', generic_name: '', manufacturer: '',
      batch_number: '', expiry_date: '', purchase_price: '', mrp: '', price: '',
      discount: '', stock: '', dosage_instructions: '', description: '', image: '',
      prescription_required: false
    });
  };

  const handleEditMedicine = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch(`/medicines/${selectedMed.id}`, medForm);
      setMedicines(prev => prev.map(m => m.id === selectedMed.id ? res.data : m));
      setShowEditMedModal(false);
      toast.success("Medicine updated successfully!");
    } catch (err) {
      // Mock update
      setMedicines(prev => prev.map(m => m.id === selectedMed.id ? { ...m, ...medForm } : m));
      setShowEditMedModal(false);
      toast.success("Medicine mock updated!");
    }
  };

  const handleDeleteMedicine = async (id) => {
    if (!confirm("Are you sure you want to delete this medicine?")) return;
    try {
      await api.delete(`/medicines/${id}`);
      setMedicines(prev => prev.filter(m => m.id !== id));
      toast.success("Medicine deleted successfully!");
    } catch (err) {
      setMedicines(prev => prev.filter(m => m.id !== id));
      toast.success("Medicine mock deleted!");
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}`, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order #${orderId} marked as ${newStatus}`);
    } catch (err) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order mock marked as ${newStatus}`);
    }
  };

  const handlePrescriptionApproval = (approve) => {
    if (!selectedOrder) return;
    const msg = approve ? 'Approved' : 'Rejected';
    toast.success(`Prescription for Order #${selectedOrder.id} is ${msg}`);
    if (approve) {
      handleUpdateOrderStatus(selectedOrder.id, 'In Transit');
    } else {
      handleUpdateOrderStatus(selectedOrder.id, 'Cancelled');
    }
    setShowPrescriptionModal(false);
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <FiRefreshCw className="h-10 w-10 animate-spin text-primary-600" />
          <p className="text-sm font-bold text-slate-500">Loading Pharmacy Panel data...</p>
        </div>
      </div>
    );
  }

  // Dashboard Stats calculations
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const completedOrders = orders.filter(o => o.status === 'Delivered').length;
  const totalRevenue = orders.filter(o => o.status === 'Delivered').reduce((acc, curr) => acc + parseFloat(curr.total || 0), 0);
  const lowStockCount = medicines.filter(m => m.stock < 20).length;

  return (
    <div className="space-y-6">
      <SEO 
        title="Pharmacy Dashboard | Purnia Care" 
        description="Purnia Care Medicine Shopkeeper panel. Manage inventories, verify prescriptions, and dispatch orders." 
      />

      {/* Profile Header */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-y-12 translate-x-12">
          <FiPackage className="w-80 h-80" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img 
              src={pharmacy?.logo || 'https://images.unsplash.com/photo-1607619056574-7b8f304b3b8f?auto=format&fit=crop&q=80&w=150'} 
              alt={pharmacy?.name} 
              className="w-16 h-16 rounded-2xl object-cover bg-white/20 p-1 border border-white/30"
            />
            <div>
              <span className="bg-emerald-800/60 border border-emerald-400/30 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
                Store Partner
              </span>
              <h1 className="text-xl font-bold mt-1">{pharmacy?.name || 'Local Pharmacy'}</h1>
              <p className="text-xs text-emerald-100 flex items-center mt-0.5">
                <FiMapPin className="mr-1 inline w-3.5 h-3.5" /> {pharmacy?.address || 'Purnia, Bihar'}
              </p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex gap-6">
            <div className="text-center">
              <span className="text-[10px] text-emerald-100 block uppercase font-bold">GST Number</span>
              <span className="text-xs font-mono font-semibold">{pharmacy?.gst_number || 'N/A'}</span>
            </div>
            <div className="text-center border-l border-white/25 pl-6">
              <span className="text-[10px] text-emerald-100 block uppercase font-bold">KYC Status</span>
              <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full inline-flex items-center mt-0.5">
                <FiCheckCircle className="mr-1 w-3.5 h-3.5 text-emerald-300" /> {pharmacy?.kyc_status || 'Approved'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Routing Rendering */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Today's Orders</span>
                <h3 className="text-2xl font-extrabold text-slate-850 dark:text-white mt-1">{orders.length}</h3>
              </div>
              <div className="bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-405 p-3.5 rounded-2xl">
                <FiLayers className="w-5 h-5" />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Pending Orders</span>
                <h3 className="text-2xl font-extrabold text-slate-850 dark:text-white mt-1">{pendingOrders}</h3>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 p-3.5 rounded-2xl">
                <FiClock className="w-5 h-5" />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Low Stock Items</span>
                <h3 className="text-2xl font-extrabold text-red-600 dark:text-red-400 mt-1">{lowStockCount}</h3>
              </div>
              <div className="bg-red-50 dark:bg-red-950/40 text-red-650 dark:text-red-450 p-3.5 rounded-2xl">
                <FiAlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Total Revenue</span>
                <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">₹{totalRevenue.toFixed(2)}</h3>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 p-3.5 rounded-2xl">
                <FiDollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-6">
            {/* Sales Trends Chart (HTML5 SVG graph mockup) */}
            <div className="md:col-span-8 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-850 dark:text-white">Monthly Sales Insights</h3>
                  <p className="text-xs text-slate-400">Track and forecast earnings trends</p>
                </div>
                <span className="text-xs font-bold text-primary-650 dark:text-primary-400 flex items-center bg-primary-50 dark:bg-primary-950/30 px-2.5 py-1 rounded-lg">
                  <FiTrendingUp className="mr-1" /> +14.2% Growth
                </span>
              </div>
              <div className="h-56 w-full flex items-end justify-between pt-4 px-2 select-none">
                {[60, 45, 80, 50, 95, 75, 110].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center group">
                    <div className="w-8 md:w-10 bg-primary-100 dark:bg-primary-950 rounded-lg relative hover:bg-primary-500 dark:hover:bg-primary-800 transition-all cursor-pointer" style={{ height: `${val * 1.5}px` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                        ₹{(val * 100)}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 mt-2">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Stock Alerts list */}
            <div className="md:col-span-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-4">Stock Alert Alerts</h3>
                <div className="space-y-3">
                  {medicines.filter(m => m.stock < 50).map(med => (
                    <div key={med.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850/40">
                      <div>
                        <span className="text-xs font-bold text-slate-850 dark:text-slate-200">{med.name}</span>
                        <p className="text-[10px] text-slate-405">Qty left: <strong className="text-red-500">{med.stock}</strong></p>
                      </div>
                      <button 
                        onClick={() => navigate('/pharmacy-admin/inventory')}
                        className="text-[10px] font-bold text-primary-650 bg-primary-50 px-2.5 py-1 rounded-lg hover:bg-primary-100 cursor-pointer"
                      >
                        Restock
                      </button>
                    </div>
                  ))}
                  {medicines.filter(m => m.stock < 50).length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-400">
                      <FiCheckCircle className="mx-auto w-8 h-8 text-emerald-500 mb-2" />
                      All inventory stocks are normal!
                    </div>
                  )}
                </div>
              </div>
              <button 
                onClick={() => navigate('/pharmacy-admin/medicines')}
                className="w-full mt-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-xs font-bold py-2.5 rounded-xl text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Go to medicines catalog
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm">
          <div className="border-b border-slate-100 dark:border-slate-850 pb-4 mb-6">
            <h2 className="text-base font-bold text-slate-850 dark:text-white">Store Profile Settings</h2>
            <p className="text-xs text-slate-500 mt-1">Manage public information, license numbers & banking logs</p>
          </div>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Pharmacy Name</label>
                <input 
                  type="text" 
                  className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Owner Name</label>
                <input 
                  type="text" 
                  className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                  value={profileForm.owner_name}
                  onChange={(e) => setProfileForm({ ...profileForm, owner_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Drug License Number</label>
                <input 
                  type="text" 
                  disabled
                  className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/60 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
                  value={profileForm.drug_license_number}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">GST Number</label>
                <input 
                  type="text" 
                  disabled
                  className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/60 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
                  value={profileForm.gst_number}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Full Store Address</label>
              <textarea 
                rows="3"
                className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Store Timings</label>
                <input 
                  type="text" 
                  className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                  value={profileForm.store_timings}
                  onChange={(e) => setProfileForm({ ...profileForm, store_timings: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Delivery Charge (₹)</label>
                <input 
                  type="number" 
                  className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                  value={profileForm.delivery_charges}
                  onChange={(e) => setProfileForm({ ...profileForm, delivery_charges: parseFloat(e.target.value) })}
                />
              </div>
              <div className="flex items-center pt-6">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={profileForm.home_delivery_available}
                    onChange={(e) => setProfileForm({ ...profileForm, home_delivery_available: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                  <span className="ml-3 text-xs font-bold text-slate-500">Home Delivery Available</span>
                </label>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-850 pt-6">
              <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-4">Bank Verification Details</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Bank Name</label>
                  <input 
                    type="text" 
                    className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                    value={profileForm.bank_name}
                    onChange={(e) => setProfileForm({ ...profileForm, bank_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Account Number</label>
                  <input 
                    type="text" 
                    className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                    value={profileForm.bank_account_number}
                    onChange={(e) => setProfileForm({ ...profileForm, bank_account_number: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Bank IFSC Code</label>
                  <input 
                    type="text" 
                    className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                    value={profileForm.bank_ifsc}
                    onChange={(e) => setProfileForm({ ...profileForm, bank_ifsc: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3.5 rounded-xl cursor-pointer shadow-lg active:scale-99 transition-all"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'medicines' && (
        <div className="space-y-6">
          {/* Header Action row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <FiSearch className="absolute left-3.5 top-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search catalog medicines..." 
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-emerald-500 dark:border-slate-750 dark:bg-slate-800 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowAddMedModal(true)}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <FiPlus /> Add New Medicine
            </button>
          </div>

          {/* Medicines List Table */}
          <div className="overflow-x-auto bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-850/40 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="px-6 py-4">Medicine Details</th>
                  <th className="px-6 py-4">Manufacturer & Brand</th>
                  <th className="px-6 py-4">Batch & Expiry</th>
                  <th className="px-6 py-4">Stock Status</th>
                  <th className="px-6 py-4">Price / Discount</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850/40 text-xs text-slate-650 dark:text-slate-350">
                {medicines.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())).map(med => (
                  <tr key={med.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={med.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300'} 
                          alt={med.name} 
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-900"
                        />
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-100">{med.name}</p>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block mt-0.5">{med.category_name}</span>
                          {med.prescription_required && (
                            <span className="inline-block mt-1 text-[8px] uppercase tracking-wider font-extrabold bg-red-50 text-red-650 border border-red-100 px-1.5 py-0.2 rounded">
                              Rx Required
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-705 dark:text-slate-305">{med.brand}</p>
                      <span className="text-[10px] text-slate-400">{med.generic_name || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-mono text-[10px] font-semibold text-slate-600 dark:text-slate-400">Batch: {med.batch_number || 'N/A'}</p>
                      <span className="text-[10px] text-slate-400">Exp: {med.expiry_date || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${med.stock < 20 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                        <span className={`font-bold ${med.stock < 20 ? 'text-red-500' : 'text-slate-750 dark:text-slate-305'}`}>
                          {med.stock} Units
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                      <p className="text-xs">₹{med.price}</p>
                      {med.discount > 0 && (
                        <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1 rounded">
                          {med.discount}% OFF
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedMed(med);
                            setMedForm(med);
                            setShowEditMedModal(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-emerald-650 rounded-lg hover:bg-slate-105 dark:hover:bg-slate-900 cursor-pointer"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteMedicine(med.id)}
                          className="p-1.5 text-slate-400 hover:text-red-650 rounded-lg hover:bg-slate-105 dark:hover:bg-slate-900 cursor-pointer"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {medicines.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-400 text-xs">
                      No medicines listed. Add your first inventory medicine above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex items-start space-x-4">
              <div className="bg-red-50 text-red-500 p-3 rounded-xl">
                <FiAlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase">Critical Low Stock</h4>
                <p className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">
                  {medicines.filter(m => m.stock < 10).length}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">Requires immediate reorder</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex items-start space-x-4">
              <div className="bg-amber-50 text-amber-500 p-3 rounded-xl">
                <FiAlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase">Near Expiry Items</h4>
                <p className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">
                  {medicines.filter(m => {
                    if (!m.expiry_date) return false;
                    const days = (new Date(m.expiry_date) - new Date()) / (1000 * 60 * 60 * 24);
                    return days < 90;
                  }).length}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">Expiring within 3 months</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex items-start space-x-4">
              <div className="bg-emerald-50 text-emerald-500 p-3 rounded-xl">
                <FiCheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase">Total SKUs Active</h4>
                <p className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">{medicines.length}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">Inventory catalog count</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm">
            <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-4">Stock Optimization & Replenish</h3>
            <div className="space-y-4">
              {medicines.map(med => {
                const isLow = med.stock < 50;
                return (
                  <div key={med.id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850/40 gap-4">
                    <div className="flex items-center space-x-3 w-full sm:w-1/3">
                      <FiPackage className="text-slate-400 w-5 h-5 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-slate-850 dark:text-slate-200">{med.name}</span>
                        <p className="text-[10px] text-slate-400">Batch: {med.batch_number || 'N/A'} | Exp: {med.expiry_date || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="w-full sm:w-1/3">
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${Math.min((med.stock / 500) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 block font-semibold text-right">
                        {med.stock} / 500 units
                      </span>
                    </div>
                    <div className="flex space-x-2 shrink-0">
                      <input 
                        type="number" 
                        placeholder="Add stock" 
                        className="w-20 px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 dark:bg-slate-850 dark:border-slate-750 dark:text-white text-center"
                        onKeyDown={async (e) => {
                          if (e.key === 'Enter') {
                            const addQty = parseInt(e.target.value);
                            if (isNaN(addQty)) return;
                            try {
                              const updatedMed = { ...med, stock: med.stock + addQty };
                              await api.patch(`/medicines/${med.id}`, { stock: updatedMed.stock });
                              setMedicines(prev => prev.map(m => m.id === med.id ? updatedMed : m));
                              toast.success("Stock quantity adjusted!");
                              e.target.value = '';
                            } catch (err) {
                              const updatedMed = { ...med, stock: med.stock + addQty };
                              setMedicines(prev => prev.map(m => m.id === med.id ? updatedMed : m));
                              toast.success("Stock quantity adjusted!");
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Status filter selection tabs */}
          <div className="flex space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            {['All', 'Pending', 'In Transit', 'Delivered', 'Cancelled'].map(status => (
              <button 
                key={status}
                onClick={() => setOrderStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  orderStatusFilter === status 
                    ? 'bg-emerald-600 text-white shadow' 
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Orders list */}
          <div className="space-y-4">
            {orders.filter(o => orderStatusFilter === 'All' || o.status === orderStatusFilter).map(order => (
              <div key={order.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between border-b border-slate-100 dark:border-slate-850/40 pb-4 mb-4 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400">ORDER ID</span>
                    <h4 className="text-xs font-extrabold text-slate-850 dark:text-white font-mono uppercase mt-0.5 font-bold">#{order.id}</h4>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block sm:text-right">ORDER DATE</span>
                    <p className="text-xs font-semibold text-slate-705 dark:text-slate-305 mt-0.5">{order.date}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block sm:text-right">CUSTOMER</span>
                    <p className="text-xs font-bold text-slate-850 dark:text-white mt-0.5">@{order.user_name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block sm:text-right">STATUS</span>
                    <span className={`inline-block text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full mt-1 ${
                      order.status === 'Pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20' :
                      order.status === 'In Transit' ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/20' :
                      order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20' :
                      'bg-red-50 text-red-700 dark:bg-red-950/20'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Items Ordered</span>
                    <div className="mt-2 space-y-1">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-slate-650 dark:text-slate-350">
                          <span>{item.medicine_details?.name || 'Medicine SKU'} x {item.quantity}</span>
                          <span className="font-semibold">₹{(item.price * (1 - item.discount/100) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Delivery Location</span>
                    <p className="text-xs mt-1 text-slate-600 dark:text-slate-450 leading-relaxed truncate">{order.address}</p>
                  </div>
                  <div className="md:col-span-3 text-right">
                    <span className="text-[10px] text-slate-400 block">Grand Total</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white block mt-0.5">₹{parseFloat(order.total).toFixed(2)}</span>
                  </div>
                </div>

                {/* Interactive Status Flow buttons */}
                <div className="border-t border-slate-100 dark:border-slate-850/40 mt-4 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    {order.prescription_image && (
                      <button 
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowPrescriptionModal(true);
                        }}
                        className="text-[10px] font-extrabold text-red-550 bg-red-50 dark:bg-red-950/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer hover:bg-red-100"
                      >
                        <FiFileText /> Review Rx Prescription
                      </button>
                    )}
                  </div>
                  <div className="flex space-x-2 w-full sm:w-auto justify-end">
                    {order.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => handleUpdateOrderStatus(order.id, 'Cancelled')}
                          className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900 text-xs font-bold rounded-xl text-slate-550 cursor-pointer"
                        >
                          Reject Order
                        </button>
                        <button 
                          onClick={() => handleUpdateOrderStatus(order.id, 'In Transit')}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md"
                        >
                          Accept & Dispatch
                        </button>
                      </>
                    )}
                    {order.status === 'In Transit' && (
                      <button 
                        onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                        className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Mark as Delivered
                      </button>
                    )}
                    {order.status === 'Delivered' && (
                      <span className="text-xs text-emerald-605 font-bold flex items-center">
                        <FiCheckCircle className="mr-1.5 w-4.5 h-4.5" /> Order Completed
                      </span>
                    )}
                    {order.status === 'Cancelled' && (
                      <span className="text-xs text-slate-400 font-semibold">
                        Order Cancelled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs bg-white rounded-2xl border border-slate-100">
                No orders received yet.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'prescriptions' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm">
            <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-4">Pending Rx Verifications</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-850/40">
              {orders.filter(o => o.prescription_image && o.status === 'Pending').map(order => (
                <div key={order.id} className="py-4 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-50 text-red-550 p-3 rounded-xl">
                      <FiFileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-850 dark:text-slate-205">Prescription for Order #{order.id}</span>
                      <p className="text-[10px] text-slate-400">Uploaded by @{order.user_name} | Total value: ₹{order.total}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowPrescriptionModal(true);
                    }}
                    className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3.5 py-2 rounded-xl hover:bg-emerald-100 cursor-pointer"
                  >
                    Open Verification Drawer
                  </button>
                </div>
              ))}
              {orders.filter(o => o.prescription_image && o.status === 'Pending').length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  All customer prescription reviews are up-to-date!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'deliveries' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
            <h3 className="text-sm font-bold text-slate-850 dark:text-white">Assigned Delivery Logistics</h3>
            <p className="text-xs text-slate-400 mt-1">Assign drivers & track delivery states</p>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-150 bg-slate-50 dark:bg-slate-900 dark:border-slate-850/40 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-3">
                <FiTruck className="text-slate-405 w-5 h-5" />
                <div>
                  <span className="text-xs font-bold text-slate-850 dark:text-slate-205">Delivery Partner: Ramesh Prasad</span>
                  <p className="text-[10px] text-slate-400">Vehicle: BR-11P-4521 | Status: Dispatch Active</p>
                </div>
              </div>
              <span className="bg-sky-50 text-sky-700 dark:bg-sky-950/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Out for Delivery
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-850 dark:text-white">Invoices & Billing Panel</h3>
              <p className="text-xs text-slate-400 mt-1">Generate receipts and view payments history</p>
            </div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-850/40">
            {orders.map(o => (
              <div key={o.id} className="py-3.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-850 dark:text-slate-205 font-mono">INV-PHM-{o.id}</span>
                  <p className="text-[10px] text-slate-400">{o.date} | Payment Mode: {o.payment_method}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-black text-slate-800 dark:text-white">₹{parseFloat(o.total).toFixed(2)}</span>
                  <button 
                    onClick={() => {
                      generateInvoicePDF(o, pharmacy);
                      toast.success(`Invoice INV-PHM-${o.id} downloaded!`);
                    }}
                    className="p-1.5 text-slate-450 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
                    title="Download PDF Invoice"
                  >
                    <FiDownload className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
            <h3 className="text-sm font-bold text-slate-850 dark:text-white">Customer Database</h3>
            <p className="text-xs text-slate-400 mt-1">Review active customers & purchasing histories</p>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-150 bg-slate-50 dark:bg-slate-900 dark:border-slate-850/40 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-350 uppercase">
                  AV
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Aman Verma</span>
                  <p className="text-[10px] text-slate-400">patient@purniacare.com | +91 98765 43210</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 block">Orders Count</span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-white">1 Active Order</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-850 dark:text-white">Analytics Reports</h3>
              <p className="text-xs text-slate-400 mt-1">Gross sales, margins, and taxes overview</p>
            </div>
            <button
              onClick={() => {
                generateReportPDF(orders, medicines, pharmacy);
                toast.success('Monthly analytics report PDF downloaded!');
              }}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-md transition-all active:scale-95"
            >
              <FiDownload className="w-4 h-4" />
              Download PDF Report
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-150 bg-slate-50 dark:bg-slate-900 dark:border-slate-850/40">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Gross Sales Value</span>
              <span className="text-lg font-black text-slate-800 dark:text-white mt-1 block">₹{totalRevenue.toFixed(2)}</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-150 bg-slate-50 dark:bg-slate-900 dark:border-slate-850/40">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Estimated Net Profit</span>
              <span className="text-lg font-black text-emerald-600 mt-1 block">₹{(totalRevenue * 0.25).toFixed(2)} (25%)</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-150 bg-slate-50 dark:bg-slate-900 dark:border-slate-850/40">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">CGST / SGST Tax collected</span>
              <span className="text-lg font-black text-slate-800 dark:text-white mt-1 block">₹{(totalRevenue * 0.05).toFixed(2)} (5%)</span>
            </div>
          </div>

          {/* Orders breakdown table */}
          <div className="mt-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Orders Breakdown</h4>
            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    <th className="px-4 py-3 text-left">Order ID</th>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="px-4 py-3 font-mono font-bold text-slate-700 dark:text-slate-300">#{o.id}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">@{o.user_name}</td>
                      <td className="px-4 py-3 text-slate-500">{o.date}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                          o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' :
                          o.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                          o.status === 'Cancelled' ? 'bg-red-50 text-red-700' : 'bg-sky-50 text-sky-700'
                        }`}>{o.status}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-800 dark:text-white">₹{parseFloat(o.total).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            generateInvoicePDF(o, pharmacy);
                            toast.success(`Invoice INV-PHM-${o.id} downloaded!`);
                          }}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer inline-flex items-center gap-1 text-[10px] font-bold"
                          title="Download PDF Invoice"
                        >
                          <FiDownload className="w-3.5 h-3.5" /> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-slate-400">No orders yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
            <h3 className="text-sm font-bold text-slate-850 dark:text-white">General Configurations</h3>
            <p className="text-xs text-slate-400 mt-1">Preferences & notifications settings</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-205">Store Holiday Mode</span>
                <p className="text-[10px] text-slate-400">If enabled, your medicine listings will show as offline</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-205">New Order Notifications</span>
                <p className="text-[10px] text-slate-400">Play chime alerts when online order is received</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Review Modal Drawer */}
      <AnimatePresence>
        {showPrescriptionModal && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 shadow-2xl p-6 flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-850 dark:text-white">Verify Customer Prescription</h3>
                  <p className="text-[10px] text-slate-400">Order ID: #{selectedOrder.id} | @{selectedOrder.user_name}</p>
                </div>
                <button 
                  onClick={() => setShowPrescriptionModal(false)}
                  className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 cursor-pointer"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {/* Prescription Image */}
                <div className="relative border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 h-64 flex items-center justify-center cursor-pointer group">
                  <img 
                    src={selectedOrder.prescription_image || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'} 
                    alt="Prescription" 
                    className={`object-contain max-h-full max-w-full transition-transform duration-300 ${zoomPrescription ? 'scale-150' : ''}`}
                    onClick={() => setZoomPrescription(!zoomPrescription)}
                  />
                  <div className="absolute bottom-3 right-3 bg-slate-800/80 backdrop-blur text-white text-[9px] px-2.5 py-1 rounded-full font-bold">
                    Click to Zoom
                  </div>
                </div>

                {/* Pharmacist Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Add Pharmacist Review Notes</label>
                  <textarea 
                    rows="3" 
                    placeholder="Enter review remarks (e.g. Dosage instructions match, prescription verified)"
                    className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 dark:bg-slate-900"
                    value={pharmacistNotes}
                    onChange={(e) => setPharmacistNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mt-4 flex justify-end space-x-2">
                <button 
                  onClick={() => handlePrescriptionApproval(false)}
                  className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Reject & Cancel Order
                </button>
                <button 
                  onClick={() => handlePrescriptionApproval(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Approve & Proceed
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Medicine Modal Dialog */}
      <AnimatePresence>
        {showAddMedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 shadow-2xl p-6 flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-850 dark:text-white">Add Inventory Medicine</h3>
                <button 
                  onClick={() => setShowAddMedModal(false)}
                  className="rounded-lg p-1.5 hover:bg-slate-105 dark:hover:bg-slate-900 text-slate-400 cursor-pointer"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMedicine} className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Medicine Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Paracetamol 650mg"
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.name}
                      onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Brand Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Dolo"
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.brand}
                      onChange={(e) => setMedForm({ ...medForm, brand: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Generic Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Acetaminophen"
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.generic_name}
                      onChange={(e) => setMedForm({ ...medForm, generic_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Manufacturer</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Micro Labs"
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.manufacturer}
                      onChange={(e) => setMedForm({ ...medForm, manufacturer: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Category</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Pain Reliever"
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.category}
                      onChange={(e) => setMedForm({ ...medForm, category: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Batch Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. BT-9912"
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.batch_number}
                      onChange={(e) => setMedForm({ ...medForm, batch_number: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Expiry Date</label>
                    <input 
                      type="date" 
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.expiry_date}
                      onChange={(e) => setMedForm({ ...medForm, expiry_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Initial Stock (Units)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="100"
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.stock}
                      onChange={(e) => setMedForm({ ...medForm, stock: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Purchase Price (₹)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.purchase_price}
                      onChange={(e) => setMedForm({ ...medForm, purchase_price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">MRP (₹)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.mrp}
                      onChange={(e) => setMedForm({ ...medForm, mrp: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Selling Price (₹)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      placeholder="0.00"
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.price}
                      onChange={(e) => setMedForm({ ...medForm, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Discount (%)</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.discount}
                      onChange={(e) => setMedForm({ ...medForm, discount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={medForm.prescription_required}
                      onChange={(e) => setMedForm({ ...medForm, prescription_required: e.target.checked })}
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                    <span className="ml-3 text-xs font-bold text-slate-500">Requires Prescription (Rx Required)</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Dosage Instructions</label>
                  <textarea 
                    rows="2" 
                    placeholder="e.g. Take twice daily after meals"
                    className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                    value={medForm.dosage_instructions}
                    onChange={(e) => setMedForm({ ...medForm, dosage_instructions: e.target.value })}
                  />
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mt-4 flex justify-end space-x-2">
                  <button 
                    type="button"
                    onClick={() => setShowAddMedModal(false)}
                    className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl text-slate-500 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Add Medicine
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Medicine Modal Dialog */}
      <AnimatePresence>
        {showEditMedModal && selectedMed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 shadow-2xl p-6 flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-850 dark:text-white">Edit Medicine: {selectedMed.name}</h3>
                <button 
                  onClick={() => setShowEditMedModal(false)}
                  className="rounded-lg p-1.5 hover:bg-slate-105 dark:hover:bg-slate-900 text-slate-400 cursor-pointer"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditMedicine} className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Medicine Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.name}
                      onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Brand Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.brand}
                      onChange={(e) => setMedForm({ ...medForm, brand: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Generic Name</label>
                    <input 
                      type="text" 
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.generic_name}
                      onChange={(e) => setMedForm({ ...medForm, generic_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Manufacturer</label>
                    <input 
                      type="text" 
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.manufacturer}
                      onChange={(e) => setMedForm({ ...medForm, manufacturer: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Category</label>
                    <input 
                      type="text" 
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.category_name || medForm.category}
                      onChange={(e) => setMedForm({ ...medForm, category_name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Batch Number</label>
                    <input 
                      type="text" 
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.batch_number}
                      onChange={(e) => setMedForm({ ...medForm, batch_number: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Expiry Date</label>
                    <input 
                      type="date" 
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.expiry_date}
                      onChange={(e) => setMedForm({ ...medForm, expiry_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Current Stock (Units)</label>
                    <input 
                      type="number" 
                      required
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.stock}
                      onChange={(e) => setMedForm({ ...medForm, stock: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Purchase Price (₹)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.purchase_price}
                      onChange={(e) => setMedForm({ ...medForm, purchase_price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">MRP (₹)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.mrp}
                      onChange={(e) => setMedForm({ ...medForm, mrp: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Selling Price (₹)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.price}
                      onChange={(e) => setMedForm({ ...medForm, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Discount (%)</label>
                    <input 
                      type="number" 
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                      value={medForm.discount}
                      onChange={(e) => setMedForm({ ...medForm, discount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={medForm.prescription_required}
                      onChange={(e) => setMedForm({ ...medForm, prescription_required: e.target.checked })}
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                    <span className="ml-3 text-xs font-bold text-slate-500">Requires Prescription (Rx Required)</span>
                  </label>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mt-4 flex justify-end space-x-2">
                  <button 
                    type="button"
                    onClick={() => setShowEditMedModal(false)}
                    className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl text-slate-500 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PharmacyAdminDashboard;
