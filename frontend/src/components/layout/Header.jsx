import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext'; // Import useCart
import './Header.css'; 
import logoImage from '/images/logo.png'; 

function Header() {
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart(); // Get cart item count function
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  // Update cart count whenever cartItems change (implicitly via getCartItemCount)
  useEffect(() => {
    // This effect now relies on the CartContext's internal state updates
    // We just call the function to get the current count
    setCartItemCount(getCartItemCount());
    // The dependency on getCartItemCount ensures this updates if the function reference changes,
    // but more importantly, the context provider re-renders components consuming it when cartItems change.
  }, [getCartItemCount]); // Dependency on the function itself

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate('/'); // Redirect to home after logout
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <div className="logo">
            <Link to="/" onClick={closeMobileMenu}>
              <img className="logo-img" src={logoImage} alt="NeoLayer3D Logo" />
              <span className="logo-text">NeoLayer3D</span>
            </Link>
          </div>
          <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'nav-active' : ''} onClick={closeMobileMenu} end>Início</NavLink></li>
            <li><NavLink to="/categorias" className={({ isActive }) => isActive ? 'nav-active' : ''} onClick={closeMobileMenu}>Categorias</NavLink></li>
            {/* Add other links like Sobre, Contato, Blog if pages exist */}
            {user && user.isAdmin && (
              <li><NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-active' : ''} onClick={closeMobileMenu}>Admin</NavLink></li>
            )}
            {/* Mobile only auth/user links */} 
            <li className="auth-links-mobile">
              {!user && <Link to="/login" className="btn btn-nav-action" onClick={closeMobileMenu}>Login</Link>}
              {!user && <Link to="/register" className="btn btn-nav-action" onClick={closeMobileMenu}>Registrar</Link>}
            </li>
             <li className="user-menu-mobile">
               {user && <span className="user-greeting">Olá, {user.name}!</span>}
               {user && <button onClick={handleLogout} className="btn-logout">Sair</button>}
             </li>
          </ul>
          <div className="nav-actions">
            {/* Search icon - implement functionality later */}
            
            <Link to="/carrinho" className="cart-icon" onClick={closeMobileMenu}>
              <i className="fas fa-shopping-cart"></i>
              {/* Use the state variable updated by the effect */}
              {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
            </Link>

            {user ? (
              <div className="user-menu">
                 <span className="user-greeting">Olá, {user.name}!</span> 
                 <button onClick={handleLogout} className="btn-logout">Sair</button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="btn btn-nav-action" onClick={closeMobileMenu}>Login</Link>
                <Link to="/register" className="btn btn-nav-action" onClick={closeMobileMenu}>Registrar</Link>
              </div>
            )}

            <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
              <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;

