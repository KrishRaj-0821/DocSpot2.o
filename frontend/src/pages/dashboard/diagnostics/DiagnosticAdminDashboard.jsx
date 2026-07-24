import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../../services/apiService';
import { useAuth } from '../../../context/AuthContext';
import { 
  FiGrid, FiUser, FiFileText, FiActivity, FiLayers, 
  FiCheckSquare, FiPackage, FiSettings, FiSearch, FiCheck, 
  FiX, FiRefreshCw, FiAlertTriangle, FiPlus, FiDollarSign, 
  FiClock, FiFile, FiDownload, FiUpload, FiCheckCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export const DiagnosticAdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  // Global lists from backend/mock
  const [bookings, setBookings] = useState([]);
  const [testsCatalog, setTestsCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter states
  const [searchPatient, setSearchPatient] = useState('');
  const [searchOrder, setSearchOrder] = useState('');

  // Selected entities for modals/subviews
  const [activeBooking, setActiveBooking] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeBarcodeBooking, setActiveBarcodeBooking] = useState(null);
  const [showWalkinModal, setShowWalkinModal] = useState(false);

  // Forms states
  // 1. Walk-in Test Request
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinEmail, setWalkinEmail] = useState('');
  const [walkinTestId, setWalkinTestId] = useState('');
  const [walkinDate, setWalkinDate] = useState(new Date().toISOString().split('T')[0]);

  // 2. Sample Collection
  const [selectedSampleBookingId, setSelectedSampleBookingId] = useState('');
  const [sampleType, setSampleType] = useState('Blood');
  const [collectorName, setCollectorName] = useState(user?.name || 'Technician');
  const [sampleLogs, setSampleLogs] = useState([
    { bookingId: 'bk-302', type: 'Blood', collector: 'Lal Path Technician', timestamp: '2026-07-23 10:30 AM', barcode: 'SMP-302-BLD' }
  ]);

  // 3. Result Entry
  const [selectedResultBooking, setSelectedResultBooking] = useState(null);
  const [bloodSugarValue, setBloodSugarValue] = useState('110');
  const [cbcHbValue, setCbcHbValue] = useState('14.2');
  const [resultRemarks, setResultRemarks] = useState('');
  const [microscopeImage, setMicroscopeImage] = useState(null);

  // 4. Verification & Pathologist Approval
  const [selectedVerificationBooking, setSelectedVerificationBooking] = useState(null);
  const [pathologistComments, setPathologistComments] = useState('');
  const [pathologistSignature, setPathologistSignature] = useState('Dr. S. K. Roy, MD (Pathology)');

  // 5. Inventory Items State
  const [inventory, setInventory] = useState([
    { id: 'inv-1', name: 'CBC Reagent Kits', category: 'Chemicals', stock: 12, unit: 'Boxes', status: 'Normal', expiry: '2027-04-12' },
    { id: 'inv-2', name: 'Vacutainer EDTA Blood Tubes (Purple)', category: 'Consumables', stock: 45, unit: 'Units', status: 'Low Stock', expiry: '2026-11-20' },
    { id: 'inv-3', name: 'Glucose Assay Kits', category: 'Reagents', stock: 3, unit: 'Kits', status: 'Low Stock', expiry: '2026-08-15' },
    { id: 'inv-4', name: 'Microscope Slides', category: 'Consumables', stock: 200, unit: 'Pieces', status: 'Normal', expiry: '2029-01-10' }
  ]);

  const [newInvName, setNewInvName] = useState('');
  const [newInvQty, setNewInvQty] = useState('');

  // Fetch bookings and test details
  const fetchDiagnosticsData = async () => {
    try {
      const bookingsRes = await api.get('/diagnostic-bookings');
      setBookings(bookingsRes.data);
      
      // Attempt to load diagnostic test catalog
      const testsRes = await api.get('/diagnostics');
      setTestsCatalog(testsRes.data);
    } catch (err) {
      console.error("Failed to load backend diagnostics, using mocks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnosticsData();
  }, []);

  // Handlers
  const handleCreateWalkinRequest = async (e) => {
    e.preventDefault();
    if (!walkinName || !walkinPhone || !walkinTestId) {
      toast.error("Please fill in the patient name, phone, and select a test.");
      return;
    }

    const selectedTest = testsCatalog.find(t => t.id === walkinTestId) || { name: "Custom Lab Panel", category: "Pathology", price: 500 };
    
    // In production, we'd trigger a booking creation
    const newBooking = {
      id: `bk-${Math.floor(400 + Math.random() * 600)}`,
      patient_details: {
        first_name: walkinName.split(' ')[0],
        last_name: walkinName.split(' ').slice(1).join(' ') || 'Walk-in',
        email: walkinEmail || 'walkin@example.com',
        phone: walkinPhone
      },
      test_details: {
        id: walkinTestId,
        name: selectedTest.name,
        category: selectedTest.category,
        price: selectedTest.price,
        center_details: { name: 'Purnia Care Central Labs' }
      },
      date: walkinDate,
      status: 'Pending',
      prescription_file: null
    };

    setBookings(prev => [newBooking, ...prev]);
    setShowWalkinModal(false);
    toast.success(`Walk-in test requested successfully for ${walkinName}!`);

    // Reset form
    setWalkinName('');
    setWalkinPhone('');
    setWalkinEmail('');
    setWalkinTestId('');
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // In production/mock config
      await api.patch(`/diagnostic-bookings/${id}/`, { status: newStatus });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      toast.success(`Booking #${id} status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const handleLogSample = (e) => {
    e.preventDefault();
    if (!selectedSampleBookingId) {
      toast.error("Please select a pending booking ID.");
      return;
    }

    const booking = bookings.find(b => b.id === selectedSampleBookingId);
    if (!booking) return;

    const newLog = {
      bookingId: selectedSampleBookingId,
      type: sampleType,
      collector: collectorName,
      timestamp: new Date().toLocaleString(),
      barcode: `SMP-${selectedSampleBookingId.split('-').pop()}-${sampleType.substring(0, 3).toUpperCase()}`
    };

    setSampleLogs(prev => [newLog, ...prev]);
    // Move booking status to "Sample Collected"
    handleUpdateStatus(selectedSampleBookingId, 'Sample Collected');
    setSelectedSampleBookingId('');
    toast.success(`Sample collected & logged for Booking #${selectedSampleBookingId}!`);
  };

  const handleSaveResultDraft = (e) => {
    e.preventDefault();
    toast.success("Result entered and saved as Draft.");
  };

  const handleSubmitResult = (e) => {
    e.preventDefault();
    if (!selectedResultBooking) return;

    // Simulate result save and change status to Completed
    setBookings(prev => prev.map(b => b.id === selectedResultBooking.id ? { 
      ...b, 
      status: 'Completed',
      results: [
        { parameter: 'Haemoglobin', value: cbcHbValue + ' g/dL', range: '13.0 - 17.0 g/dL', status: parseFloat(cbcHbValue) < 13 ? 'Low' : 'Normal' },
        { parameter: 'Glucose (Fasting)', value: bloodSugarValue + ' mg/dL', range: '70 - 100 mg/dL', status: parseInt(bloodSugarValue) > 100 ? 'High' : 'Normal' }
      ],
      remarks: resultRemarks
    } : b));

    toast.success(`Results logged and submitted to Pathologist for Booking #${selectedResultBooking.id}`);
    setSelectedResultBooking(null);
    setResultRemarks('');
  };

  const handleApproveReport = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Delivered', verifier: pathologistSignature, comments: pathologistComments } : b));
    toast.success(`Report approved and digital signature verified for Booking #${id}!`);
    setSelectedVerificationBooking(null);
    setPathologistComments('');
  };

  const handleAddStock = (e) => {
    e.preventDefault();
    if (!newInvName || !newInvQty) return;

    setInventory(prev => prev.map(item => 
      item.name.toLowerCase().includes(newInvName.toLowerCase()) 
        ? { ...item, stock: item.stock + parseInt(newInvQty), status: item.stock + parseInt(newInvQty) > 10 ? 'Normal' : 'Low Stock' } 
        : item
    ));

    toast.success(`Added ${newInvQty} units to stock for ${newInvName}`);
    setNewInvName('');
    setNewInvQty('');
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-650 border-t-transparent"></div>
      </div>
    );
  }

  // Dashboard Stats Calculations
  const totalRequests = bookings.length;
  const pendingRequests = bookings.filter(b => b.status === 'Pending').length;
  const samplesCount = sampleLogs.length;
  const inProgressCount = bookings.filter(b => b.status === 'Sample Collected' || b.status === 'Processing').length;
  const completedReports = bookings.filter(b => b.status === 'Completed' || b.status === 'Delivered').length;
  const revenueAmount = bookings.reduce((sum, b) => sum + (b.test_details?.price || 0), 0);
  const urgentCount = bookings.filter(b => b.reason && b.reason.toLowerCase().includes('urgent')).length;

  // View 1: Default Dashboard Overview
  if (path === '/diagnostics-admin/dashboard' || path === '/diagnostics-admin') {
    return (
      <div className="space-y-6">
        
        {/* Welcome Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-violet-700 to-indigo-650 p-6 text-white shadow-lg flex justify-between items-center">
          <div>
            <span className="inline-block rounded-full bg-violet-950/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-200 mb-2">
              Diagnostics Station
            </span>
            <h1 className="text-xl font-bold">Good Day, {user?.name || 'Technician'}!</h1>
            <p className="mt-1 text-xs text-violet-100">Access patient pathology slots, collect medical samples, and log diagnostic measurements.</p>
          </div>
          <button 
            onClick={() => setShowWalkinModal(true)}
            className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-violet-700 shadow hover:bg-violet-50 active:scale-[0.98] transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Walk-in Request</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800">
            <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wide">Total Requests</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">{totalRequests}</h3>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800">
            <p className="text-[10px] text-slate-455 font-bold uppercase tracking-wide">Pending Tests</p>
            <h3 className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">{pendingRequests}</h3>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800">
            <p className="text-[10px] text-slate-455 font-bold uppercase tracking-wide">Samples Logged</p>
            <h3 className="text-xl font-black text-sky-600 dark:text-sky-400 mt-1">{samplesCount}</h3>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800">
            <p className="text-[10px] text-slate-455 font-bold uppercase tracking-wide">Reports Completed</p>
            <h3 className="text-xl font-black text-teal-650 dark:text-teal-400 mt-1">{completedReports}</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 flex items-center space-x-4">
            <div className="rounded-xl bg-violet-50 dark:bg-violet-950/40 p-3 text-violet-650 dark:text-violet-400">
              <FiDollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase">Estimated Revenue</p>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">₹{revenueAmount.toLocaleString()}</h3>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 flex items-center space-x-4">
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 p-3 text-rose-600 dark:text-rose-455">
              <FiAlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase">Urgent Flagged</p>
              <h3 className="text-base font-black text-rose-600 dark:text-rose-400 mt-0.5">{urgentCount} Tests</h3>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 flex items-center space-x-4 col-span-2 lg:col-span-1">
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 p-3 text-indigo-650 dark:text-indigo-400">
              <FiClock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase">Processing Queue</p>
              <h3 className="text-base font-black text-indigo-650 dark:text-indigo-400 mt-0.5">{inProgressCount} In Progress</h3>
            </div>
          </div>
        </div>

        {/* Recent Requests Section */}
        <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-b pb-3 dark:border-slate-750">
            Recent Diagnostics Requests
          </h3>
          <div className="divide-y divide-slate-50 dark:divide-slate-750">
            {bookings.slice(0, 4).map(booking => (
              <div key={booking.id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-slate-808 dark:text-slate-200">
                    {booking.patient_details?.first_name} {booking.patient_details?.last_name}
                  </h4>
                  <p className="text-[10px] text-slate-455 mt-0.5">
                    {booking.test_details?.name} | scheduled: {booking.date}
                  </p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${
                  booking.status === 'Completed' || booking.status === 'Delivered' ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/45 dark:text-teal-400' :
                  booking.status === 'Cancelled' ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/45 dark:text-rose-400' :
                  'bg-amber-50 text-amber-800 dark:bg-amber-950/45 dark:text-amber-400'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Walk-in Modal */}
        {showWalkinModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-800">
              <div className="flex justify-between items-center border-b pb-3 dark:border-slate-755">
                <h3 className="font-black text-slate-900 dark:text-white text-sm">New Walk-in Test Order</h3>
                <button onClick={() => setShowWalkinModal(false)} className="text-slate-400 hover:text-slate-650 cursor-pointer">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateWalkinRequest} className="mt-4 space-y-4 text-xs font-semibold text-slate-650">
                <div>
                  <label className="block text-slate-500 mb-1">Patient Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={walkinName}
                    onChange={(e) => setWalkinName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 pl-4 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 mb-1">Mobile Phone</label>
                    <input 
                      type="text" 
                      required 
                      value={walkinPhone}
                      onChange={(e) => setWalkinPhone(e.target.value)}
                      placeholder="+91 XXXXX"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={walkinEmail}
                      onChange={(e) => setWalkinEmail(e.target.value)}
                      placeholder="optional"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">Select Diagnostic Test</label>
                  <select 
                    required
                    value={walkinTestId}
                    onChange={(e) => setWalkinTestId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="">-- Choose Package --</option>
                    {testsCatalog.map(t => (
                      <option key={t.id} value={t.id}>{t.name} (₹{t.price})</option>
                    ))}
                    <option value="cbc">Complete Blood Count (₹299)</option>
                    <option value="hba1c">HbA1c Diabetic Screen (₹349)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">Schedule Date</label>
                  <input 
                    type="date" 
                    required 
                    value={walkinDate}
                    onChange={(e) => setWalkinDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full rounded-xl bg-violet-650 py-3.5 text-white font-bold shadow hover:bg-violet-750 transition-all cursor-pointer"
                >
                  Generate Test Request
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // View 2: Patient Directory
  if (path === '/diagnostics-admin/patients') {
    // Generate some mock patients for list
    const patientDatabase = [
      { id: 'usr-patient', name: 'Aman Verma', email: 'patient@purniacare.com', phone: '+91 98765 43210', blood: 'O+ve', history: ['Complete Blood Count', 'HbA1c Fasting'] },
      { id: 'pat-102', name: 'Sita Devi', email: 'sita@example.com', phone: '+91 88776 22114', blood: 'A+ve', history: ['Lipid Profile'] },
      { id: 'pat-103', name: 'Rajesh Mishra', email: 'mishra@example.com', phone: '+91 94312 99011', blood: 'B+ve', history: ['Urine Culture'] }
    ];

    const filteredPatients = patientDatabase.filter(p => 
      p.name.toLowerCase().includes(searchPatient.toLowerCase()) ||
      p.phone.toLowerCase().includes(searchPatient.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-3 dark:border-slate-700/60">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Patients Management</h3>
              <p className="text-[10px] text-slate-455 mt-0.5">Inspect patient vitals, history metrics, and upload direct doctor prescriptions.</p>
            </div>
            
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute top-2.5 left-3 text-slate-400 text-xs" />
              <input 
                type="text"
                placeholder="Search patient name or phone..."
                value={searchPatient}
                onChange={(e) => setSearchPatient(e.target.value)}
                className="w-full rounded-lg border border-slate-205 bg-slate-50 py-1.5 pl-9 pr-3 text-xs focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto text-xs font-semibold text-slate-650">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-750 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3">Name</th>
                  <th className="py-3">Contact</th>
                  <th className="py-3">Blood Group</th>
                  <th className="py-3">Tests Logged</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-750">
                {filteredPatients.map(p => (
                  <tr key={p.id}>
                    <td className="py-4 font-bold text-slate-900 dark:text-white">{p.name}</td>
                    <td className="py-4">
                      <div>{p.phone}</div>
                      <div className="text-[10px] text-slate-400">{p.email}</div>
                    </td>
                    <td className="py-4">
                      <span className="rounded bg-red-50 dark:bg-red-950/40 text-red-650 dark:text-red-400 px-2 py-0.5 text-[10px] font-bold">
                        {p.blood}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500">{p.history.join(', ')}</td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => setSelectedPatient(p)}
                        className="rounded bg-violet-50 text-violet-750 border border-violet-250 px-2 py-1 text-[10px] hover:bg-violet-100 dark:bg-violet-950/40 dark:text-violet-400 cursor-pointer"
                      >
                        Inspect Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patient Profile Inspect Modal */}
        {selectedPatient && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-800 text-xs font-semibold text-slate-650 space-y-5">
              <div className="flex justify-between items-center border-b pb-3 dark:border-slate-755">
                <h3 className="font-black text-slate-900 dark:text-white text-sm">Patient Clinical Profile</h3>
                <button onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-slate-650 cursor-pointer">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Patient Name</span>
                  <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{selectedPatient.name}</div>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Emergency Mobile</span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{selectedPatient.phone}</div>
                </div>
              </div>

              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Previous Reports</span>
                <div className="space-y-2">
                  <div className="flex justify-between items-center border p-2.5 rounded-xl dark:border-slate-700/60">
                    <span className="font-bold text-slate-800 dark:text-slate-350">CBC_Report_Aman.pdf</span>
                    <button className="text-violet-650 hover:underline inline-flex items-center space-x-1 font-bold cursor-pointer">
                      <FiDownload className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 dark:border-slate-755 space-y-2">
                <h4 className="font-black text-slate-900 dark:text-white text-[10px] uppercase">Upload Doctor Prescription Scan</h4>
                <div className="border-2 border-dashed border-slate-205 rounded-2xl p-5 text-center flex flex-col items-center justify-center hover:border-violet-400/80 transition-colors duration-200">
                  <FiUpload className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-[10px] text-slate-455 block mb-3">Upload diagnostic referral files (PDF or PNG)</span>
                  <button 
                    onClick={() => toast.success("Prescription uploaded and linked to profile.")}
                    className="rounded-lg bg-slate-900 text-white px-3 py-2 font-bold hover:bg-black dark:bg-slate-700 cursor-pointer"
                  >
                    Select File
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // View 3: Test Orders / Bookings Log
  if (path === '/diagnostics-admin/orders') {
    const filteredOrders = bookings.filter(b => 
      b.id.toLowerCase().includes(searchOrder.toLowerCase()) ||
      (b.patient_details?.first_name || '').toLowerCase().includes(searchOrder.toLowerCase()) ||
      (b.test_details?.name || '').toLowerCase().includes(searchOrder.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-3 dark:border-slate-700/60">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Active Lab requests</h3>
              <p className="text-[10px] text-slate-455 mt-0.5 font-semibold">Track laboratory workflow states from pending collection to completed delivery.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute top-2.5 left-3 text-slate-400 text-xs" />
              <input 
                type="text"
                placeholder="Search by ID, name or test..."
                value={searchOrder}
                onChange={(e) => setSearchOrder(e.target.value)}
                className="w-full rounded-lg border border-slate-205 bg-slate-50 py-1.5 pl-9 pr-3 text-xs focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto text-xs font-semibold text-slate-650">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-750 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3">Ref ID</th>
                  <th className="py-3">Patient</th>
                  <th className="py-3">Test Package</th>
                  <th className="py-3">Scheduled Date</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-750">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 italic">No matching bookings logged.</td>
                  </tr>
                ) : (
                  filteredOrders.map(b => (
                    <tr key={b.id}>
                      <td className="py-4 font-bold text-slate-900 dark:text-white">#{b.id}</td>
                      <td className="py-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {b.patient_details?.first_name} {b.patient_details?.last_name || ''}
                        </div>
                        <div className="text-[10px] text-slate-455">{b.patient_details?.phone || 'N/A'}</div>
                      </td>
                      <td className="py-4">
                        <div className="font-bold text-slate-850 dark:text-slate-200">{b.test_details?.name}</div>
                        <span className="rounded bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wide">
                          {b.test_details?.category || 'Pathology'}
                        </span>
                      </td>
                      <td className="py-4 text-slate-500 font-bold">{b.date}</td>
                      <td className="py-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${
                          b.status === 'Completed' || b.status === 'Delivered' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400' :
                          b.status === 'Cancelled' ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-455' :
                          'bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <button 
                          onClick={() => setActiveBarcodeBooking(b)}
                          className="rounded bg-slate-100 text-slate-700 hover:bg-slate-200 px-2 py-1 text-[10px] dark:bg-slate-900 dark:text-slate-350 cursor-pointer"
                        >
                          Print Barcode
                        </button>
                        
                        <select 
                          value={b.status} 
                          onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                          className="rounded border border-slate-200 bg-slate-50 p-1 text-[10px] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Sample Collected">Sample Collected</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Barcode Print Modal */}
        {activeBarcodeBooking && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-800 text-xs font-semibold text-slate-655 text-center space-y-6">
              <div className="flex justify-between items-center border-b pb-3 dark:border-slate-755">
                <h3 className="font-black text-slate-900 dark:text-white text-sm">Print Sample Label</h3>
                <button onClick={() => setActiveBarcodeBooking(null)} className="text-slate-400 hover:text-slate-650 cursor-pointer">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Barcode Mock Rendering */}
              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 dark:bg-slate-955 flex flex-col items-center justify-center space-y-3 dark:border-slate-800">
                <div className="font-mono text-sm tracking-widest text-slate-900 dark:text-white font-black">
                  ||||| | ||||| | || |||| | | |||||
                </div>
                <div className="font-mono text-[10px] text-slate-500 tracking-wide">
                  SMP-{activeBarcodeBooking.id.toUpperCase()}-BLD
                </div>
                <div className="border-t w-full pt-2 mt-2 border-slate-200 dark:border-slate-800 text-[10px] text-left space-y-1">
                  <div><strong>Patient:</strong> {activeBarcodeBooking.patient_details?.first_name} {activeBarcodeBooking.patient_details?.last_name}</div>
                  <div><strong>Test:</strong> {activeBarcodeBooking.test_details?.name}</div>
                  <div><strong>Scheduled:</strong> {activeBarcodeBooking.date}</div>
                </div>
              </div>

              <button 
                onClick={() => {
                  toast.success("Sending label to Zebra Barcode Printer...");
                  setActiveBarcodeBooking(null);
                }}
                className="w-full rounded-xl bg-violet-650 py-3 text-white font-bold shadow hover:bg-violet-750 transition-all cursor-pointer"
              >
                Print Label (Zebra Thermal)
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // View 4: Sample Collection
  if (path === '/diagnostics-admin/samples') {
    const pendingCollectionBookings = bookings.filter(b => b.status === 'Pending');

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* Collection Log Form */}
          <div className="lg:col-span-4 rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-b pb-3 dark:border-slate-755">
              Log Sample Collection
            </h3>
            
            <form onSubmit={handleLogSample} className="space-y-4 text-xs font-semibold text-slate-655">
              <div>
                <label className="block text-slate-500 mb-1">Select Patient Booking</label>
                <select 
                  required
                  value={selectedSampleBookingId}
                  onChange={(e) => setSelectedSampleBookingId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="">-- Choose Booking --</option>
                  {pendingCollectionBookings.map(b => (
                    <option key={b.id} value={b.id}>
                      #{b.id} - {b.patient_details?.first_name} ({b.test_details?.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Sample Matrix Type</label>
                <select 
                  value={sampleType}
                  onChange={(e) => setSampleType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="Blood">Blood (EDTA / Plasma)</option>
                  <option value="Urine">Urine (Sterile Container)</option>
                  <option value="Stool">Stool (Sterile Container)</option>
                  <option value="Sputum">Sputum Scan</option>
                  <option value="Swab">Swab (Nasal/Oral)</option>
                  <option value="Biopsy">Biopsy Tissue</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Collector Staff Name</label>
                <input 
                  type="text" 
                  required
                  value={collectorName}
                  onChange={(e) => setCollectorName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <button 
                type="submit"
                className="w-full rounded-xl bg-violet-650 py-3.5 text-white font-bold shadow hover:bg-violet-750 transition-all cursor-pointer"
              >
                Log Sample & Print Barcode
              </button>
            </form>
          </div>

          {/* Collected Samples log */}
          <div className="lg:col-span-8 rounded-2xl bg-white p-6 shadow-md border border-slate-105 dark:bg-slate-800 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-b pb-3 dark:border-slate-755">
              Samples Collection Log
            </h3>
            
            <div className="overflow-x-auto text-xs font-semibold text-slate-655">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-750 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3">Booking ID</th>
                    <th className="py-3">Sample Matrix</th>
                    <th className="py-3">Logged Date/Time</th>
                    <th className="py-3">Collector</th>
                    <th className="py-3 text-right">Barcode ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-750">
                  {sampleLogs.map((log, idx) => (
                    <tr key={idx}>
                      <td className="py-4 font-bold text-slate-900 dark:text-white">#{log.bookingId}</td>
                      <td className="py-4">
                        <span className="rounded bg-violet-55 dark:bg-violet-955 text-violet-700 dark:text-violet-400 px-2 py-0.5 font-bold uppercase text-[9px] tracking-wide">
                          {log.type}
                        </span>
                      </td>
                      <td className="py-4 text-slate-500 font-bold">{log.timestamp}</td>
                      <td className="py-4">{log.collector}</td>
                      <td className="py-4 text-right font-mono text-slate-800 dark:text-slate-205 font-bold">
                        {log.barcode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // View 5: Laboratory Tests Catalog
  if (path === '/diagnostics-admin/tests') {
    const testCategories = {
      Hematology: [
        { code: 'H1', name: 'Complete Blood Count (CBC)', price: 299, range: 'Hb: 13.0-17.0', duration: '4 hrs' },
        { code: 'H2', name: 'Erythrocyte Sedimentation Rate (ESR)', price: 150, range: '0-15 mm/hr', duration: '2 hrs' },
        { code: 'H3', name: 'Platelet Count', price: 180, range: '1.5-4.5 Lakhs', duration: '3 hrs' }
      ],
      Biochemistry: [
        { code: 'B1', name: 'Blood Sugar (Fasting/PP)', price: 120, range: '70-100 mg/dL', duration: '2 hrs' },
        { code: 'B2', name: 'Liver Function Test (LFT)', price: 750, range: 'Bilirubin: 0.2-1.2', duration: '6 hrs' },
        { code: 'B3', name: 'Kidney Function Test (KFT)', price: 650, range: 'Urea: 15-40 mg/dL', duration: '6 hrs' },
        { code: 'B4', name: 'Lipid Profile', price: 800, range: 'Cholesterol: <200', duration: '8 hrs' }
      ],
      Microbiology: [
        { code: 'M1', name: 'Urine Culture & Sensitivity', price: 450, range: 'No growth', duration: '48 hrs' },
        { code: 'M2', name: 'Blood Culture & Sensitivity', price: 600, range: 'No growth', duration: '48 hrs' },
        { code: 'M3', name: 'COVID-19 RT-PCR Scan', price: 1200, range: 'Negative', duration: '12 hrs' }
      ],
      Serology: [
        { code: 'S1', name: 'HIV 1 & 2 ELISA Test', price: 400, range: 'Non-reactive', duration: '6 hrs' },
        { code: 'S2', name: 'Typhoid (Widal Agglutination)', price: 250, range: 'Negative', duration: '4 hrs' },
        { code: 'S3', name: 'Malaria Antigen Scan', price: 180, range: 'Negative', duration: '2 hrs' }
      ]
    };

    return (
      <div className="space-y-6 text-xs font-semibold text-slate-655">
        <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-6">
          <div className="border-b pb-3 dark:border-slate-700/60">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Laboratory Tests Master</h3>
            <p className="text-[10px] text-slate-455 mt-0.5">Browse core test suite reference parameters, pricing metrics, and durations.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Object.keys(testCategories).map(category => (
              <div key={category} className="border border-slate-100 rounded-2xl p-4 dark:border-slate-750/60 space-y-3">
                <h4 className="font-black text-slate-900 dark:text-white text-sm border-b pb-2 dark:border-slate-700/60 flex items-center">
                  <FiLayers className="mr-2 text-violet-550 w-4.5 h-4.5" />
                  {category}
                </h4>
                
                <div className="space-y-2">
                  {testCategories[category].map(test => (
                    <div key={test.code} className="flex justify-between items-center p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg">
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-205">{test.name}</div>
                        <p className="text-[9px] text-slate-400 mt-0.5">Range: {test.range} | ETA: {test.duration}</p>
                      </div>
                      <span className="font-extrabold text-slate-900 dark:text-white font-mono text-[10px]">
                        ₹{test.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // View 6: Result Entry Workspace
  if (path === '/diagnostics-admin/results') {
    const processingBookings = bookings.filter(b => b.status === 'Sample Collected' || b.status === 'Processing');

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* Processing Queue List */}
          <div className="lg:col-span-4 rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-b pb-3 dark:border-slate-755">
              Result Entry Queue
            </h3>
            <div className="divide-y divide-slate-50 dark:divide-slate-750 text-xs">
              {processingBookings.length === 0 ? (
                <p className="text-[10px] text-slate-400 italic py-4 text-center">No samples pending processing.</p>
              ) : (
                processingBookings.map(b => (
                  <div key={b.id} className="py-3 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-202">{b.patient_details?.first_name} {b.patient_details?.last_name || ''}</h4>
                      <p className="text-[9px] text-slate-455 mt-0.5">{b.test_details?.name}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedResultBooking(b)}
                      className="rounded bg-violet-650 text-white font-bold px-2 py-1 text-[10px] hover:bg-violet-750 cursor-pointer"
                    >
                      Enter Results
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Form Entry Details */}
          <div className="lg:col-span-8 rounded-2xl bg-white p-6 shadow-md border border-slate-105 dark:bg-slate-800 dark:border-slate-800">
            {selectedResultBooking ? (
              <form onSubmit={handleSubmitResult} className="space-y-5 text-xs font-semibold text-slate-655">
                <div className="border-b pb-3 dark:border-slate-755 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">Record Values: Booking #{selectedResultBooking.id}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Patient: {selectedResultBooking.patient_details?.first_name} {selectedResultBooking.patient_details?.last_name} | {selectedResultBooking.test_details?.name}</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setSelectedResultBooking(null)}
                    className="text-slate-455 hover:text-slate-650 cursor-pointer"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Parameters inputs depending on select test */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border border-slate-50 dark:border-slate-750/50 p-4 rounded-2xl">
                  <div>
                    <label className="block text-slate-550 mb-1">Haemoglobin (g/dL)</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="text" 
                        required
                        value={cbcHbValue} 
                        onChange={(e) => setCbcHbValue(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 pl-4 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      />
                      <span className="text-[9px] text-slate-400 whitespace-nowrap">Normal: 13.0 - 17.0</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-550 mb-1">Glucose Fasting (mg/dL)</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="text" 
                        required
                        value={bloodSugarValue} 
                        onChange={(e) => setBloodSugarValue(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 pl-4 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      />
                      <span className="text-[9px] text-slate-400 whitespace-nowrap">Normal: 70 - 100</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">Technician Findings / Remarks</label>
                  <textarea 
                    rows="3" 
                    value={resultRemarks}
                    onChange={(e) => setResultRemarks(e.target.value)}
                    placeholder="Enter clinical observations..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-550 mb-1">Attach Microscopy Scan (optional)</label>
                  <div className="border border-dashed border-slate-205 rounded-2xl p-4 text-center cursor-pointer flex flex-col items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-955">
                    <FiUpload className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-[10px] text-slate-400">Drag microscopy scans or choose files</span>
                    <button 
                      type="button"
                      onClick={() => toast.success("Microscope slide image attached.")}
                      className="mt-2 rounded bg-slate-200 dark:bg-slate-800 px-2 py-1 text-[9px] font-bold cursor-pointer"
                    >
                      Attach
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button 
                    type="button" 
                    onClick={handleSaveResultDraft}
                    className="rounded-xl border border-slate-250 bg-white text-slate-750 px-4 py-3 shadow hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white cursor-pointer"
                  >
                    Save Draft
                  </button>
                  <button 
                    type="submit" 
                    className="rounded-xl bg-violet-650 px-6 py-3 text-white font-bold shadow hover:bg-violet-750 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Submit results
                  </button>
                </div>
              </form>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 italic">
                <FiCheckSquare className="w-12 h-12 text-slate-300 mb-3" />
                <p>Select a pending sample queue entry to start result logs.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  // Verification & report list
  const reportsVerificationQueue = bookings.filter(b => b.status === 'Completed');
  const deliveredReportsList = bookings.filter(b => b.status === 'Delivered');

  return (
    <div className="space-y-6">
      
      {/* Verification Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Verification list */}
        <div className="lg:col-span-4 rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-b pb-3 dark:border-slate-755">
            Reports Pending Review ({reportsVerificationQueue.length})
          </h3>
          <div className="divide-y divide-slate-50 dark:divide-slate-750 text-xs">
            {reportsVerificationQueue.length === 0 ? (
              <p className="text-[10px] text-slate-400 italic py-4 text-center">No reports requiring pathologist signing.</p>
            ) : (
              reportsVerificationQueue.map(b => (
                <div key={b.id} className="py-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-808 dark:text-slate-205">{b.patient_details?.first_name} {b.patient_details?.last_name || ''}</h4>
                    <p className="text-[9px] text-slate-455 mt-0.5">{b.test_details?.name}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedVerificationBooking(b)}
                    className="rounded bg-violet-650 text-white font-bold px-2 py-1 text-[10px] hover:bg-violet-750 cursor-pointer"
                  >
                    Review Data
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Verification workspace editor */}
        <div className="lg:col-span-8 rounded-2xl bg-white p-6 shadow-md border border-slate-105 dark:bg-slate-800 dark:border-slate-800">
          {selectedVerificationBooking ? (
            <div className="space-y-5 text-xs font-semibold text-slate-655">
              <div className="border-b pb-3 dark:border-slate-755 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Pathologist verification: Booking #{selectedVerificationBooking.id}</h3>
                  <p className="text-[10px] text-slate-455 mt-0.5">Patient: {selectedVerificationBooking.patient_details?.first_name} {selectedVerificationBooking.patient_details?.last_name}</p>
                </div>
                <button onClick={() => setSelectedVerificationBooking(null)} className="text-slate-455 hover:text-slate-650 cursor-pointer">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Logged values summary */}
              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50 dark:bg-slate-955 dark:border-slate-800 space-y-3">
                <h4 className="font-extrabold text-[10px] uppercase text-slate-455">Submitted Parameters Measurements</h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-2">
                  <div className="flex justify-between py-1.5">
                    <span>Haemoglobin Count</span>
                    <span className="font-mono text-slate-900 dark:text-white font-extrabold">14.2 g/dL (Normal)</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span>Glucose (Fasting)</span>
                    <span className="font-mono text-slate-900 dark:text-white font-extrabold">110 mg/dL (High)</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Pathologist Comments / Summary</label>
                <textarea 
                  rows="2" 
                  value={pathologistComments}
                  onChange={(e) => setPathologistComments(e.target.value)}
                  placeholder="Enter clinical observations, comments or suggestions..."
                  className="w-full rounded-xl border border-slate-205 bg-slate-50 p-3 focus:outline-none dark:border-slate-700 dark:bg-slate-955 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Digital Signature Authority</label>
                  <input 
                    type="text" 
                    value={pathologistSignature}
                    onChange={(e) => setPathologistSignature(e.target.value)}
                    className="w-full rounded-xl border border-slate-205 bg-slate-50 p-2.5 focus:outline-none dark:border-slate-700 dark:bg-slate-955 dark:text-white"
                  />
                </div>
                <div className="flex items-end">
                  <span className="text-[10px] text-slate-400 italic">Signature will be digitally burned onto final PDF report.</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button 
                  onClick={() => {
                    setSelectedVerificationBooking(null);
                    toast.error(`Report Booking #${selectedVerificationBooking.id} rejected. Returned to technician.`);
                  }}
                  className="rounded-xl border border-red-250 bg-white text-red-655 px-4 py-3 hover:bg-red-50 dark:bg-slate-800 dark:border-slate-700 dark:text-red-400 cursor-pointer"
                >
                  Reject & Return
                </button>
                <button 
                  onClick={() => handleApproveReport(selectedVerificationBooking.id)}
                  className="rounded-xl bg-violet-650 px-6 py-3 text-white font-bold shadow hover:bg-violet-750 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Approve & Digitally Sign Report
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 italic">
              <FiCheckCircle className="w-12 h-12 text-slate-300 mb-3" />
              <p>Select a completed test result record to review & approve.</p>
            </div>
          )}
        </div>

      </div>

      {/* View: PDF Reports Log Table & QR Code Preview */}
      {path === '/diagnostics-admin/orders' || path === '/diagnostics-admin/patients' || path === '/diagnostics-admin/samples' || path === '/diagnostics-admin/tests' || path === '/diagnostics-admin/results' ? null : (
        <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-6">
          <div className="border-b pb-3 dark:border-slate-700/60">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Delivered Pathology Reports Log</h3>
            <p className="text-[10px] text-slate-455 mt-0.5">Download approved professional reports containing digital signatures and verification codes.</p>
          </div>

          <div className="overflow-x-auto text-xs font-semibold text-slate-655">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-750 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3">Report ID</th>
                  <th className="py-3">Patient</th>
                  <th className="py-3">Diagnostic Panel</th>
                  <th className="py-3">Verified By</th>
                  <th className="py-3">QR Verification</th>
                  <th className="py-3 text-right">PDF File</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-750">
                {deliveredReportsList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 italic">No reports signed off. Approve results in verification queue.</td>
                  </tr>
                ) : (
                  deliveredReportsList.map(r => (
                    <tr key={r.id}>
                      <td className="py-4 font-bold text-slate-900 dark:text-white">#{r.id}</td>
                      <td className="py-4">
                        <div className="font-bold text-slate-800 dark:text-slate-205">{r.patient_details?.first_name} {r.patient_details?.last_name || ''}</div>
                      </td>
                      <td className="py-4 font-bold">{r.test_details?.name}</td>
                      <td className="py-4 text-slate-500">{r.verifier || 'Dr. S. K. Roy, MD'}</td>
                      <td className="py-4">
                        <span 
                          onClick={() => toast.success("Scanning QR code resolves to verified test results.")}
                          className="rounded bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 px-2 py-0.5 text-[9px] uppercase font-extrabold tracking-wide cursor-pointer hover:underline"
                        >
                          Scan QR Code
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => {
                            toast.success(`Downloading PDF Report #${r.id}...`);
                          }}
                          className="rounded-lg bg-teal-50 text-teal-700 border border-teal-200 px-2 py-1 text-[10px] font-bold hover:bg-teal-100 dark:bg-teal-950/40 dark:text-teal-400 cursor-pointer inline-flex items-center space-x-1"
                        >
                          <FiFile className="w-3.5 h-3.5" />
                          <span>PDF Report</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inventory Panel (Rendered only on /inventory subpath) */}
      {path === '/diagnostics-admin/inventory' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Inventory Table */}
          <div className="lg:col-span-8 rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-4">
            <div className="border-b pb-3 dark:border-slate-700/60">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Kits & Chemicals Stock Registry</h3>
              <p className="text-[10px] text-slate-455 mt-0.5">Monitor consumables levels, kit boxes, and expiration dates.</p>
            </div>
            
            <div className="overflow-x-auto text-xs font-semibold text-slate-655">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-750 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3">Item Name</th>
                    <th className="py-3">Category</th>
                    <th className="py-3">Available Stock</th>
                    <th className="py-3">Expiry Date</th>
                    <th className="py-3 text-right">Alert Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-750">
                  {inventory.map(item => (
                    <tr key={item.id}>
                      <td className="py-4 font-bold text-slate-900 dark:text-white">{item.name}</td>
                      <td className="py-4 text-slate-500">{item.category}</td>
                      <td className="py-4 font-bold">{item.stock} {item.unit}</td>
                      <td className="py-4 font-mono text-slate-500 font-bold">{item.expiry}</td>
                      <td className="py-4 text-right">
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${
                          item.status === 'Normal' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30' : 'bg-amber-50 text-amber-800 dark:bg-amber-950/30'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Stock form */}
          <div className="lg:col-span-4 rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-b pb-3 dark:border-slate-755">
              Add Inventory Stock
            </h3>
            
            <form onSubmit={handleAddStock} className="space-y-4 text-xs font-semibold text-slate-655">
              <div>
                <label className="block text-slate-550 mb-1">Search Reagent / Kit</label>
                <input 
                  type="text" 
                  required
                  value={newInvName}
                  onChange={(e) => setNewInvName(e.target.value)}
                  placeholder="e.g. EDTA Blood Tubes"
                  className="w-full rounded-xl border border-slate-202 bg-slate-50 p-3 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-550 mb-1">Increase Quantity</label>
                <input 
                  type="number" 
                  required
                  value={newInvQty}
                  onChange={(e) => setNewInvQty(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full rounded-xl border border-slate-202 bg-slate-50 p-3 focus:outline-none dark:border-slate-700 dark:bg-slate-955 dark:text-white"
                />
              </div>

              <button 
                type="submit"
                className="w-full rounded-xl bg-violet-650 py-3.5 text-white font-bold shadow hover:bg-violet-750 transition-all cursor-pointer"
              >
                Issue / Add Inventory Stock
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Settings Panel (Rendered only on /settings subpath) */}
      {path === '/diagnostics-admin/settings' && (
        <div className="max-w-2xl rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-6">
          <div className="border-b pb-3 dark:border-slate-700/60">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Diagnostic Laboratory Configurations</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Adjust default hematology ranges, set pathology template rules, and verify barcode defaults.</p>
          </div>

          <div className="space-y-6 text-xs font-semibold text-slate-655">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4 dark:border-slate-750">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Auto Normal Ranges Validation</p>
                <p className="text-[10px] text-slate-400 max-w-sm mt-0.5">Flags values outside baseline references automatically on technician submission screens.</p>
              </div>
              <button 
                onClick={() => toast.success("Validation ranges settings updated.")}
                className="rounded-lg bg-slate-900 text-white px-3 py-2 hover:bg-black dark:bg-slate-700 cursor-pointer"
              >
                Enabled
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-bold text-slate-900 dark:text-white">Laboratory Information Address</p>
              <textarea 
                rows="2" 
                defaultValue="Purnia Care Central Labs, NH-31, Line Bazar, Purnia, Bihar - 854301"
                className="w-full rounded-xl border border-slate-205 bg-slate-50 p-3 focus:outline-none dark:border-slate-700 dark:bg-slate-955 dark:text-white"
              />
              <button 
                onClick={() => toast.success("Laboratory information updated.")}
                className="rounded-lg bg-violet-650 px-4 py-2 text-white font-bold hover:bg-violet-750 cursor-pointer"
              >
                Save Clinic Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default DiagnosticAdminDashboard;
