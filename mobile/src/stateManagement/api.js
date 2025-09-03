// api.js
import axios from 'axios';

const API_BASE_URL = 'http://10.5.50.27:5000/v2/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
