import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getAllProducts, getAllCategories } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import ProductFilters from '../components/common/ProductFilters';
import './CategoriesPage.css';

function CategoriesPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get('id');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');

  // Busca as categorias
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await getAllCategories();
        setCategories(response.data);
        
        // Encontra o nome da categoria selecionada
        if (selectedCategoryId) {
          const foundCategory = response.data.find(cat => cat.id.toString() === selectedCategoryId);
          setSelectedCategoryName(foundCategory ? foundCategory.name : '');
        }
      } catch (err) {
        console.error("Erro ao buscar categorias:", err);
        // Trata erro ao carregar categorias
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [selectedCategoryId]);

  // Busca os produtos com base nos filtros da URL
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setError(null);
      
      try {
        // Extrai todos os parâmetros de consulta da URL
        const params = {};
        
        // Adiciona categoria se existir
        if (selectedCategoryId) {
          params.category = selectedCategoryId;
        }
        
        // Adiciona outros filtros da URL
        if (searchParams.get('search')) params.search = searchParams.get('search');
        if (searchParams.get('priceMin')) params.priceMin = searchParams.get('priceMin');
        if (searchParams.get('priceMax')) params.priceMax = searchParams.get('priceMax');
        if (searchParams.get('sortBy')) params.sortBy = searchParams.get('sortBy');
        
        const response = await getAllProducts(params);
        setProducts(response.data);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError(err.response?.data?.message || 'Falha ao buscar produtos.');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [searchParams]); // Refetch products when any search param changes

  return (
    <div className="categories-page container">
      <h1 className="page-title">
        {selectedCategoryId 
          ? `Produtos em ${selectedCategoryName || 'Categoria'}` 
          : 'Todos os Produtos'}
      </h1>

      <div className="categories-page-content">
        {/* Sidebar com lista de categorias */}
        <aside className="categories-sidebar">
          <h3>Categorias</h3>
          {loadingCategories ? (
            <p>Carregando...</p>
          ) : (
            <ul>
              <li>
                <Link 
                  to="/categorias" 
                  className={!selectedCategoryId ? 'active' : ''}
                >
                  Todas
                </Link>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link 
                    to={`/categorias?id=${cat.id}`} 
                    className={selectedCategoryId === cat.id.toString() ? 'active' : ''}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main className="products-main-area">
          {/* Componente de filtros */}
          <ProductFilters />

          {/* Exibição de produtos */}
          {loadingProducts && <p className="loading-message">Carregando produtos...</p>}
          
          {error && <p className="error-message">{error}</p>}
          
          {!loadingProducts && products.length > 0 && (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          {!loadingProducts && products.length === 0 && !error && (
            <p className="no-products-message">
              Nenhum produto encontrado 
              {selectedCategoryId ? ` na categoria ${selectedCategoryName}` : ''}.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

export default CategoriesPage;

