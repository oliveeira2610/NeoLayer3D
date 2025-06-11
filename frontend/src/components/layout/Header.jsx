import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import './Header.css';
import logoImage from '../../../public/images/logo.png';
import { PersonCircle } from "react-bootstrap-icons";

function Header() {
  const { user, logout } = useAuth();
  const { cart, getCartItemCount } = useCart();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  setCartItemCount(getCartItemCount());
}, [cart]);;

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
        <div className="nl3d-logo">
            <Link className='nl3d-logo' to="/" onClick={closeMobileMenu}>
              <img className="nl3d-logo-img" src={logoImage} alt="NeoLayer3D Logo" />
              <span className="nl3d-logo-text">NeoLayer3D</span>
            </Link>
          </div>

        <nav className="nl3d-navbar">
          <ul className={`nl3d-nav-links ${isMobileMenuOpen ? 'nl3d-active' : ''}`}>
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'nl3d-nav-active' : ''} onClick={closeMobileMenu} end>Início</NavLink></li>
            <li><NavLink to="/categorias" className={({ isActive }) => isActive ? 'nl3d-nav-active' : ''} onClick={closeMobileMenu}>Categorias</NavLink></li>
            <li><NavLink to="/sobre" className={({ isActive }) => isActive ? 'nl3d-nav-active' : ''} onClick={closeMobileMenu}>Sobre Nós</NavLink></li>
            <li><NavLink to="/contato" className={({ isActive }) => isActive ? 'nl3d-nav-active' : ''} onClick={closeMobileMenu}>Contato</NavLink></li>
            <li><NavLink to="/carrinho" className={({ isActive }) => isActive ? 'nl3d-nav-active' : ''} onClick={closeMobileMenu}>Carrinho ({cartItemCount})</NavLink></li>
            {user?.isAdmin && (
              <li><NavLink to="/admin" className={({ isActive }) => isActive ? 'nl3d-nav-active' : ''} onClick={closeMobileMenu}>Admin</NavLink></li>
            )}
          </ul>
          
          
        </nav>
        <div className="nl3d-login">
          {user ? (
            <div className="nl3d-user-menu">
              <Link to="/perfil"  className="nl3d-user-name">
              <PersonCircle  className='nl3d-user' />
              Seu Perfil 
              </Link>      
            </div>
          ) : (
            <Link to="/login" className="nl3d-loginLink">
              Olá, faça Login ou Cadastre-se
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}

export default Header;

