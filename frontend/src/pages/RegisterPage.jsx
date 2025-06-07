import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import './AuthForm.css'; // Create and import CSS for styling

function RegisterPage() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

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

const result = await register({
  name,
  email,
  password,
  birth_date: birthDate,
  cpf_cnpj: cpfCnpj,
  phone,
  cep,
  street,
  number,
  complement,
  district,
  city,
  state
});


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


<div className="form-group">
  <label htmlFor="birthDate">Data de nascimento:</label>
  <input
    type="date"
    id="birthDate"
    value={birthDate}
    onChange={(e) => setBirthDate(e.target.value)}
    required
    disabled={loading}
  />
</div>

<div className="form-group">
  <label htmlFor="cpfCnpj">CPF/CNPJ:</label>
  <input
    type="text"
    id="cpfCnpj"
    value={cpfCnpj}
    onChange={(e) => setCpfCnpj(e.target.value)}
    required
    disabled={loading}
  />
</div>

<div className="form-group">
  <label htmlFor="phone">Telefone Celular:</label>
  <input
    type="tel"
    id="phone"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    required
    disabled={loading}
  />
</div>

<div className="form-group">
  <label htmlFor="cep">CEP:</label>
  <input
    type="text"
    id="cep"
    value={cep}
    onChange={(e) => setCep(e.target.value)}
    required
    disabled={loading}
  />
</div>

<div className="form-group">
  <label htmlFor="street">Logradouro:</label>
  <input
    type="text"
    id="street"
    value={street}
    onChange={(e) => setStreet(e.target.value)}
    required
    disabled={loading}
  />
</div>

<div className="form-group">
  <label htmlFor="number">Número:</label>
  <input
    type="text"
    id="number"
    value={number}
    onChange={(e) => setNumber(e.target.value)}
    required
    disabled={loading}
  />
</div>

<div className="form-group">
  <label htmlFor="complement">Complemento:</label>
  <input
    type="text"
    id="complement"
    value={complement}
    onChange={(e) => setComplement(e.target.value)}
    disabled={loading}
  />
</div>

<div className="form-group">
  <label htmlFor="district">Bairro:</label>
  <input
    type="text"
    id="district"
    value={district}
    onChange={(e) => setDistrict(e.target.value)}
    required
    disabled={loading}
  />
</div>

<div className="form-group">
  <label htmlFor="city">Cidade:</label>
  <input
    type="text"
    id="city"
    value={city}
    onChange={(e) => setCity(e.target.value)}
    required
    disabled={loading}
  />
</div>

<div className="form-group">
  <label htmlFor="state">Estado:</label>
  <input
    type="text"
    id="state"
    value={state}
    onChange={(e) => setState(e.target.value)}
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

