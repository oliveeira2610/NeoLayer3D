import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AdminLayout.css';
import logoImage from '../../public/images/logo.png';

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [pageTitle, setPageTitle] = useState('Dashboard');
  
  // Atualiza o título da página com base na rota atual
  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/admin') {
      setPageTitle('Dashboard');
    } else if (path.includes('/admin/produtos')) {
      setPageTitle('Gerenciar Produtos');
    } else if (path.includes('/admin/categorias')) {
      setPageTitle('Gerenciar Categorias');
    } else if (path.includes('/admin/usuarios')) {
      setPageTitle('Gerenciar Usuários');
    } else if (path.includes('/admin/pedidos')) {
      setPageTitle('Gerenciar Pedidos');
    }
  }, [location]);

  // Função para alternar a expansão da barra lateral
  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Função para fazer logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Obtém as iniciais do nome do usuário para o avatar
  const getUserInitials = () => {
    if (!user || !user.name) return '?';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarExpanded ? 'expanded' : ''}`}>
        <div className="admin-sidebar-header">
          <NavLink to="/admin" className="admin-sidebar-logo">
            <img src={logoImage} alt="NeoLayer3D Logo" />
            <span className="admin-sidebar-logo-text">NeoLayer3D</span>
          </NavLink>
          <button className="admin-sidebar-toggle" onClick={toggleSidebar}>
            <i className={`fas fa-${sidebarExpanded ? 'chevron-left' : 'bars'}`}></i>
          </button>
        </div>
        
        <ul className="admin-nav">
          <li className="admin-nav-item">
            <NavLink to="/admin" className="admin-nav-link" end>
              <span className="admin-nav-icon"><i className="fas fa-tachometer-alt"></i></span>
              <span className="admin-nav-text">Dashboard</span>
            </NavLink>
          </li>
          <li className="admin-nav-item">
            <NavLink to="/admin/produtos" className="admin-nav-link">
              <span className="admin-nav-icon"><i className="fas fa-box-open"></i></span>
              <span className="admin-nav-text">Produtos</span>
            </NavLink>
          </li>
          <li className="admin-nav-item">
            <NavLink to="/admin/categorias" className="admin-nav-link">
              <span className="admin-nav-icon"><i className="fas fa-tags"></i></span>
              <span className="admin-nav-text">Categorias</span>
            </NavLink>
          </li>
          <li className="admin-nav-item">
            <NavLink to="/admin/pedidos" className="admin-nav-link">
              <span className="admin-nav-icon"><i className="fas fa-shopping-cart"></i></span>
              <span className="admin-nav-text">Pedidos</span>
            </NavLink>
          </li>
          <li className="admin-nav-item">
            <NavLink to="/admin/usuarios" className="admin-nav-link">
              <span className="admin-nav-icon"><i className="fas fa-users"></i></span>
              <span className="admin-nav-text">Usuários</span>
            </NavLink>
          </li>
          <li className="admin-nav-item">
            <NavLink to="/admin/configuracoes" className="admin-nav-link">
              <span className="admin-nav-icon"><i className="fas fa-cog"></i></span>
              <span className="admin-nav-text">Configurações</span>
            </NavLink>
          </li>
        </ul>
        
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {getUserInitials()}
            </div>
            <span className="admin-user-name">{user?.name}</span>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <span className="admin-logout-icon"><i className="fas fa-sign-out-alt"></i></span>
            <span>Sair</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="admin-content">
        <header className="admin-header">
          <h1 className="admin-header-title">{pageTitle}</h1>
          <div className="admin-header-actions">
            <button className="admin-header-btn" title="Notificações">
              <i className="fas fa-bell"></i>
            </button>
            <button className="admin-header-btn" title="Ajuda">
              <i className="fas fa-question-circle"></i>
            </button>
            <NavLink to="/" className="admin-header-btn" title="Ir para o site">
              <i className="fas fa-external-link-alt"></i>
            </NavLink>
          </div>
        </header>
        
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

