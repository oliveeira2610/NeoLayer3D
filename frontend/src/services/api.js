import axios from 'axios';
import {jwtDecode} from 'jwt-decode';  // corrigido o import

// Base URL da API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função para pegar token do localStorage
const getToken = () => localStorage.getItem('authToken');

// Interceptor para adicionar o token JWT no header Authorization, se existir e estiver válido
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          console.warn('Token expirado no interceptor.');
          localStorage.removeItem('authToken');
          // Opcional: redirecionar para login aqui se quiser
          // throw new axios.Cancel('Token expirado');
        } else {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Erro ao decodificar token no interceptor:', e);
        localStorage.removeItem('authToken');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Authentication ---
export const registerUser = (userData) => apiClient.post('/auth/register', userData);
export const loginUser = (credentials) => apiClient.post('/auth/login', credentials);

// --- Users ---
export const getUserById = (id) => apiClient.get(`/users/${id}`);
export const updateUserProfile = (id, profileData) => apiClient.put(`/users/${id}`, profileData);

// --- Password Change ---
export const changePassword = (currentPassword, newPassword) => {
  return apiClient.put('/change-password', { currentPassword, newPassword });
};

// --- Categories ---
export const getAllCategories = () => apiClient.get('/categories');
export const getCategoryById = (id) => apiClient.get(`/categories/${id}`);
export const createCategory = (categoryData) => apiClient.post('/categories', categoryData);
export const updateCategory = (id, categoryData) => apiClient.put(`/categories/${id}`, categoryData);
export const deleteCategory = (id) => apiClient.delete(`/categories/${id}`);


// --- Products ---
export const getAllProducts = (params) => apiClient.get('/products', { params });


export const getProductById = (id) => apiClient.get(`/products/${id}`);
export const createProduct = (productData) => apiClient.post('/products', productData);
export const updateProduct = (id, productData) => apiClient.put(`/products/${id}`, productData);
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);

// --- Admin Stats ---
export const getAdminCategoryStats = () => apiClient.get('/admin/categories/stats');
export const getAdminProductStats = () => apiClient.get('/admin/products/stats');
export const getAdminUserStats = () => apiClient.get('/admin/users/stats');

// --- Orders (Admin only) ---
export const getRecentOrders = () => apiClient.get('/admin/orders/recent');

export default apiClient;
