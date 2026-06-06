import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 4000, // 4 second timeout — don't hang forever
});

// Response interceptor — log proxy errors quietly, don't throw UI-breaking errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || !error.response) {
      console.warn('[LEIN] Backend offline — using mock data fallback');
    }
    return Promise.reject(error); // still reject so catch blocks in components work
  }
);

export default api;
