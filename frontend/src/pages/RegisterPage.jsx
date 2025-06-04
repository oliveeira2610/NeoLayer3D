import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import './AuthForm.css'; // Create and import CSS for styling

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null); // Specific form errors like password mismatch
  const { register, error: apiError, setError: setApiError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null); // Clear previous form errors
    setApiError(null); // Clear previous API errors

    if (password !== confirmPassword) {
      setFormError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
        setFormError('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    setLoading(true);

    const result = await register({ name, email, password });

    setLoading(false);
    if (result.success) {
      // Optionally display success message before redirecting
      alert(result.message || 'Registro bem-sucedido! Faça o login.'); // Simple alert, replace with better UI
      navigate('/login'); // Redirect to login page after successful registration
    } else {
        // API error is handled by AuthContext, but we can also set formError if needed
        setFormError(result.error || 'Ocorreu um erro no registro.');
    }
  };

  return (
    <div className="auth-page"> {/* Add CSS class */} 
      <div className="auth-container"> {/* Add CSS class */} 
        <h2>Registrar</h2>
        <form onSubmit={handleSubmit}>
          {(formError || apiError) && <p className="error-message">{formError || apiError}</p>} {/* Add CSS class */} 
          <div className="form-group"> {/* Add CSS class */} 
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
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
              minLength="6"
              disabled={loading}
            />
          </div>
          <div className="form-group"> {/* Add CSS class */} 
            <label htmlFor="confirmPassword">Confirmar Senha:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
              disabled={loading}
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}> {/* Add CSS class */} 
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
        <p className="auth-switch-link"> {/* Add CSS class */} 
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

