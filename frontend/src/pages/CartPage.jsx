import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../src/contexts/CartContext'; // Adjust the path as necessary
import './CartPage.css'; // Create CSS for styling

function CartPage() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal 
  } = useCart();

  const handleQuantityChange = (productId, event) => {
    const newQuantity = event.target.value;
    // Allow clearing the input or update if it's a valid number >= 1
    if (newQuantity === '' || (!isNaN(parseInt(newQuantity)) && parseInt(newQuantity) >= 1)) {
        updateQuantity(productId, newQuantity === '' ? '' : parseInt(newQuantity));
    } 
  };

  const handleQuantityBlur = (productId, currentQuantity) => {
      // If input is cleared on blur, set quantity back to 1 or remove if needed
      if (currentQuantity === '') {
          updateQuantity(productId, 1); 
      }
  };

  const incrementQuantity = (productId, currentQuantity) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const decrementQuantity = (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    } else {
      // Optionally remove item if quantity becomes 0, or just keep it at 1
      // removeFromCart(productId); 
      updateQuantity(productId, 1); // Keep at 1 for simplicity
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page container cart-empty">
        <i className="fas fa-shopping-cart cart-empty-icon"></i>
        <h2>Seu carrinho está vazio</h2>
        <p>Parece que você ainda não adicionou nenhum produto.</p>
        <Link to="/categorias" className="btn btn-primary">Continuar Comprando</Link>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1 className="page-title">Seu Carrinho de Compras</h1>
      
      <table className="cart-table">
        <thead>
          <tr>
            <th colSpan="2">Produto</th>
            <th>Preço Unitário</th>
            <th>Quantidade</th>
            <th>Subtotal</th>
            <th>Remover</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id} className="cart-item">
              <td className="cart-item-image">
                <Link to={`/produto/${item.id}`}>
                  <img 
                    src={item.image_url || '/images/placeholder.png'} 
                    alt={item.name} 
                    onError={(e) => { e.target.onerror = null; e.target.src='/images/placeholder.png'; }}
                  />
                </Link>
              </td>
              <td className="cart-item-details">
                <Link to={`/produto/${item.id}`}>{item.name}</Link>
                {/* Add other details like SKU or options if available */}
              </td>
              <td className="cart-item-price">R$ {item.price.toFixed(2)}</td>
              <td className="cart-item-quantity">
                <div className="quantity-selector-cart">
                  <button onClick={() => decrementQuantity(item.id, item.quantity)} className="quantity-btn-cart">-</button>
                  <input 
                    type="number" 
                    value={item.quantity} 
                    onChange={(e) => handleQuantityChange(item.id, e)} 
                    onBlur={(e) => handleQuantityBlur(item.id, item.quantity)} // Handle empty input on blur
                    min="1" 
                    className="quantity-input-cart"
                  />
                  <button onClick={() => incrementQuantity(item.id, item.quantity)} className="quantity-btn-cart">+</button>
                </div>
              </td>
              <td className="cart-item-subtotal">R$ {(item.price * item.quantity).toFixed(2)}</td>
              <td className="cart-item-remove">
                <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                  <i className="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-summary">
        <div className="cart-actions">
          <button onClick={clearCart} className="btn btn-outline btn-clear-cart">Limpar Carrinho</button>
          <Link to="/categorias" className="btn btn-secondary">Continuar Comprando</Link>
        </div>
        <div className="cart-total">
          <h3>Total: <span className="total-price">R$ {getCartTotal().toFixed(2)}</span></h3>
          <button className="btn btn-primary btn-checkout">Finalizar Compra</button> 
          {/* Checkout button - functionality not implemented */}
        </div>
      </div>
    </div>
  );
}

export default CartPage;

