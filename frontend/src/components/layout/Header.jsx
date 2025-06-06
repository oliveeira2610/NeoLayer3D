import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import './Header.css';
import logoImage from '../../../public/images/logo.png';

function Header() {
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCartItemCount(getCartItemCount());
  }, [getCartItemCount]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  
  const handleLogout = () => {
    logout();
    closeMobileMenu();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  // Fecha o menu do usuário quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.nl3d-user-menu')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <header className="nl3d-header">
      <div className="nl3d-container">
        <nav className="nl3d-navbar">
          <div className="nl3d-logo">
            <Link className='nl3d-logo' to="/" onClick={closeMobileMenu}>
              <img className="nl3d-logo-img" src={logoImage} alt="NeoLayer3D Logo" />
              <span className="nl3d-logo-text">NeoLayer3D</span>
            </Link>
          </div>

          <ul className={`nl3d-nav-links ${isMobileMenuOpen ? 'nl3d-active' : ''}`}>
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'nl3d-nav-active' : ''} onClick={closeMobileMenu} end>Início</NavLink></li>
            <li><NavLink to="/categorias" className={({ isActive }) => isActive ? 'nl3d-nav-active' : ''} onClick={closeMobileMenu}>Categorias</NavLink></li>
            <li><NavLink to="/sobre" className={({ isActive }) => isActive ? 'nl3d-nav-active' : ''} onClick={closeMobileMenu}>Sobre Nós</NavLink></li>
            <li><NavLink to="/contato" className={({ isActive }) => isActive ? 'nl3d-nav-active' : ''} onClick={closeMobileMenu}>Contato</NavLink></li>
            <li><NavLink to="/blog" className={({ isActive }) => isActive ? 'nl3d-nav-active' : ''} onClick={closeMobileMenu}>Blog</NavLink></li>
            {user?.isAdmin && (
              <li><NavLink to="/admin" className={({ isActive }) => isActive ? 'nl3d-nav-active' : ''} onClick={closeMobileMenu}>Admin</NavLink></li>
            )}
            {!user && (
              <li className="nl3d-auth-links-mobile">
                <Link to="/login" className="nl3d-btn nl3d-btn-action" onClick={closeMobileMenu}>Login</Link>
                <Link to="/register" className="nl3d-btn nl3d-btn-action" onClick={closeMobileMenu}>Registrar</Link>
              </li>
            )}
            {user && (
              <li className="nl3d-user-menu-mobile">
                <span className="nl3d-user-greeting">Olá, {user.name}!</span>
                <Link to="/perfil" className="nl3d-btn nl3d-btn-action" onClick={closeMobileMenu}>Minha Conta</Link>
                <button onClick={handleLogout} className="nl3d-btn-logout">Sair</button>
              </li>
            )}
          </ul>

          <div className="nl3d-nav-actions">
            <Link to="/busca" className="nl3d-search-icon" onClick={closeMobileMenu}>
              <i className="fas fa-search"></i>
            </Link>
            <Link to="/carrinho" className="nl3d-cart-icon" onClick={closeMobileMenu}>
              <i className="fas fa-shopping-cart"></i>
              {cartItemCount > 0 && <span className="nl3d-cart-count">{cartItemCount}</span>}
            </Link>
            {user ? (
              <div className="nl3d-user-menu">
                <button 
                  className="nl3d-user-menu-button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleUserMenu();
                  }}
                >
                  <span className="nl3d-user-greeting">Olá, {user.name}!</span>
                  <i className={`fas fa-chevron-${isUserMenuOpen ? 'up' : 'down'}`}></i>
                </button>
                
                {isUserMenuOpen && (
                  <div className="nl3d-user-dropdown">
                    <Link to="/perfil" className="nl3d-dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                      <i className="fas fa-user"></i> Minha Conta
                    </Link>
                    <Link to="/perfil?tab=orders" className="nl3d-dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                      <i className="fas fa-shopping-bag"></i> Meus Pedidos
                    </Link>
                    {user.isAdmin && (
                      <Link to="/admin" className="nl3d-dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                        <i className="fas fa-cog"></i> Painel Admin
                      </Link>
                    )}
                    <button onClick={handleLogout} className="nl3d-dropdown-item nl3d-logout-item">
                      <i className="fas fa-sign-out-alt"></i> Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="nl3d-auth-links">
                <Link to="/login" className="nl3d-btn nl3d-btn-action" onClick={closeMobileMenu}>Login</Link>
                <Link to="/register" className="nl3d-btn nl3d-btn-action" onClick={closeMobileMenu}>Registrar</Link>
              </div>
            )}
            <button className="nl3d-mobile-menu-btn" onClick={toggleMobileMenu}>
              <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;

