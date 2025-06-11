import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart(product, 1);
      alert(`${product.name} adicionado ao carrinho!`);
    } catch (err) {
      const msg = err.response?.data?.error || 'Erro ao adicionar ao carrinho.';
      alert(msg); // Mostra "Quantidade excede o estoque disponível" se vier do backend
    }
  };

  return (
    <div className="product-card">
      <Link to={`/produto/${product.id}`} className="product-card-link">
        <div className="product-card-img-container">
          <img 
            src={product.image_url || '/images/placeholder.png'} 
            alt={product.name} 
            className="product-card-img" 
            onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.png'; }}
          />
        </div>
        <div className="product-card-content">
          <span className="product-card-category">{product.category_name || 'Sem Categoria'}</span>
          <h4 className="product-card-title">{product.name}</h4>
          <p className="product-card-price">R$ {product.price.toFixed(2)}</p>
        </div>
      </Link>
      <div className="product-card-actions">
        <button onClick={handleAddToCart} className="btn btn-primary btn-add-to-cart">
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
