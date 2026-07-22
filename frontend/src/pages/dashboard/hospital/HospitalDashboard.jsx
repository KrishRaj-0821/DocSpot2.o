import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../../services/apiService';
import { useAuth } from '../../../context/AuthContext';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement 
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { FiUsers, FiLayers, FiCalendar, FiDollarSign, FiPlusCircle, FiTrash2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, ArcElement, Title, Tooltip, Legend
);

export const HospitalDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // CRUD States
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('');
  const [newDocFees, setNewDocFees] = useState('');
  const [newDeptName, setNewDeptName] = useState('');

  const fetchHospitalData = async () => {
    try {
      const docRes = await api.get('/doctors');
      const aptRes = await api.get('/appointments');
      const hospRes = await api.get('/hospitals');

      const hospId = user?.id || 'hosp-1';
      const hospitalObj = hospRes.data.find(h => h.id === hospId);

      setDoctors(docRes.data.filter(d => d.hospitalId === hospId));
      setAppointments(aptRes.data.filter(a => a.doctorId === 'doc-1')); // mock match
      setDepartments(hospitalObj ? hospitalObj.departments : ["Cardiology", "Pediatrics", "Dermatology"]);
    } catch (err) {
      toast.error("Failed to load hospital registries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitalData();
  }, [user]);

  // Doctor CRUD
  const handleAddDoctor = (e) => {
    e.preventDefault();
    if (!newDocName || !newDocSpecialty || !newDocFees) {
      toast.error("Please fill in doctor details.");
      return;
    }

    const newDoc = {
      id: `doc-${Date.now()}`,
      name: newDocName,
      specialization: newDocSpecialty,
      qualification: "MD, DNB (Specialist)",
      experience: 6,
      fees: parseInt(newDocFees),
      rating: 5.0,
      reviewsCount: 1,
      availableDays: ["Mon", "Wed", "Fri"],
      availableTime: "11:00 AM - 02:00 PM",
      photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
      hospitalId: user?.id || 'hosp-1',
      hospitalName: user?.name || 'Purnia Care Central Hospital'
    };

    setDoctors([...doctors, newDoc]);
    toast.success(`${newDocName} added to hospital medical staff.`);
    
    setNewDocName('');
    setNewDocSpecialty('');
    setNewDocFees('');
  };

  const handleRemoveDoctor = (id, name) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
    toast.error(`${name} removed from hospital staff.`);
  };

  // Department CRUD
  const handleAddDept = (e) => {
    e.preventDefault();
    if (!newDeptName) return;

    if (departments.includes(newDeptName)) {
      toast.error("Department already exists.");
      return;
    }

    setDepartments([...departments, newDeptName]);
    toast.success(`Department "${newDeptName}" added to hospital suite.`);
    setNewDeptName('');
  };

  const handleRemoveDept = (name) => {
    setDepartments(prev => prev.filter(dept => dept !== name));
    toast.error(`Department "${name}" removed.`);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-650 border-t-transparent"></div>
      </div>
    );
  }

  // Chart data definitions
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Monthly Revenue (₹)',
        data: [45000, 52000, 49000, 68000, 72000, 81000, 95000],
        borderColor: '#0F766E',
        backgroundColor: 'rgba(15, 118, 110, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const deptDistributionData = {
    labels: departments.slice(0, 4),
    datasets: [
      {
        label: 'Staff Count',
        data: [4, 3, 2, 1].slice(0, departments.length),
        backgroundColor: ['#0F766E', '#14B8A6', '#0EA5E9', '#F59E0B'],
      }
    ]
  };

  // RENDER DYNAMICALLY BASED ON ROUTE PATH

  // View 1: Hospital Overview Dashboard
  if (path === '/hospital/dashboard' || path === '/hospital') {
    return (
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-805 flex items-center space-x-4">
            <div className="rounded-xl bg-primary-50 p-3 text-primary-650 dark:bg-primary-950/40">
              <FiUsers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Staff Doctors</p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{doctors.length}</h3>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-805 flex items-center space-x-4">
            <div className="rounded-xl bg-accent-50 p-3 text-accent-600 dark:bg-accent-950/40">
              <FiLayers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Departments</p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{departments.length}</h3>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-805 flex items-center space-x-4">
            <div className="rounded-xl bg-teal-50 p-3 text-teal-650 dark:bg-teal-950/40">
              <FiCalendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">OPD Bookings</p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">340</h3>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-805 flex items-center space-x-4">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/40">
              <FiDollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Total Revenue</p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">₹95,000</h3>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b pb-3 dark:border-slate-700/60 mb-4">
              Revenue Analytics Growth
            </h3>
            <div className="h-64">
              <Line data={revenueChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b pb-3 dark:border-slate-700/60 mb-4">
              Staff Allocation
            </h3>
            <div className="h-64 flex items-center justify-center">
              <Doughnut data={deptDistributionData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // View 2: Doctor Staff Management
  if (path === '/hospital/doctors') {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-105 dark:bg-slate-800 dark:border-slate-800 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-700/60">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Affiliated Doctors staff</h3>
          <span className="text-[10px] font-bold text-slate-400">{doctors.length} Registered</span>
        </div>

        <form onSubmit={handleAddDoctor} className="grid grid-cols-1 gap-3 sm:grid-cols-4 bg-slate-50 p-4 rounded-xl dark:bg-slate-900 text-xs">
          <input
            type="text" required placeholder="Dr. Name" value={newDocName}
            onChange={(e) => setNewDocName(e.target.value)}
            className="rounded-lg border border-slate-205 bg-white p-2 dark:border-slate-750 dark:bg-slate-950 focus:outline-none"
          />
          <select
            required value={newDocSpecialty} onChange={(e) => setNewDocSpecialty(e.target.value)}
            className="rounded-lg border border-slate-205 bg-white p-2 dark:border-slate-750 dark:bg-slate-950 focus:outline-none"
          >
            <option value="">Specialty</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Orthopedics">Orthopedics</option>
          </select>
          <input
            type="number" required placeholder="Fees (₹)" value={newDocFees}
            onChange={(e) => setNewDocFees(e.target.value)}
            className="rounded-lg border border-slate-205 bg-white p-2 dark:border-slate-750 dark:bg-slate-950 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary-600 font-bold text-white shadow hover:bg-primary-750 flex items-center justify-center space-x-1 py-2"
          >
            <FiPlus />
            <span>Add Staff</span>
          </button>
        </form>

        <div className="space-y-3">
          {doctors.map(doc => (
            <div key={doc.id} className="flex justify-between items-center border border-slate-50 p-3 rounded-xl dark:border-slate-750/60">
              <div className="flex items-center space-x-3">
                <img src={doc.photo} alt={doc.name} className="h-9 w-9 rounded-lg object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{doc.name}</h4>
                  <p className="text-[10px] text-slate-505">{doc.specialization} | Fees: ₹{doc.fees}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveDoctor(doc.id, doc.name)}
                className="text-red-505 hover:text-red-700 p-2 text-xs"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // View 3: Department Management
  if (path === '/hospital/departments') {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-105 dark:bg-slate-800 dark:border-slate-800 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-700/60">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Core Clinical Departments</h3>
          <span className="text-[10px] font-bold text-slate-400">{departments.length} Active</span>
        </div>

        <form onSubmit={handleAddDept} className="flex gap-2 bg-slate-50 p-4 rounded-xl dark:bg-slate-900">
          <input
            type="text" required placeholder="Enter department name (e.g. Urology)..." value={newDeptName}
            onChange={(e) => setNewDeptName(e.target.value)}
            className="flex-1 rounded-lg border border-slate-205 bg-white p-2 text-xs focus:outline-none dark:border-slate-750 dark:bg-slate-950"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-primary-750 flex items-center justify-center space-x-1"
          >
            <FiPlus />
            <span>Add Suite</span>
          </button>
        </form>

        <div className="grid grid-cols-2 gap-3">
          {departments.map((dept, idx) => (
            <div key={idx} className="flex justify-between items-center border border-slate-50 p-3 rounded-xl dark:border-slate-750/60 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-350">{dept}</span>
              {departments.length > 1 && (
                <button
                  onClick={() => handleRemoveDept(dept)}
                  className="text-red-500 hover:text-red-705 text-sm"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // View 4: Appointments Booking Queue
  if (path === '/hospital/appointments') {
    const mockHospBookings = [
      { patientName: "Aman Verma", doctorName: "Dr. Rajesh Kumar", date: "2026-07-22", time: "10:30 AM", status: "Upcoming", fee: 800 },
      { patientName: "Sita Devi", doctorName: "Dr. Rajesh Kumar", date: "2026-07-20", time: "11:00 AM", status: "Upcoming", fee: 800 },
      { patientName: "Ramesh Gupta", doctorName: "Dr. Rajesh Kumar", date: "2026-07-20", time: "12:15 PM", status: "Completed", fee: 800 }
    ];

    return (
      <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 dark:bg-slate-800 dark:border-slate-800 space-y-6">
        <div className="border-b pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Active OPD Schedules</h3>
          <p className="text-[10px] text-slate-400">All registered appointments scheduled across hospital staff.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold text-slate-650">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-750 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3">Patient</th>
                <th className="py-3">Staff Doctor</th>
                <th className="py-3">Schedule</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-right">OPD Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-750">
              {mockHospBookings.map((b, i) => (
                <tr key={i}>
                  <td className="py-4 font-bold text-slate-900 dark:text-white">{b.patientName}</td>
                  <td className="py-4">{b.doctorName}</td>
                  <td className="py-4">{b.date} at {b.time}</td>
                  <td className="py-4">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      b.status === 'Completed' ? 'bg-teal-50 text-teal-700' : 'bg-accent-50 text-accent-650'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-4 text-right font-bold text-slate-900 dark:text-white">₹{b.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
};
export default HospitalDashboard;
