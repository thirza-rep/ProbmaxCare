import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || `http://127.0.0.1:8000/api`,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ACCESS_TOKEN');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Log request for debugging
  console.log('API Request:', {
    method: config.method,
    url: config.url,
    data: config.data,
    hasToken: !!token
  });

  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
})

axiosClient.interceptors.response.use((response) => {
  // Log successful response for debugging
  console.log('API Response:', {
    url: response.config.url,
    status: response.status,
    data: response.data
  });

  // If response has standardized structure { status, data, message }, return just the data
  if (response.data && response.data.status && response.data.data !== undefined) {
    return {
      ...response,
      data: response.data.data,
      fullResponse: response.data // Keep full response if needed
    };
  }

  return response;
}, (error) => {
  const { response } = error;

  // Log error for debugging
  console.error('API Error:', {
    url: error.config?.url,
    status: response?.status,
    message: response?.data?.message || error.message,
    data: response?.data
  });

  // Handle 401 Unauthorized
  if (response && response.status === 401) {
    console.warn('Unauthorized - clearing token and redirecting to login');
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('USER_DATA');

    // Redirect to Laravel login page
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
    window.location.href = `${backendUrl.replace('/api', '')}/login`;
    return;
  }

  // Handle network errors
  if (!response) {
    console.error('Network error - server might be down');
    error.message = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
  }

  throw error;
})

export default axiosClient;

