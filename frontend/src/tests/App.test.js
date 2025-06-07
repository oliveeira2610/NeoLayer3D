import { render, screen } from '@testing-library/react';
import App from '../App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';

// Mock dos componentes para evitar erros de renderização
jest.mock('../layouts/MainLayout', () => {
  return {
    __esModule: true,
    default: ({ children }) => <div data-testid="main-layout">{children}</div>,
  };
});

jest.mock('../pages/HomePage', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="home-page">Home Page</div>,
  };
});

test('renderiza o App sem erros', () => {
  render(
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  );
  
  // Verifica se o componente foi renderizado sem erros
  expect(document.body).toBeTruthy();
});

test('renderiza o layout principal', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
  
  // Verifica se o layout principal foi renderizado
  const mainLayout = screen.getByTestId('main-layout');
  expect(mainLayout).toBeInTheDocument();
});

