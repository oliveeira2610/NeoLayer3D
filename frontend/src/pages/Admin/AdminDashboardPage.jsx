import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboardPage.css'; // Create CSS if needed

function AdminDashboardPage() {
  return (
    <div className="admin-dashboard-page">
      <h2>Painel Administrativo</h2>
      <p>Bem-vindo à área de administração da NeoLayer3D.</p>
      <div className="dashboard-links">
        <Link to="/admin/categorias" className="dashboard-link-card">
          <i className="fas fa-tags"></i>
          <h3>Gerenciar Categorias</h3>
          <p>Adicionar, editar ou remover categorias de produtos.</p>
        </Link>
        <Link to="/admin/produtos" className="dashboard-link-card">
          <i className="fas fa-box-open"></i>
          <h3>Gerenciar Produtos</h3>
          <p>Adicionar, editar ou remover produtos.</p>
        </Link>
        {/* Add link to ManageUsersPage when implemented */}
        {/* 
        <Link to="/admin/usuarios" className="dashboard-link-card">
          <i className="fas fa-users"></i>
          <h3>Gerenciar Usuários</h3>
          <p>Visualizar e gerenciar contas de usuários.</p>
        </Link>
        */}
      </div>
    </div>
  );
}

export default AdminDashboardPage;

