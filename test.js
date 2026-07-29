import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});
api.get('/doctors').then(res => console.log(res.data)).catch(err => console.log(err));
