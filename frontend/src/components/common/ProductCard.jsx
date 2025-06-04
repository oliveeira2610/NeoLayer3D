import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext'; // Import useCart
import './ProductCard.css'; 

function ProductCard({ product }) {
  const { addToCart } = useCart(); // Get addToCart function from context

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    addToCart(product, 1); // Call actual add to cart function
    // Optionally show a confirmation message/toast
    // alert(`${product.name} adicionado ao carrinho!`); 
  };

  return (
    <div className="product-card">
      <Link to={`/produto/${product.id}`} className="product-card-link">
        <div className="product-card-img-container">
          <img 
            src={product.image_url || '/images/placeholder.png'} 
            alt={product.name} 
            className="product-card-img" 
            onError={(e) => { e.target.onerror = null; e.target.src='/images/placeholder.png'; }}
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
