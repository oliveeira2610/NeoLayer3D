import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import './AuthForm.css'; // Create and import CSS for styling

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors

    const result = await login({ email, password });

    setLoading(false);
    if (result.success) {
      navigate('/'); // Redirect to home page or dashboard after successful login
    } 
    // Error state is handled by AuthContext and can be displayed
  };

  return (
    <div className="auth-page"> {/* Add CSS class for styling */} 
      <div className="auth-container"> {/* Add CSS class for styling */} 
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>} {/* Add CSS class */} 
          <div className="form-group"> {/* Add CSS class */} 
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group"> {/* Add CSS class */} 
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}> {/* Add CSS class */} 
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="auth-switch-link"> {/* Add CSS class */} 
          Não tem uma conta? <Link to="/register">Registre-se</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

