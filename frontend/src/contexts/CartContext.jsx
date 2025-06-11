import React, { createContext, useContext, useEffect, useState } from 'react';
import * as cartService from '../services/cartService';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const toastSuccess = (message) => {
    toast.success(message, {
      autoClose: 2000,
      style: { background: '#4caf50', color: 'white' },
    });
  };

  const toastError = (message) => {
    toast.error(message, {
      autoClose: 2000,
      style: { background: '#f44336', color: 'white' },
    });
  };

  const loadCart = async () => {
    try {
      const res = await cartService.fetchCart();
      setCart(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Usuário não autenticado, carrinho não será carregado.");
      } else {
        toastError("Erro ao carregar carrinho.");
        console.error("Erro ao carregar carrinho:", error);
      }
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      await cartService.addToCart(product.id, quantity);
      await loadCart();
      toastSuccess('Produto adicionado ao carrinho!');
    } catch (error) {
      toastError('Erro ao adicionar produto.');
      console.error("Erro ao adicionar ao carrinho:", error);
    }
  };

  const updateItemQuantity = async (productId, quantity) => {
    try {
      await cartService.updateCartItem(productId, quantity);
      await loadCart();
      toastSuccess('Quantidade atualizada!');
    } catch (error) {
      toastError('Erro ao atualizar item.');
      console.error("Erro ao atualizar item do carrinho:", error);
    }
  };

  const removeItem = async (productId) => {
    try {
      await cartService.removeCartItem(productId);
      await loadCart();
      toastSuccess('Item removido do carrinho!');
    } catch (error) {
      toastError('Erro ao remover item.');
      console.error('Erro ao remover item:', error);
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      await loadCart();
      toastSuccess('Carrinho limpo com sucesso!');
    } catch (error) {
      toastError('Erro ao limpar carrinho.');
      console.error("Erro ao limpar carrinho:", error);
    }
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateItemQuantity,
        removeItem,
        clearCart,
        getCartItemCount,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
