import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient, { loginUser, registerUser } from '../services/api';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Check if token is expired (optional but recommended)
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          console.log("Token expirado.");
          logout(); // Token expired, log out
        } else {
          setUser(decodedToken.user);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Erro ao decodificar token:", e);
        logout(); // Invalid token
      }
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, [token]);

  const login = async (credentials) => {
    setError(null);
    try {
      const response = await loginUser(credentials);
      const { token: newToken, user: loggedInUser } = response.data;
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(loggedInUser);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return { success: true, user: loggedInUser };
    } catch (err) {
      console.error("Erro no login:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Falha no login.');
      logout(); // Clear any potentially inconsistent state
      return { success: false, error: err.response?.data?.message || 'Falha no login.' };
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const response = await registerUser(userData);
      // Optionally log in the user directly after registration
      // await login({ email: userData.email, password: userData.password });
      return { success: true, message: response.data.message };
    } catch (err) {
      console.error("Erro no registro:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Falha no registro.');
      return { success: false, error: err.response?.data?.message || 'Falha no registro.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    delete apiClient.defaults.headers.common['Authorization'];
    setError(null); // Clear errors on logout
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

