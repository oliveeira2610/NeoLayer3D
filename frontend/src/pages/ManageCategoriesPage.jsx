import React, { useState, useEffect } from 'react';
import apiClient, { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../services/api';
// import './AdminPages.css'; // Create CSS for admin pages styling

function ManageCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ id: null, name: '', description: '', image_url: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
      setError(err.response?.data?.message || 'Falha ao buscar categorias.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory({ ...currentCategory, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isEditing) {
        await updateCategory(currentCategory.id, currentCategory);
        alert('Categoria atualizada com sucesso!');
      } else {
        await createCategory(currentCategory);
        alert('Categoria criada com sucesso!');
      }
      resetForm();
      fetchCategories(); // Refresh list
    } catch (err) {
      console.error("Erro ao salvar categoria:", err);
      setError(err.response?.data?.message || 'Falha ao salvar categoria.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setIsEditing(true);
    setCurrentCategory(category);
    window.scrollTo(0, 0); // Scroll to top to see the form
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Produtos associados perderão a categoria.')) {
      setError(null);
      setLoading(true);
      try {
        await deleteCategory(id);
        alert('Categoria excluída com sucesso!');
        fetchCategories(); // Refresh list
        resetForm(); // Clear form if the deleted category was being edited
      } catch (err) {
        console.error("Erro ao excluir categoria:", err);
        setError(err.response?.data?.message || 'Falha ao excluir categoria.');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentCategory({ id: null, name: '', description: '', image_url: '' });
  };

  return (
    <div className="admin-page-container"> {/* Add CSS class */} 
      <h2>Gerenciar Categorias</h2>

      {error && <p className="error-message">{error}</p>} {/* Add CSS class */} 

      <form onSubmit={handleSubmit} className="admin-form"> {/* Add CSS class */} 
        <h3>{isEditing ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</h3>
        <input type="hidden" name="id" value={currentCategory.id || ''} />
        
        <div className="form-group"> {/* Add CSS class */} 
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={currentCategory.name}
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
            value={currentCategory.description}
            onChange={handleInputChange}
            disabled={loading}
            rows="3"
          ></textarea>
        </div>

        <div className="form-group"> {/* Add CSS class */} 
          <label htmlFor="image_url">URL da Imagem:</label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={currentCategory.image_url}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>

        <div className="form-actions"> {/* Add CSS class */} 
          <button type="submit" className="btn btn-primary" disabled={loading}> {/* Add CSS class */} 
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar Categoria' : 'Adicionar Categoria')}
          </button>
          {isEditing && (
            <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={loading}> {/* Add CSS class */} 
              Cancelar Edição
            </button>
          )}
        </div>
      </form>

      <hr className="admin-divider" /> {/* Add CSS class */} 

      <h3>Categorias Existentes</h3>
      {loading && categories.length === 0 && <p>Carregando categorias...</p>}
      
      <table className="admin-table"> {/* Add CSS class */} 
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Imagem URL</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.description?.substring(0, 50)}{category.description?.length > 50 ? '...' : ''}</td>
              <td>{category.image_url?.substring(0, 30)}{category.image_url?.length > 30 ? '...' : ''}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(category)} disabled={loading}>Editar</button> {/* Add CSS class */} 
                <button className="btn-delete" onClick={() => handleDelete(category.id)} disabled={loading}>Excluir</button> {/* Add CSS class */} 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!loading && categories.length === 0 && <p>Nenhuma categoria encontrada.</p>}
    </div>
  );
}

export default ManageCategoriesPage;

