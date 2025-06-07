import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../../components/common/ProductCard';
import { CartProvider } from '../../contexts/CartContext';

// Mock do produto para testes
const mockProduct = {
  id: 1,
  name: 'Produto Teste',
  price: 99.90,
  image_url: '/images/product-test.jpg',
  category_name: 'Categoria Teste'
};

// Wrapper para prover o contexto necessário
const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <CartProvider>
        {ui}
      </CartProvider>
    </BrowserRouter>
  );
};

describe('ProductCard Component', () => {
  test('renderiza o card do produto com as informações corretas', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    // Verifica se o nome do produto está presente
    expect(screen.getByText('Produto Teste')).toBeInTheDocument();
    
    // Verifica se o preço está formatado corretamente
    expect(screen.getByText('R$ 99,90')).toBeInTheDocument();
    
    // Verifica se a categoria está presente
    expect(screen.getByText('Categoria Teste')).toBeInTheDocument();
    
    // Verifica se a imagem está presente
    const productImage = screen.getByAltText('Produto Teste');
    expect(productImage).toBeInTheDocument();
    expect(productImage).toHaveAttribute('src', '/images/product-test.jpg');
  });
  
  test('navega para a página de detalhes ao clicar no card', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    // Verifica se o link para a página de detalhes está correto
    const productLink = screen.getByRole('link');
    expect(productLink).toHaveAttribute('href', '/produto/1');
  });
  
  test('adiciona o produto ao carrinho ao clicar no botão', () => {
    // Mock da função de adicionar ao carrinho
    const addToCartMock = jest.fn();
    
    // Renderiza o componente com o mock
    renderWithProviders(
      <ProductCard 
        product={mockProduct} 
        addToCart={addToCartMock} 
      />
    );
    
    // Encontra o botão de adicionar ao carrinho
    const addToCartButton = screen.getByText('Adicionar ao Carrinho');
    
    // Simula o clique no botão
    fireEvent.click(addToCartButton);
    
    // Verifica se a função foi chamada com o produto correto
    expect(addToCartMock).toHaveBeenCalledWith(mockProduct);
  });
});

