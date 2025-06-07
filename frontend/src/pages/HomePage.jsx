import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient, { getAllProducts, getAllCategories } from '../../src/services/api';
// import ProductCard from '../../components/common/ProductCard'; // Create this component
// import CategoryCard from '../../components/common/CategoryCard'; // Create this component
import './HomePage.css'; // Create CSS for styling

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        // Fetch a few products (e.g., latest or featured - adjust API if needed)
        const productsResponse = await getAllProducts({ limit: 4 }); // Assuming API supports limit
        setFeaturedProducts(productsResponse.data);
      } catch (err) {
        console.error("Erro ao buscar produtos em destaque:", err);
        setError('Não foi possível carregar os produtos.');
      } finally {
        setLoadingProducts(false);
      }

      try {
        // Fetch categories
        const categoriesResponse = await getAllCategories();
        setCategories(categoriesResponse.data);
      } catch (err) {
        console.error("Erro ao buscar categorias:", err);
        // setError('Não foi possível carregar as categorias.'); // Avoid overwriting product error
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchHomePageData();
  }, []);

  return (
    <div className="homepage">
      {/* Hero Section - Recreate from HTML or design new */}
      <section className="hero">
        <div className="container hero-content">
          <h1 className="hero-title">Impressão 3D de Alta Qualidade</h1>
          <p className="hero-subtitle">Encontre os melhores produtos, filamentos e serviços para seus projetos.</p>
          <div className="hero-buttons">
            <Link to="/categorias" className="btn btn-primary">Ver Produtos</Link>
            {/* <Link to="/servicos" className="btn btn-outline">Nossos Serviços</Link> */}
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="section categories-section">
        <div className="container">
          <h2 className="section-title">Nossas Categorias</h2>
          {loadingCategories && <p>Carregando categorias...</p>}
          {!loadingCategories && categories.length > 0 && (
            <div className="categories-grid">
              {/* Replace with CategoryCard component later */}
              {categories.slice(0, 4).map(category => (
                <div key={category.id} className="category-card-placeholder">
                  <Link to={`/categorias?id=${category.id}`}>
                    <img src={category.image_url || '/images/placeholder.png'} alt={category.name} className="category-img-placeholder" />
                    <h3>{category.name}</h3>
                  </Link>
                </div>
              ))}
            </div>
          )}
          {!loadingCategories && categories.length === 0 && <p>Nenhuma categoria encontrada.</p>}
           <div className="view-all-link">
             <Link to="/categorias" className="btn btn-secondary">Ver Todas as Categorias</Link>
           </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section featured-products-section">
        <div className="container">
          <h2 className="section-title">Produtos em Destaque</h2>
          {loadingProducts && <p>Carregando produtos...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loadingProducts && featuredProducts.length > 0 && (
            <div className="products-grid">
              {/* Replace with ProductCard component later */}
              {featuredProducts.map(product => (
                <div key={product.id} className="product-card-placeholder">
                  <Link to={`/produto/${product.id}`}>
                    <img src={product.image_url || '/images/placeholder.png'} alt={product.name} className="product-img-placeholder" />
                    <div className="product-info-placeholder">
                      <span className="product-category-placeholder">{product.category_name}</span>
                      <h4>{product.name}</h4>
                      <p className="product-price-placeholder">R$ {product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                   {/* Add to cart button placeholder */}
                   <button className="btn btn-primary add-to-cart-placeholder">Adicionar</button>
                </div>
              ))}
            </div>
          )}
          {!loadingProducts && featuredProducts.length === 0 && !error && <p>Nenhum produto em destaque encontrado.</p>}
        </div>
      </section>

      {/* Add other sections like About Us, Testimonials, Newsletter if needed */}

    </div>
  );
}

export default HomePage;

