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

// Create a custom axios instance
const api = axios.create({
  baseURL: '/api',
});

// Helper to simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
  if (url === '/login' && method === 'post') {
    const { email, password } = data || {};
    const userRole = Object.keys(mockUsers).find(
      role => mockUsers[role].email === email && mockUsers[role].password === password
    );
    if (userRole) {
      return mockResponse(200, { token: 'mock-jwt-token', user: mockUsers[userRole] });
    }
    return mockResponse(401, { message: 'Invalid credentials. Try patient@purniacare.com / password123' });
  }
  if (url === '/reports' && method === 'get') {
    return mockResponse(200, mockReports);
  }

  // If request doesn't match any mock route, let it pass through
  return config;
});

// Capture mock rejections and resolve them as successful axios responses if they are 2xx
api.interceptors.response.use(
  (response) => response,
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
