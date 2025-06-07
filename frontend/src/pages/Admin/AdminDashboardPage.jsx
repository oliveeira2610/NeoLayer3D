import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboardPage.css';
import {
  getAdminProductStats,
  getAdminCategoryStats,
  getAdminUserStats,
  getRecentOrders
} from '../../../src/services/api'; // Ajuste o caminho conforme necessário


function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    recentOrders: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const [productsRes, categoriesRes, usersRes, ordersRes] = await Promise.all([
        getAdminProductStats(),
        getAdminCategoryStats(),
        getAdminUserStats(),
        getRecentOrders()
      ]);

      setStats({
        totalProducts: productsRes.data.total || 0,
        totalCategories: categoriesRes.data.total || 0,
        totalUsers: usersRes.data.total || 0,
        recentOrders: ordersRes.data || []
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, []);

  // Função para formatar valores monetários
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Função para formatar datas
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  // Função para determinar a classe CSS com base no status do pedido
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'entregue':
        return 'status-delivered';
      case 'enviado':
        return 'status-shipped';
      case 'em processamento':
        return 'status-processing';
      case 'aguardando pagamento':
        return 'status-pending';
      case 'cancelado':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  return (
    <div className="admin-dashboard-page">
      <h1 className="admin-page-title">Painel Administrativo</h1>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando dados do dashboard...</p>
        </div>
      ) : (
        <>
          {/* Estatísticas Rápidas */}
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-box-open"></i>
              </div>
              <div className="stat-info">
                <h3>Total de Produtos</h3>
                <p className="stat-value">{stats.totalProducts}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-tags"></i>
              </div>
              <div className="stat-info">
                <h3>Categorias</h3>
                <p className="stat-value">{stats.totalCategories}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-info">
                <h3>Usuários Registrados</h3>
                <p className="stat-value">{stats.totalUsers}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <div className="stat-info">
                <h3>Pedidos Recentes</h3>
                <p className="stat-value">{stats.recentOrders.length}</p>
              </div>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="quick-links">
            <h2 className="section-title">Gerenciamento</h2>
            <div className="dashboard-links">
              <Link to="/admin/produtos" className="dashboard-link-card">
                <div className="link-icon">
                  <i className="fas fa-box-open"></i>
                </div>
                <div className="link-content">
                  <h3>Gerenciar Produtos</h3>
                  <p>Adicionar, editar ou remover produtos da loja.</p>
                </div>
                <div className="link-arrow">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </Link>
              
              <Link to="/admin/categorias" className="dashboard-link-card">
                <div className="link-icon">
                  <i className="fas fa-tags"></i>
                </div>
                <div className="link-content">
                  <h3>Gerenciar Categorias</h3>
                  <p>Organizar produtos em categorias e subcategorias.</p>
                </div>
                <div className="link-arrow">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </Link>
              
              <Link to="/admin/usuarios" className="dashboard-link-card">
                <div className="link-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="link-content">
                  <h3>Gerenciar Usuários</h3>
                  <p>Visualizar e gerenciar contas de usuários.</p>
                </div>
                <div className="link-arrow">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </Link>
              
              <Link to="/admin/pedidos" className="dashboard-link-card">
                <div className="link-icon">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <div className="link-content">
                  <h3>Gerenciar Pedidos</h3>
                  <p>Visualizar e atualizar status de pedidos.</p>
                </div>
                <div className="link-arrow">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </Link>
            </div>
          </div>

          {/* Pedidos Recentes */}
          <div className="recent-orders">
            <h2 className="section-title">Pedidos Recentes</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Data</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{formatDate(order.date)}</td>
                      <td>{formatCurrency(order.total)}</td>
                      <td>
                        <span className={`order-status ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn-icon" title="Ver detalhes">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn-icon" title="Editar pedido">
                          <i className="fas fa-edit"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="view-all-link">
              <Link to="/admin/pedidos">Ver todos os pedidos <i className="fas fa-arrow-right"></i></Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboardPage;

