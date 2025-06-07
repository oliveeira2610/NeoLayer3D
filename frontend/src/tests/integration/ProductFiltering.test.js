import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import CategoriesPage from '../../pages/CategoriesPage';
import { getAllProducts, getAllCategories } from '../../services/api';

// Mock do serviço de API
jest.mock('../../services/api', () => ({
  getAllProducts: jest.fn(),
  getAllCategories: jest.fn()
}));

describe('Integração de Filtros de Produtos', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock das categorias
    getAllCategories.mockResolvedValue({
      data: [
        { id: 1, name: 'Categoria 1' },
        { id: 2, name: 'Categoria 2' }
      ]
    });
    
    // Mock dos produtos
    getAllProducts.mockResolvedValue({
      data: [
        { id: 1, name: 'Produto 1', price: 100, category_id: 1 },
        { id: 2, name: 'Produto 2', price: 200, category_id: 2 }
      ]
    });
  });
  
  test('deve carregar produtos e categorias na inicialização', async () => {
    render(
      <BrowserRouter>
        <CategoriesPage />
      </BrowserRouter>
    );
    
    // Verifica se as chamadas de API foram feitas
    expect(getAllCategories).toHaveBeenCalled();
    expect(getAllProducts).toHaveBeenCalled();
    
    // Aguarda o carregamento dos produtos
    await waitFor(() => {
      expect(screen.getByText('Produto 1')).toBeInTheDocument();
      expect(screen.getByText('Produto 2')).toBeInTheDocument();
    });
    
    // Verifica se as categorias foram carregadas
    await waitFor(() => {
      expect(screen.getByText('Categoria 1')).toBeInTheDocument();
      expect(screen.getByText('Categoria 2')).toBeInTheDocument();
    });
  });
  
  test('deve filtrar produtos por categoria', async () => {
    // Mock para filtrar por categoria
    getAllProducts.mockImplementation((params) => {
      if (params && params.category === '1') {
        return Promise.resolve({
          data: [
            { id: 1, name: 'Produto 1', price: 100, category_id: 1 }
          ]
        });
      }
      return Promise.resolve({
        data: [
          { id: 1, name: 'Produto 1', price: 100, category_id: 1 },
          { id: 2, name: 'Produto 2', price: 200, category_id: 2 }
        ]
      });
    });
    
    render(
      <MemoryRouter initialEntries={['/categorias']}>
        <CategoriesPage />
      </MemoryRouter>
    );
    
    // Aguarda o carregamento inicial
    await waitFor(() => {
      expect(screen.getByText('Produto 1')).toBeInTheDocument();
      expect(screen.getByText('Produto 2')).toBeInTheDocument();
    });
    
    // Simula o clique em uma categoria
    const categoryLink = await waitFor(() => screen.getByText('Categoria 1'));
    fireEvent.click(categoryLink);
    
    // Verifica se a API foi chamada com o filtro de categoria
    await waitFor(() => {
      expect(getAllProducts).toHaveBeenCalledWith(expect.objectContaining({
        category: '1'
      }));
    });
    
    // Verifica se apenas o produto da categoria selecionada é exibido
    await waitFor(() => {
      expect(screen.getByText('Produto 1')).toBeInTheDocument();
      expect(screen.queryByText('Produto 2')).not.toBeInTheDocument();
    });
  });
  
  test('deve aplicar filtros de preço e busca', async () => {
    // Mock para filtrar por preço e busca
    getAllProducts.mockImplementation((params) => {
      if (params && params.priceMin === '150' && params.priceMax === '250') {
        return Promise.resolve({
          data: [
            { id: 2, name: 'Produto 2', price: 200, category_id: 2 }
          ]
        });
      }
      if (params && params.search === 'Produto 1') {
        return Promise.resolve({
          data: [
            { id: 1, name: 'Produto 1', price: 100, category_id: 1 }
          ]
        });
      }
      return Promise.resolve({
        data: [
          { id: 1, name: 'Produto 1', price: 100, category_id: 1 },
          { id: 2, name: 'Produto 2', price: 200, category_id: 2 }
        ]
      });
    });
    
    render(
      <MemoryRouter initialEntries={['/categorias']}>
        <CategoriesPage />
      </MemoryRouter>
    );
    
    // Aguarda o carregamento inicial
    await waitFor(() => {
      expect(screen.getByText('Produto 1')).toBeInTheDocument();
      expect(screen.getByText('Produto 2')).toBeInTheDocument();
    });
    
    // Simula a aplicação de filtros de preço
    const priceMinInput = screen.getByPlaceholderText('Min');
    const priceMaxInput = screen.getByPlaceholderText('Max');
    const applyButton = screen.getByText('Aplicar Filtros');
    
    fireEvent.change(priceMinInput, { target: { value: '150' } });
    fireEvent.change(priceMaxInput, { target: { value: '250' } });
    fireEvent.click(applyButton);
    
    // Verifica se a API foi chamada com os filtros de preço
    await waitFor(() => {
      expect(getAllProducts).toHaveBeenCalledWith(expect.objectContaining({
        priceMin: '150',
        priceMax: '250'
      }));
    });
    
    // Verifica se apenas o produto dentro da faixa de preço é exibido
    await waitFor(() => {
      expect(screen.queryByText('Produto 1')).not.toBeInTheDocument();
      expect(screen.getByText('Produto 2')).toBeInTheDocument();
    });
    
    // Simula a limpeza dos filtros
    const clearButton = screen.getByText('Limpar');
    fireEvent.click(clearButton);
    
    // Verifica se todos os produtos são exibidos novamente
    await waitFor(() => {
      expect(screen.getByText('Produto 1')).toBeInTheDocument();
      expect(screen.getByText('Produto 2')).toBeInTheDocument();
    });
    
    // Simula a busca por nome
    const searchInput = screen.getByPlaceholderText('Nome ou descrição');
    fireEvent.change(searchInput, { target: { value: 'Produto 1' } });
    fireEvent.click(applyButton);
    
    // Verifica se a API foi chamada com o filtro de busca
    await waitFor(() => {
      expect(getAllProducts).toHaveBeenCalledWith(expect.objectContaining({
        search: 'Produto 1'
      }));
    });
    
    // Verifica se apenas o produto correspondente à busca é exibido
    await waitFor(() => {
      expect(screen.getByText('Produto 1')).toBeInTheDocument();
      expect(screen.queryByText('Produto 2')).not.toBeInTheDocument();
    });
  });
});

