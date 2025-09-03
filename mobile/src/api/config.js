// api.js
import axios from 'axios';

export const API_BASE_URL = 'http://10.75.137.203:5000/v2/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
