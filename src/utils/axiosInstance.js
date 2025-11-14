import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
  },
});

// Request interceptor to add the token to headers
axiosInstance.interceptors.request.use(
  (config) => {
        const token = localStorage.getItem('token'); // Adjust based on how you store the token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
  (error) => Promise.reject(error)
);


// Response interceptor to handle responses globally
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle specific status codes if needed
        if (error.response) {
            if (error.response.status === 401) {
                // Handle unauthorized access, e.g., redirect to login
                console.error('Unauthorized, redirecting to login...');
            }   
// You can handle other status codes here
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;