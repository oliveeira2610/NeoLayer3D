import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {jwtDecode }from 'jwt-decode'; // corrigido import default
import { getUserById, changePassword, updateUserProfile } from '../services/api';

import './UserProfilePage.css';

function UserProfilePage() {
  const { user, logout } = useAuth(); // removi updateUserProfile do contexto, vamos usar o serviço
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf_cnpj: '',
    birth_date: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carrega os dados do usuário ao montar o componente
  useEffect(() => {
    const token = localStorage.getItem('authToken'); 
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded?.id;
        if (!userId) {
          console.error('ID do usuário não encontrado no token.');
          return;
        }
        getUserById(userId)
          .then(response => {
            const data = response.data;
            setProfileData({
              name: data.name || '',
              email: data.email || '',
              phone: data.phone || '',
              cpf_cnpj: data.cpf_cnpj || '',
              birth_date: data.birth_date || '',
              cep: data.cep || '',
              street: data.street || '',
              number: data.number || '',
              complement: data.complement || '',
              district: data.district || '',
              city: data.city || '',
              state: data.state || '',
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            });
          })
          .catch(err => {
            console.error('Erro ao buscar usuário:', err);
          });
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
      }
    }
  }, []);

  // Histórico de pedidos (simulação)
  const fetchOrderHistory = async () => {
    setIsLoading(true);
    try {
      setOrderHistory([
        { id: 1, date: '2025-05-20', status: 'Entregue', total: 299.90, items: 3 },
        { id: 2, date: '2025-06-01', status: 'Em processamento', total: 149.50, items: 1 }
      ]);
    } catch (error) {
      setMessage({ type: 'error', text: 'Não foi possível carregar o histórico de pedidos.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrderHistory();
    }
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setMessage({ type: '', text: '' });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (!profileData.name.trim()) {
        setMessage({ type: 'error', text: 'O nome é obrigatório.' });
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Usuário não autenticado');

      const decoded = jwtDecode(token);
      const userId = decoded.id;

      // Prepara os dados que serão enviados (excluindo as senhas)
      const updateData = { ...profileData };
      delete updateData.currentPassword;
      delete updateData.newPassword;
      delete updateData.confirmPassword;

      await updateUserProfile(userId, updateData);

      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar o perfil. Tente novamente.' });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (!profileData.currentPassword) {
        setMessage({ type: 'error', text: 'A senha atual é obrigatória.' });
        setIsLoading(false);
        return;
      }
      if (profileData.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres.' });
        setIsLoading(false);
        return;
      }
      if (profileData.newPassword !== profileData.confirmPassword) {
        setMessage({ type: 'error', text: 'As senhas não coincidem.' });
        setIsLoading(false);
        return;
      }

      await changePassword(profileData.currentPassword, profileData.newPassword);

      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao alterar a senha. Verifique se a senha atual está correta.' });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="user-profile-page container">
        <div className="auth-redirect">
          <h2>Acesso Restrito</h2>
          <p>Você precisa estar logado para acessar esta página.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/login')}
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page container">
      <h1 className="page-title">Minha Conta</h1>

      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Perfil
        </button>
        <button 
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Meus Pedidos
        </button>
        <button 
          className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Segurança
        </button>
      </div>

      <div className="profile-content">
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Aba Perfil */}
        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="profile-header">
              <h2>Informações Pessoais</h2>
              {!isEditing ? (
                <button className="btn btn-outline" onClick={toggleEditMode}>Editar</button>
              ) : (
                <button className="btn btn-outline" onClick={toggleEditMode}>Cancelar</button>
              )}
            </div>

            {!isEditing ? (
              <div className="profile-info">
                <div className="info-group"><label>Nome:</label><p>{profileData.name}</p></div>
                <div className="info-group"><label>Email:</label><p>{profileData.email}</p></div>
                <div className="info-group"><label>Telefone:</label><p>{profileData.phone || 'Não informado'}</p></div>
                <div className="info-group"><label>CPF/CNPJ:</label><p>{profileData.cpf_cnpj || 'Não informado'}</p></div>
                <div className="info-group"><label>Data de Nascimento:</label><p>{profileData.birth_date || 'Não informada'}</p></div>
                <div className="info-group"><label>CEP:</label><p>{profileData.cep || 'Não informado'}</p></div>
                <div className="info-group">
                  <label>Endereço:</label>
                  <p>
                    {profileData.street}, {profileData.number} {profileData.complement && `- ${profileData.complement}`}<br />
                    {profileData.district} - {profileData.city}/{profileData.state}
                  </p>
                </div>
              </div>
            ) : isLoading ? (
              <p className="loading">Carregando...</p>
            ) : (
              <form onSubmit={handleSaveProfile} className="profile-form">
                {/* inputs para editar */}
                <div className="form-group">
                  <label htmlFor="name">Nome:</label>
                  <input type="text" id="name" name="name" value={profileData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" name="email" value={profileData.email} disabled />
                  <small>O email não pode ser alterado.</small>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Telefone:</label>
                  <input type="tel" id="phone" name="phone" value={profileData.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="cpf_cnpj">CPF/CNPJ:</label>
                  <input type="text" id="cpf_cnpj" name="cpf_cnpj" value={profileData.cpf_cnpj} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="birth_date">Data de Nascimento:</label>
                  <input type="date" id="birth_date" name="birth_date" value={profileData.birth_date} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="cep">CEP:</label>
                  <input type="text" id="cep" name="cep" value={profileData.cep} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="street">Rua:</label>
                  <input type="text" id="street" name="street" value={profileData.street} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="number">Número:</label>
                  <input type="text" id="number" name="number" value={profileData.number} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="complement">Complemento:</label>
                  <input type="text" id="complement" name="complement" value={profileData.complement} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="district">Bairro:</label>
                  <input type="text" id="district" name="district" value={profileData.district} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="city">Cidade:</label>
                  <input type="text" id="city" name="city" value={profileData.city} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="state">Estado:</label>
                  <input type="text" id="state" name="state" value={profileData.state} onChange={handleChange} />
                </div>

                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Aba Meus Pedidos */}
        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Histórico de Pedidos</h2>
            {isLoading ? (
              <p className="loading">Carregando pedidos...</p>
            ) : orderHistory.length === 0 ? (
              <p>Você não tem pedidos realizados.</p>
            ) : (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Itens</th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.date}</td>
                      <td>{order.status}</td>
                      <td>R$ {order.total.toFixed(2)}</td>
                      <td>{order.items}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Aba Segurança */}
        {activeTab === 'security' && (
          <div className="security-section">
            <h2>Alterar Senha</h2>
            <form onSubmit={handleChangePassword} className="password-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Senha Atual:</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={profileData.currentPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">Nova Senha:</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={profileData.newPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Nova Senha:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={profileData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Alterando...' : 'Alterar Senha'}
              </button>
            </form>
          </div>
        )}

        <div className="logout-section">
          <button className="btn btn-danger" onClick={handleLogout}>Sair</button>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
