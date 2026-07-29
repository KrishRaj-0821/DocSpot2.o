import axios from 'axios';
import api from './frontend/src/services/apiService.js';

async function run() {
  try {
    const response = await api.get('http://localhost:3000/some-nonexistent-api-route');
    console.log("Success?", response.data);
  } catch (e) {
    console.log("Caught Error:", e.message || e);
  }
}
run();
