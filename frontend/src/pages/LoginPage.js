import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await API.post('/users/login', { email, password });
      localStorage.setItem('token', res.data.token); // save JWT token
      setMessage(res.data.message);
      setLoading(false);

      // Redirect to dashboard
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login to Your Account</h2>
      {message && <p className="message">{message}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="redirect-text">
        Don't have an account? <span onClick={() => navigate('/register')}>Register</span>
      </p>
    </div>
  );
};

export default LoginPage;
