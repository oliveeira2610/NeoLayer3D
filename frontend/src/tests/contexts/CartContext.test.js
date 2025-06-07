import { render, screen, fireEvent, act } from '@testing-library/react';
import { CartProvider, useCart } from '../../contexts/CartContext';

// Componente de teste para acessar o contexto
const TestComponent = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemCount } = useCart();
  
  return (
    <div>
      <div data-testid="cart-count">{getCartItemCount()}</div>
      <div data-testid="cart-total">{getCartTotal()}</div>
      <button 
        data-testid="add-item" 
        onClick={() => addToCart({ id: 1, name: 'Produto Teste', price: 50 })}
      >
        Adicionar Item
      </button>
      <button 
        data-testid="update-quantity" 
        onClick={() => updateQuantity(1, 3)}
      >
        Atualizar Quantidade
      </button>
      <button 
        data-testid="remove-item" 
        onClick={() => removeFromCart(1)}
      >
        Remover Item
      </button>
      <button 
        data-testid="clear-cart" 
        onClick={() => clearCart()}
      >
        Limpar Carrinho
      </button>
      <ul>
        {cart.map(item => (
          <li key={item.id} data-testid={`cart-item-${item.id}`}>
            {item.name} - Qtd: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    // Limpa o localStorage antes de cada teste
    localStorage.clear();
  });
  
  test('inicia com o carrinho vazio', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
    expect(screen.getByTestId('cart-total').textContent).toBe('0');
    expect(screen.queryByTestId('cart-item-1')).not.toBeInTheDocument();
  });
  
  test('adiciona um item ao carrinho', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    fireEvent.click(screen.getByTestId('add-item'));
    
    expect(screen.getByTestId('cart-count').textContent).toBe('1');
    expect(screen.getByTestId('cart-total').textContent).toBe('50');
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('cart-item-1').textContent).toContain('Produto Teste - Qtd: 1');
  });
  
  test('atualiza a quantidade de um item no carrinho', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    // Adiciona um item ao carrinho
    fireEvent.click(screen.getByTestId('add-item'));
    
    // Atualiza a quantidade para 3
    fireEvent.click(screen.getByTestId('update-quantity'));
    
    expect(screen.getByTestId('cart-count').textContent).toBe('3');
    expect(screen.getByTestId('cart-total').textContent).toBe('150');
    expect(screen.getByTestId('cart-item-1').textContent).toContain('Produto Teste - Qtd: 3');
  });
  
  test('remove um item do carrinho', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    // Adiciona um item ao carrinho
    fireEvent.click(screen.getByTestId('add-item'));
    
    // Verifica se o item foi adicionado
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    
    // Remove o item do carrinho
    fireEvent.click(screen.getByTestId('remove-item'));
    
    // Verifica se o item foi removido
    expect(screen.queryByTestId('cart-item-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
    expect(screen.getByTestId('cart-total').textContent).toBe('0');
  });
  
  test('limpa o carrinho', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    // Adiciona um item ao carrinho
    fireEvent.click(screen.getByTestId('add-item'));
    
    // Verifica se o item foi adicionado
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    
    // Limpa o carrinho
    fireEvent.click(screen.getByTestId('clear-cart'));
    
    // Verifica se o carrinho está vazio
    expect(screen.queryByTestId('cart-item-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
    expect(screen.getByTestId('cart-total').textContent).toBe('0');
  });
  
  test('persiste o carrinho no localStorage', () => {
    const { unmount } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    // Adiciona um item ao carrinho
    fireEvent.click(screen.getByTestId('add-item'));
    
    // Desmonta o componente
    unmount();
    
    // Verifica se o carrinho foi salvo no localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    expect(savedCart).toHaveLength(1);
    expect(savedCart[0].id).toBe(1);
    expect(savedCart[0].name).toBe('Produto Teste');
    expect(savedCart[0].quantity).toBe(1);
    
    // Renderiza novamente para verificar se o carrinho é carregado do localStorage
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    // Verifica se o carrinho foi carregado corretamente
    expect(screen.getByTestId('cart-count').textContent).toBe('1');
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
  });
});

