import React, { useState, useEffect } from 'react';
import apiClient, { getAllProducts, createProduct, updateProduct, deleteProduct, getAllCategories } from '../../services/api';
// import './AdminPages.css'; // Create CSS for admin pages styling

function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
    category_id: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllProducts(); // Add filters if needed
      setProducts(response.data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError(err.response?.data?.message || 'Falha ao buscar produtos.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (err) {
      console.error("Erro ao buscar categorias para o formulário:", err);
      // Handle error loading categories for the dropdown
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic validation before sending
    if (!currentProduct.name || !currentProduct.price || !currentProduct.category_id) {
        setError('Nome, Preço e Categoria são obrigatórios.');
        setLoading(false);
        return;
    }

    const productData = {
        ...currentProduct,
        price: parseFloat(currentProduct.price),
        stock: parseInt(currentProduct.stock) || 0,
        category_id: parseInt(currentProduct.category_id)
    };

    try {
      if (isEditing) {
        await updateProduct(currentProduct.id, productData);
        alert('Produto atualizado com sucesso!');
      } else {
        await createProduct(productData);
        alert('Produto criado com sucesso!');
      }
      resetForm();
      fetchProducts(); // Refresh list
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setError(err.response?.data?.message || 'Falha ao salvar produto.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentProduct({
        ...product,
        price: product.price.toString(), // Convert numbers back to string for input fields
        stock: product.stock.toString(),
        category_id: product.category_id.toString()
    });
    window.scrollTo(0, 0); // Scroll to top to see the form
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      setError(null);
      setLoading(true);
      try {
        await deleteProduct(id);
        alert('Produto excluído com sucesso!');
        fetchProducts(); // Refresh list
        resetForm(); // Clear form if the deleted product was being edited
      } catch (err) {
        console.error("Erro ao excluir produto:", err);
        setError(err.response?.data?.message || 'Falha ao excluir produto.');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentProduct({
      id: null,
      name: '',
      description: '',
      price: '',
      stock: '',
      image_url: '',
      category_id: ''
    });
  };

  return (
    <div className="admin-page-container"> {/* Add CSS class */} 
      <h2>Gerenciar Produtos</h2>

      {error && <p className="error-message">{error}</p>} {/* Add CSS class */} 

      <form onSubmit={handleSubmit} className="admin-form"> {/* Add CSS class */} 
        <h3>{isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}</h3>
        <input type="hidden" name="id" value={currentProduct.id || ''} />
        
        <div className="form-group"> {/* Add CSS class */} 
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={currentProduct.name}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group"> {/* Add CSS class */} 
          <label htmlFor="description">Descrição:</label>
          <textarea
            id="description"
            name="description"
            value={currentProduct.description}
            onChange={handleInputChange}
            disabled={loading}
            rows="3"
          ></textarea>
        </div>

        <div className="form-group"> {/* Add CSS class */} 
          <label htmlFor="price">Preço (R$):</label>
          <input
            type="number"
            id="price"
            name="price"
            value={currentProduct.price}
            onChange={handleInputChange}
            required
            step="0.01"
            min="0"
            disabled={loading}
          />
        </div>

        <div className="form-group"> {/* Add CSS class */} 
          <label htmlFor="stock">Estoque:</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={currentProduct.stock}
            onChange={handleInputChange}
            min="0"
            step="1"
            disabled={loading}
          />
        </div>

        <div className="form-group"> {/* Add CSS class */} 
          <label htmlFor="image_url">URL da Imagem:</label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={currentProduct.image_url}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>

        <div className="form-group"> {/* Add CSS class */} 
          <label htmlFor="category_id">Categoria:</label>
          <select
            id="category_id"
            name="category_id"
            value={currentProduct.category_id}
            onChange={handleInputChange}
            required
            disabled={loading || categories.length === 0}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-actions"> {/* Add CSS class */} 
          <button type="submit" className="btn btn-primary" disabled={loading}> {/* Add CSS class */} 
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar Produto' : 'Adicionar Produto')}
          </button>
          {isEditing && (
            <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={loading}> {/* Add CSS class */} 
              Cancelar Edição
            </button>
          )}
        </div>
      </form>

      <hr className="admin-divider" /> {/* Add CSS class */} 

      <h3>Produtos Existentes</h3>
      {loading && products.length === 0 && <p>Carregando produtos...</p>}
      
      <table className="admin-table"> {/* Add CSS class */} 
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>R$ {product.price.toFixed(2)}</td>
              <td>{product.stock}</td>
              <td>{product.category_name || 'N/A'}</td> {/* Display category name */} 
              <td>
                <button className="btn-edit" onClick={() => handleEdit(product)} disabled={loading}>Editar</button> {/* Add CSS class */} 
                <button className="btn-delete" onClick={() => handleDelete(product.id)} disabled={loading}>Excluir</button> {/* Add CSS class */} 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!loading && products.length === 0 && <p>Nenhum produto encontrado.</p>}
    </div>
  );
}

export default ManageProductsPage;

