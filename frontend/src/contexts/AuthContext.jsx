import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginUser, registerUser } from '../services/api';
import axios from 'axios';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verifica se há um token salvo e se ele é válido
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            // Token expirado
            localStorage.removeItem('authToken');
            setUser(null);
          } else {
            // Token válido
            setUser({
              id: decoded.id,
              name: decoded.name,
              email: decoded.email,
              isAdmin: decoded.isAdmin || false
            });
          }
        } catch (err) {
          // Token inválido
          console.error("Erro ao decodificar token:", err);
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Função para login
  const login = async (credentials) => {
  setError(null);
  try {
    const response = await loginUser(credentials);
    const { token } = response.data;

    if (!token) throw new Error("Token não recebido do servidor.");

    localStorage.setItem('authToken', token);

    const decoded = jwtDecode(token);
    console.log('Token decodificado:', decoded);

    setUser({
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      isAdmin: decoded.isAdmin || false
    });

    return { success: true };
  } catch (err) {
    console.error("Erro no login:", err);
    const errorMessage = err.response?.data?.message || 'Erro ao fazer login. Tente novamente.';
    setError(errorMessage);
    return { success: false, error: errorMessage };
  }
};


  // Função para registro
const register = async (userData) => {
  try {
    const response = await registerUser(userData);
    return { success: true, message: response.data.message };
  } catch (err) {
    console.error("Erro no registro:", err);
    setError(err.response?.data?.message || "Erro ao registrar.");
    return { success: false, error: err.response?.data?.message };
  }
};





  // Função para logout
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  // Função para atualizar o perfil do usuário
  const updateUserProfile = async (profileData) => {
    setError(null);
    try {
      // Implementar chamada à API para atualizar o perfil
      // const response = await updateProfile(user.id, profileData);
      
      // Atualiza o usuário no estado
      setUser(prevUser => ({
        ...prevUser,
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address
      }));
      
      return { success: true };
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar perfil. Tente novamente.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      setError,
      login, 
      register, 
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;

