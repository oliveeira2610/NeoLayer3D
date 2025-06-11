// src/services/cartService.js
import api from './api';

// Buscar o carrinho
export const fetchCart = () => api.get('/cart');

// Adicionar item ao carrinho com verificação de estoque
export const addToCart = (product_id, quantityToAdd) =>
  api.post('/cart/add', { product_id, quantityToAdd });

// Atualizar quantidade manualmente
export const updateCartItem = (product_id, quantity) =>
  api.put(`/cart/${product_id}`, { quantity });

// Remover um item do carrinho
export const removeCartItem = (product_id) =>
  api.delete(`/cart/${product_id}`);

// Limpar todo o carrinho
export const clearCart = () => api.delete('/cart');
