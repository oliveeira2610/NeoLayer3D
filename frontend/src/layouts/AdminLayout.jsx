import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../src/contexts/AuthContext';
// import './AdminLayout.css'; // Create CSS for admin layout styling

function AdminLayout() {
  const { user, loading } = useAuth();

  // Wait for auth loading to complete
  if (loading) {
    return <div>Carregando informações do usuário...</div>; // Or a spinner component
  }

  // Redirect if user is not logged in or not an admin
  if (!user || !user.isAdmin) {
    // Redirect to login page, preserving the intended destination
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h3>Admin NeoLayer3D</h3>
        </div>
        <nav className="admin-nav">
          <ul>
            <li><NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''} end><i className="fas fa-tachometer-alt"></i> Dashboard</NavLink></li>
            <li><NavLink to="/admin/categorias" className={({ isActive }) => isActive ? 'active' : ''}><i className="fas fa-tags"></i> Categorias</NavLink></li>
            <li><NavLink to="/admin/produtos" className={({ isActive }) => isActive ? 'active' : ''}><i className="fas fa-box-open"></i> Produtos</NavLink></li>
            {/* Add link to ManageUsersPage when implemented */}
            {/* <li><NavLink to="/admin/usuarios" className={({ isActive }) => isActive ? 'active' : ''}><i className="fas fa-users"></i> Usuários</NavLink></li> */}
            <li><NavLink to="/" ><i className="fas fa-home"></i> Voltar ao Site</NavLink></li>
          </ul>
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet /> {/* Nested admin routes render here */}
      </main>
    </div>
  );
}

export default AdminLayout;

