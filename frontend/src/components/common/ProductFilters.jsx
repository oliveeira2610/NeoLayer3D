import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './ProductFilters.css';

function ProductFilters({ onFilterChange }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    sortBy: searchParams.get('sortBy') || 'newest'
  });

  // Opções de ordenação
  const sortOptions = [
    { value: 'newest', label: 'Mais Recentes' },
    { value: 'oldest', label: 'Mais Antigos' },
    { value: 'price_asc', label: 'Menor Preço' },
    { value: 'price_desc', label: 'Maior Preço' },
    { value: 'name_asc', label: 'Nome (A-Z)' },
    { value: 'name_desc', label: 'Nome (Z-A)' }
  ];

  // Atualiza os filtros quando os parâmetros da URL mudam
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      priceMin: searchParams.get('priceMin') || '',
      priceMax: searchParams.get('priceMax') || '',
      sortBy: searchParams.get('sortBy') || 'newest'
    });
  }, [searchParams]);

  // Manipula mudanças nos campos de filtro
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Aplica os filtros
  const applyFilters = (e) => {
    e.preventDefault();
    
    // Cria um novo objeto de parâmetros a partir dos filtros atuais
    const newParams = {};
    
    // Adiciona o ID da categoria se existir
    const categoryId = searchParams.get('id');
    if (categoryId) {
      newParams.id = categoryId;
    }
    
    // Adiciona os demais filtros se tiverem valores
    if (filters.search) newParams.search = filters.search;
    if (filters.priceMin) newParams.priceMin = filters.priceMin;
    if (filters.priceMax) newParams.priceMax = filters.priceMax;
    if (filters.sortBy) newParams.sortBy = filters.sortBy;
    
    // Atualiza os parâmetros da URL
    setSearchParams(newParams);
    
    // Notifica o componente pai sobre a mudança nos filtros
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  // Limpa todos os filtros
  const clearFilters = () => {
    // Mantém apenas o ID da categoria se existir
    const newParams = {};
    const categoryId = searchParams.get('id');
    if (categoryId) {
      newParams.id = categoryId;
    }
    
    setSearchParams(newParams);
    
    setFilters({
      search: '',
      priceMin: '',
      priceMax: '',
      sortBy: 'newest'
    });
    
    if (onFilterChange) {
      onFilterChange({
        search: '',
        priceMin: '',
        priceMax: '',
        sortBy: 'newest'
      });
    }
  };

  return (
    <div className="product-filters">
      <h3>Filtros</h3>
      <form onSubmit={applyFilters}>
        <div className="filter-group">
          <label htmlFor="search">Buscar:</label>
          <input
            type="text"
            id="search"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Nome ou descrição"
          />
        </div>
        
        <div className="filter-group price-range">
          <label>Faixa de Preço:</label>
          <div className="price-inputs">
            <input
              type="number"
              name="priceMin"
              value={filters.priceMin}
              onChange={handleFilterChange}
              placeholder="Min"
              min="0"
            />
            <span>até</span>
            <input
              type="number"
              name="priceMax"
              value={filters.priceMax}
              onChange={handleFilterChange}
              placeholder="Max"
              min="0"
            />
          </div>
        </div>
        
        <div className="filter-group">
          <label htmlFor="sortBy">Ordenar por:</label>
          <select
            id="sortBy"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-actions">
          <button type="submit" className="btn btn-primary">
            Aplicar Filtros
          </button>
          <button type="button" className="btn btn-outline" onClick={clearFilters}>
            Limpar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductFilters;

