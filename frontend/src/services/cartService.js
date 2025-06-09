// src/services/cartService.js
import api from './api';

export const fetchCart = () => api.get('/cart');

export const addToCart = (product_id, quantity) =>
  api.post('/cart', { product_id, quantity });

export const updateCartItem = (product_id, quantity) =>
  api.put(`/cart/${product_id}`, { quantity });

export const removeCartItem = (product_id) =>
  api.delete(`/cart/${product_id}`);

export const clearCart = () => api.delete('/cart');
