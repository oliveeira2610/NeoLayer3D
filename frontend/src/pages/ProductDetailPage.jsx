import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient, { getProductById } from '../../src/services/api';
import { useCart } from '../../src/contexts/CartContext'; // Import useCart
import './ProductDetailPage.css'; 

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart(); // Get addToCart function from context

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (err) {
        console.error(`Erro ao buscar produto ${id}:`, err);
        setError(err.response?.status === 404 
          ? 'Produto não encontrado.' 
          : 'Falha ao buscar o produto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    } else if (e.target.value === '') {
        setQuantity('');
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => (prev === '' ? 1 : prev + 1));
  };

  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    if (!product || quantity === '' || quantity < 1) return;
    addToCart(product, quantity); // Use context function
    // Optionally show a confirmation message/toast
    alert(`${quantity} x ${product.name} adicionado(s) ao carrinho!`); 
  };

  if (loading) {
    return <div className="container loading-message">Carregando detalhes do produto...</div>;
  }

  if (error) {
    return <div className="container error-message">{error}</div>;
  }

  if (!product) {
    return <div className="container">Produto não encontrado.</div>;
  }

  return (
    <div className="product-detail-page container">
      <div className="breadcrumbs">
        <Link to="/">Início</Link> / 
        <Link to="/categorias">Produtos</Link> / 
        {product.category_name && <><Link to={`/categorias?id=${product.category_id}`}>{product.category_name}</Link> / </>}
        <span>{product.name}</span>
      </div>

      <div className="product-detail-content">
        <div className="product-gallery">
          <img 
            src={product.image_url || '/images/placeholder.png'} 
            alt={product.name} 
            className="product-main-img" 
            onError={(e) => { e.target.onerror = null; e.target.src='/images/placeholder.png'; }}
          />
        </div>

        <div className="product-info">
          <h1 className="product-title-detail">{product.name}</h1>
          <p className="product-price-detail">R$ {product.price.toFixed(2)}</p>
          <div className="product-description">
            <p>{product.description || 'Descrição não disponível.'}</p>
          </div>

          <div className="quantity-selector">
            <label htmlFor="quantity">Quantidade:</label>
            <button onClick={decrementQuantity} className="quantity-btn">-</button>
            <input 
              type="number" 
              id="quantity" 
              name="quantity" 
              value={quantity} 
              onChange={handleQuantityChange} 
              min="1" 
              className="quantity-input"
            />
            <button onClick={incrementQuantity} className="quantity-btn">+</button>
          </div>

          <div className="product-actions-detail">
            <button onClick={handleAddToCart} className="btn btn-primary add-to-cart-btn">
              Adicionar ao Carrinho
            </button>
          </div>
          
           <div className="product-stock-info">
             {product.stock > 0 ? 
               <p>Estoque disponível: {product.stock} unidades</p> : 
               <p>Produto indisponível no momento.</p>
             }
           </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;

