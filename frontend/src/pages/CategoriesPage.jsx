import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import apiClient, { getAllProducts, getAllCategories } from '../../src/services/api';
import ProductCard from '../../src/components/common/ProductCard';
import CategoryCard from '../../src/components/common/CategoryCard'; // Optional: show categories sidebar
import './CategoriesPage.css'; // Create CSS for styling

function CategoriesPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get('id'); // Get category ID from URL query param
  const [selectedCategoryName, setSelectedCategoryName] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await getAllCategories();
        setCategories(response.data);
        // Find the name of the selected category
        if (selectedCategoryId) {
          const foundCategory = response.data.find(cat => cat.id.toString() === selectedCategoryId);
          setSelectedCategoryName(foundCategory ? foundCategory.name : '');
        }
      } catch (err) {
        console.error("Erro ao buscar categorias:", err);
        // Handle error loading categories
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [selectedCategoryId]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setError(null);
      try {
        const params = {};
        if (selectedCategoryId) {
          params.category = selectedCategoryId;
        }
        // Add other filters like search term if needed
        // params.search = searchTerm;
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
  }, [selectedCategoryId]); // Refetch products when category changes

  return (
    <div className="categories-page container">
      <h1 className="page-title">{selectedCategoryId ? `Produtos em ${selectedCategoryName || 'Categoria'}` : 'Todos os Produtos'}</h1>
      {/* Optional: Breadcrumbs */}
      {/* <div className="breadcrumbs">...</div> */}

      <div className="categories-page-content">
        {/* Optional: Sidebar with categories list */}
        <aside className="categories-sidebar">
          <h3>Categorias</h3>
          {loadingCategories && <p>Carregando...</p>}
          <ul>
            <li><Link to="/categorias" className={!selectedCategoryId ? 'active' : ''}>Todas</Link></li>
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
        </aside>

        <main className="products-main-area">
          {/* Optional: Filters/Sorting controls */} 
          {/* <div className="product-filters">...</div> */}

          {loadingProducts && <p>Carregando produtos...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loadingProducts && products.length > 0 && (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          {!loadingProducts && products.length === 0 && !error && (
            <p>Nenhum produto encontrado {selectedCategoryId ? `na categoria ${selectedCategoryName}` : ''}.</p>
          )}
          {/* Optional: Pagination */}
          {/* <div className="pagination">...</div> */}
        </main>
      </div>
    </div>
  );
}

export default CategoriesPage;

