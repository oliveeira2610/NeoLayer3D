import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Determine the base URL for the API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get the token (can be adapted based on where you store it)
const getToken = () => localStorage.getItem('authToken');

// Interceptor to add JWT token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          console.warn("Token expirado no interceptor.");
          // Optionally trigger logout here if needed
          localStorage.removeItem('authToken'); // Remove expired token
          // You might want to redirect to login or refresh the token
        } else {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Erro ao decodificar token no interceptor:", e);
        localStorage.removeItem('authToken'); // Remove invalid token
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Authentication --- 
export const registerUser = (userData) => apiClient.post('/auth/register', userData);
export const loginUser = (credentials) => apiClient.post('/auth/login', credentials);

// --- Categories --- 
export const getAllCategories = () => apiClient.get('/categories');
export const getCategoryById = (id) => apiClient.get(`/categories/${id}`);
// Admin only
export const createCategory = (categoryData) => apiClient.post('/categories', categoryData);
export const updateCategory = (id, categoryData) => apiClient.put(`/categories/${id}`, categoryData);
export const deleteCategory = (id) => apiClient.delete(`/categories/${id}`);

// --- Products --- 
export const getAllProducts = (params) => apiClient.get('/products', { params }); // params for filtering/sorting
export const getProductById = (id) => apiClient.get(`/products/${id}`);
// Admin only
export const createProduct = (productData) => apiClient.post('/products', productData);
export const updateProduct = (id, productData) => apiClient.put(`/products/${id}`, productData);
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);

// --- Users (Admin only - example) ---
// export const getAllUsers = () => apiClient.get('/users');
// export const getUserById = (id) => apiClient.get(`/users/${id}`);
// export const updateUser = (id, userData) => apiClient.put(`/users/${id}`, userData);
// export const deleteUser = (id) => apiClient.delete(`/users/${id}`);


export default apiClient;

