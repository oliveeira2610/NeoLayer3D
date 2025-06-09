import React, { createContext, useContext, useEffect, useState } from 'react';
import * as cartService from '../services/cartService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const loadCart = async () => {
    try {
      const res = await cartService.fetchCart();
      setCart(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Usuário não autenticado, carrinho não será carregado.");
      } else {
        console.error("Erro ao carregar carrinho:", error);
      }
    }
  };

  const addToCart = async (product, quantity = 1) => {
    await cartService.addToCart(product.id, quantity);
    await loadCart();
  };

  const updateItemQuantity = async (productId, quantity) => {
    await cartService.updateCartItem(productId, quantity);
    await loadCart();
  };

  const removeItem = async (productId) => {
  try {
    await cartService.removeCartItem(productId);
    await loadCart(); // recarrega do backend para garantir sincronização
  } catch (error) {
    console.error('Erro ao remover item:', error);
  }
};



  const clearCart = async () => {
    try {
      await cartService.clearCart();
      await loadCart();
    } catch (error) {
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
