import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
import { CartProvider } from './contexts/CartContext'; // Import CartProvider
import App from './App'; // Import the main App component
import './styles/global.css'; // Import global styles

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);

