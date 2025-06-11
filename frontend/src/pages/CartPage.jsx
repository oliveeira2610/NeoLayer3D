import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext'; // ✅ correto
import { addToCart } from '../services/cartService';
import './CartPage.css';

function CartPage() {
  const {
    cart = [],
    removeItem,
    updateItemQuantity,
    clearCart, // ✅ agora incluído
    getCartTotal // ✅ função vinda do contexto para somar total
  } = useCart();

  const handleQuantityChange = (productId, event) => {
    const newQuantity = event.target.value;
    if (newQuantity === '' || (!isNaN(parseInt(newQuantity)) && parseInt(newQuantity) >= 1)) {
      updateItemQuantity(productId, newQuantity === '' ? '' : parseInt(newQuantity));
    }
  };

  const handleQuantityBlur = (productId, currentQuantity) => {
    if (currentQuantity === '') {
      updateItemQuantity(productId, 1);
    }
  };

  const incrementQuantity = (productId, currentQuantity) => {
    updateItemQuantity(productId, currentQuantity + 1);
  };

  const decrementQuantity = (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateItemQuantity(productId, currentQuantity - 1);
    }
  };


const handleAddToCart = async () => {
  try {
    const res = await addToCart(currentUser.id, selectedProduct.id, 1);

    alert(res.data.message); // "Produto adicionado ao carrinho" ou outro sucesso
  } catch (err) {
    if (err.response && err.response.data?.error) {
      alert(err.response.data.error); // Exemplo: "Quantidade excede o estoque disponível"
    } else {
      alert('Erro inesperado ao adicionar ao carrinho.');
    }
  }
};


  if (!Array.isArray(cart) || cart.length === 0) {
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
          {cart.map(item => (
            <tr key={item.product_id} className="cart-item">
              <td className="cart-item-image">
                <Link to={`/produto/${item.id}`}>
                  <img
                    src={item.image_url || '/images/placeholder.png'}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/placeholder.png';
                    }}
                  />
                </Link>
              </td>
              <td className="cart-item-details">
                <Link to={`/produto/${item.id}`}>{item.name}</Link>
              </td>
              <td className="cart-item-price">R$ {item.price.toFixed(2)}</td>
              <td className="cart-item-quantity">
                <div className="quantity-selector-cart">
                  <button onClick={() => decrementQuantity(item.product_id, item.quantity)} className="quantity-btn-cart">-</button>

                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.product_id, e)}
                      onBlur={() => handleQuantityBlur(item.product_id, item.quantity)}
                      min="1"
                      className="quantity-input-cart"
                    />

                    <button onClick={() => incrementQuantity(item.product_id, item.quantity)} className="quantity-btn-cart">+</button>

                </div>
              </td>
              <td className="cart-item-subtotal">R$ {(item.price * item.quantity).toFixed(2)}</td>
              <td className="cart-item-remove">
                <button onClick={() => removeItem(item.product_id)} className="remove-btn">❌</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-summary">
        <div className="cart-actions">
          <button onClick={clearCart} className="btn btn-outline btn-clear-cart">
            Limpar Carrinho
          </button>
          <Link to="/categorias" className="btn btn-secondary">Continuar Comprando</Link>
        </div>
        <div className="cart-total">
          <h3>Total: <span className="total-price">R$ {getCartTotal().toFixed(2)}</span></h3>
          <button className="btn btn-primary btn-checkout">Finalizar Compra</button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
