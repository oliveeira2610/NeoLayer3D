import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginUser, registerUser } from '../services/api';
import { toast } from 'react-toastify'; // ✅ toast importado
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            localStorage.removeItem('authToken');
            setUser(null);
          } else {
            setUser({
              id: decoded.id,
              name: decoded.name,
              email: decoded.email,
              isAdmin: decoded.isAdmin || false
            });
          }
        } catch (err) {
          console.error("Erro ao decodificar token:", err);
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    setError(null);
    try {
      const response = await loginUser(credentials);
      const { token } = response.data;

      if (!token) throw new Error("Token não recebido do servidor.");

      localStorage.setItem('authToken', token);

      const decoded = jwtDecode(token);
      setUser({
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        isAdmin: decoded.isAdmin || false
      });

      toast.success('Login realizado com sucesso!'); // ✅ Toast de sucesso
      return { success: true };
    } catch (err) {
      console.error("Erro no login:", err);
      const errorMessage = err.response?.data?.message || 'Erro ao fazer login. Tente novamente.';
      setError(errorMessage);
      toast.error(errorMessage); // ✅ Toast de erro
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerUser(userData);
      toast.success(response.data.message || 'Registro realizado com sucesso!'); // ✅
      return { success: true, message: response.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || "Erro ao registrar.";
      toast.error(msg); // ✅
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    toast.info('Logout realizado.'); // ✅ Toast ao sair
  };

  const updateUserProfile = async (profileData) => {
    setError(null);
    try {
      // Aqui viria chamada de API real futuramente
      setUser(prevUser => ({
        ...prevUser,
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address
      }));

      toast.success('Perfil atualizado com sucesso!'); // ✅
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar perfil.';
      toast.error(errorMessage); // ✅
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
