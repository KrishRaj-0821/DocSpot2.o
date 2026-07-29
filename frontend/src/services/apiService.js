import axios from 'axios';
import { 
  mockDoctors, 
  mockHospitals, 
  mockMedicines, 
  mockDiagnostics, 
  mockAmbulances, 
  mockUsers,
  mockAppointments,
  mockOrders,
  mockReports
} from './mockData';

export const mockDiagnosticBookings = [
  {
    id: "bk-301",
    patient: "usr-patient",
    patient_details: {
      first_name: "Aman",
      last_name: "Verma",
      email: "patient@DocSpot.com",
      phone: "+91 98765 43210"
    },
    test: "tst-1",
    test_details: {
      id: "tst-1",
      name: "Complete Blood Count (CBC)",
      category: "Pathology",
      price: 350,
      center_details: { name: "DocSpot Central Labs" }
    },
    date: "2026-07-24",
    status: "Pending",
    prescription_file: null
  },
  {
    id: "bk-302",
    patient: "usr-patient",
    patient_details: {
      first_name: "Aman",
      last_name: "Verma",
      email: "patient@DocSpot.com",
      phone: "+91 98765 43210"
    },
    test: "tst-2",
    test_details: {
      id: "tst-2",
      name: "HbA1c (Glycated Haemoglobin)",
      category: "Diabetology",
      price: 450,
      center_details: { name: "DocSpot Central Labs" }
    },
    date: "2026-07-25",
    status: "Completed",
    prescription_file: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  }
];

// Create a custom axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Helper to simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

if (useMock) {
  // Intercept requests to mock our backend endpoints
  api.interceptors.request.use(async (config) => {
    // Simulate network latency
    await delay(400);
    
    const url = config.url || '';
    const method = config.method || 'get';
    const data = config.data;

    // Custom mock response helper
    const mockResponse = (status, responseData) => {
      return Promise.reject({
        config,
        response: {
          status,
          statusText: status === 200 || status === 201 ? 'OK' : 'Error',
          headers: {},
          config,
          data: responseData,
        },
        isMock: true
      });
    };

    // Route matching for mock requests
    if (url === '/doctors' && method === 'get') {
      return mockResponse(200, mockDoctors);
    }
    if (url.startsWith('/doctors/') && method === 'get') {
      const id = url.split('/').pop();
      const doc = mockDoctors.find(d => d.id === id);
      return doc ? mockResponse(200, doc) : mockResponse(404, { message: 'Doctor not found' });
    }
    if (url === '/hospitals' && method === 'get') {
      return mockResponse(200, mockHospitals);
    }
    if (url === '/medicines' && method === 'get') {
      return mockResponse(200, mockMedicines);
    }
    if (url === '/diagnostics' && method === 'get') {
      return mockResponse(200, mockDiagnostics);
    }
    if (url === '/ambulances' && method === 'get') {
      return mockResponse(200, mockAmbulances);
    }
    if (url === '/appointments' && method === 'get') {
      return mockResponse(200, mockAppointments);
    }
    if (url === '/book-appointment' && method === 'post') {
      const newApt = {
        id: `apt-${Math.floor(100 + Math.random() * 900)}`,
        ...data,
        status: 'Upcoming'
      };
      mockAppointments.push(newApt);
      return mockResponse(201, newApt);
    }
    if (url === '/orders' && method === 'get') {
      return mockResponse(200, mockOrders);
    }
    if (url === '/orders' && method === 'post') {
      const newOrder = {
        id: `ord-${Math.floor(8000 + Math.random() * 1000)}`,
        date: new Date().toISOString().split('T')[0],
        ...data,
        status: 'In Transit'
      };
      mockOrders.push(newOrder);
      return mockResponse(201, newOrder);
    }
    if (url === '/diagnostic-bookings' && method === 'get') {
      return mockResponse(200, mockDiagnosticBookings);
    }
    if (url.startsWith('/diagnostic-bookings/') && (method === 'patch' || method === 'put')) {
      const parts = url.split('/');
      const id = parts[parts.length - 1] || parts[parts.length - 2];
      const booking = mockDiagnosticBookings.find(b => b.id === id);
      if (booking) {
        Object.assign(booking, data);
        return mockResponse(200, booking);
      }
      return mockResponse(404, { message: 'Booking not found' });
    }
    if (url === '/pharmacies' && method === 'get') {
      const mockProfile = {
        id: 'phm-1',
        name: 'DocSpot Central Pharmacy',
        owner_name: 'Sanjay Gupta',
        drug_license_number: 'DL-98765-PUR',
        gst_number: '20AAECP9876F1Z5',
        address: 'Line Bazar Chowk, Purnia, Bihar - 854301',
        city: 'Purnia',
        phone: '+91 99999 55555',
        email: 'pharmacy@DocSpot.com',
        store_timings: '8:00 AM - 10:00 PM',
        home_delivery_available: true,
        logo: 'https://images.unsplash.com/photo-1607619056574-7b8f304b3b8f?auto=format&fit=crop&q=80&w=150',
        kyc_status: 'Approved',
        delivery_charges: 30.00,
        bank_name: 'State Bank of India',
        bank_account_number: '30994883901',
        bank_ifsc: 'SBIN0000214'
      };
      return mockResponse(200, [mockProfile]);
    }
    if (url.startsWith('/pharmacies') && method === 'patch') {
      return mockResponse(200, data);
    }
    if (url.startsWith('/orders/') && method === 'patch') {
      const parts = url.split('/');
      const id = parts[parts.length - 1] || parts[parts.length - 2];
      const order = mockOrders.find(o => o.id === id || String(o.id) === String(id));
      if (order) {
        Object.assign(order, data);
        return mockResponse(200, order);
      }
      return mockResponse(404, { message: 'Order not found' });
    }
    if (url === '/medicines' && method === 'post') {
      const newMed = {
        id: Math.floor(1000 + Math.random() * 9000),
        category_name: 'General',
        ...data
      };
      mockMedicines.push(newMed);
      return mockResponse(201, newMed);
    }
    if (url.startsWith('/medicines/') && method === 'patch') {
      const parts = url.split('/');
      const id = parts[parts.length - 1] || parts[parts.length - 2];
      const med = mockMedicines.find(m => m.id === id || String(m.id) === String(id));
      if (med) {
        Object.assign(med, data);
        return mockResponse(200, med);
      }
      return mockResponse(404, { message: 'Medicine not found' });
    }
    if (url.startsWith('/medicines/') && method === 'delete') {
      const parts = url.split('/');
      const id = parts[parts.length - 1] || parts[parts.length - 2];
      const idx = mockMedicines.findIndex(m => m.id === id || String(m.id) === String(id));
      if (idx !== -1) {
        mockMedicines.splice(idx, 1);
        return mockResponse(204, null);
      }
      return mockResponse(404, { message: 'Medicine not found' });
    }
    if (url === '/login' && method === 'post') {
      const { email, password } = data || {};
      const userRole = Object.keys(mockUsers).find(
        role => mockUsers[role].email === email && mockUsers[role].password === password
      );
      if (userRole) {
        return mockResponse(200, { token: 'mock-jwt-token', user: mockUsers[userRole] });
      }
      return mockResponse(401, { message: 'Invalid credentials. Try patient@DocSpot.com / password123' });
    }
    if (url === '/reports' && method === 'get') {
      return mockResponse(200, mockReports);
    }

    // If request doesn't match any mock route, let it pass through
    return config;
  });
}


if (!useMock) {
  // Production Request Interceptor
  api.interceptors.request.use((config) => {
    // 1. Attach JWT Token if available
    const token = localStorage.getItem('purnia_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Normalize and translate paths/payloads
    let url = config.url || '';
    const method = config.method || 'get';

    // Remove leading slash for easier checking
    if (url.startsWith('/')) {
      url = url.slice(1);
    }

    if (url === 'login') {
      config.url = '/login/';
    } else if (url === 'diagnostics') {
      config.url = '/diagnostic-tests/';
    } else if (url === 'reports') {
      config.url = '/medical-records/';
    } else if (url === 'book-appointment' && method.toLowerCase() === 'post') {
      config.url = '/appointments/';
      const data = config.data || {};
      config.data = {
        doctor: data.doctorId,
        date: data.date,
        time: data.time,
        reason: data.reason
      };
    } else if (url === 'orders' && method.toLowerCase() === 'post') {
      config.url = '/orders/';
      const data = config.data || {};
      const translatedItems = (data.items || []).map(item => ({
        medicine: item.id,
        quantity: item.quantity
      }));
      config.data = {
        ...data,
        items: translatedItems
      };
    } else {
      // For all other requests, ensure trailing slash
      let targetUrl = config.url || '';
      if (!targetUrl.endsWith('/')) {
        targetUrl += '/';
      }
      config.url = targetUrl;
    }

    return config;
  }, (error) => {
    return Promise.reject(error);
  });
}

// Response Interceptor to handle both mock rejections and production response wrapping
api.interceptors.response.use(
  (response) => {
    // In production, unwrap standard response data.data if it follows PurniaJSONRenderer format
    if (!useMock) {
      if (response.data && typeof response.data === 'object' && 'success' in response.data && 'data' in response.data) {
        response.data = response.data.data;
      }

      // Inject local filtering fields to support frontend page expectations
      const url = response.config?.url || '';
      if (Array.isArray(response.data)) {
        if (url.includes('/appointments/')) {
          response.data = response.data.map(apt => ({
            ...apt,
            patientEmail: apt.patient_details?.email || '',
            doctorName: apt.doctor_details?.user_details?.first_name ? `Dr. ${apt.doctor_details.user_details.first_name} ${apt.doctor_details.user_details.last_name || ''}` : '',
            hospitalName: apt.hospital_details?.name || '',
            specialization: apt.doctor_details?.specialization_name || ''
          }));
        } else if (url.includes('/orders/')) {
          let currentUserEmail = '';
          try {
            const savedUser = localStorage.getItem('purnia_user');
            if (savedUser) {
              currentUserEmail = JSON.parse(savedUser).email || '';
            }
          } catch (e) {
            console.error(e);
          }
          response.data = response.data.map(order => ({
            ...order,
            userEmail: currentUserEmail,
            items: (order.items || []).map(item => ({
              ...item,
              id: item.medicine,
              name: item.medicine_details?.name || '',
              price: parseFloat(item.price),
              discount: item.discount,
              quantity: item.quantity
            }))
          }));
        } else if (url.includes('/medical-records/')) {
          let currentUserEmail = '';
          try {
            const savedUser = localStorage.getItem('purnia_user');
            if (savedUser) {
              currentUserEmail = JSON.parse(savedUser).email || '';
            }
          } catch (e) {
            console.error(e);
          }
          response.data = response.data.map(rec => ({
            ...rec,
            userEmail: currentUserEmail
          }));
        }
      }
    }
    return response;
  },
  (error) => {
    if (error && error.isMock) {
      if (error.response.status >= 200 && error.response.status < 300) {
        return Promise.resolve(error.response);
      } else {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
