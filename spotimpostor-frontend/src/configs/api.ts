import axios from 'axios';

// 1. Detecta la URL: 
// En Vercel usará la variable que configuraste (https://spotimpostor-backend.onrender.com)
// En local, como no hay variable, usará '/api' (activando tu proxy de vite.config.ts)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;