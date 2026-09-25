import React, { useState } from 'react';
import axios from 'axios';

// Agar prop na mile ya env variable miss ho jaye, toh direct Render URL fallback rahega
const DEFAULT_API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://fintrack-expense-tracker.onrender.com/api';

function AuthPage({ onAuthSuccess, apiBaseUrl }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Clean baseURL ensure karein (trailing slash remove karke)
  const resolvedBaseUrl = (apiBaseUrl || DEFAULT_API_URL).replace(/\/$/, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (loading) return;

    // Backend route /api/auth/login ya /api/auth/register banega
    const endpoint = isLoginView ? '/auth/login' : '/auth/register';
    const payload = isLoginView
      ? { email: authEmail, password: authPassword }
      : { name: authName, email: authEmail, password: authPassword };

    setLoading(true);
    try {
      const res = await axios.post(`${resolvedBaseUrl}${endpoint}`, payload);
      onAuthSuccess(res.data.token, res.data.user);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand" style={{ justifyContent: 'center', marginBottom: '14px' }}>
            <div className="brand-icon">₹</div>
            <span>FinTrack</span>
          </div>
          <h2>{isLoginView ? 'Welcome Back' : 'Create an Account'}</h2>
          <p>
            {isLoginView
              ? 'Enter your credentials to access your dashboard'
              : 'Start managing your finances securely today'}
          </p>
        </div>

        {errorMessage && (
          <p style={{ color: '#ef4444', textAlign: 'center', fontSize: '13px', marginBottom: '12px' }}>
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {!isLoginView && (
            <input
              type="text"
              placeholder="Full Name"
              value={authName}
              onChange={(e) => setAuthName(e.target.value)}
              required
              disabled={loading}
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ 
              width: '100%', 
              marginTop: '6px',
              opacity: loading ? 0.75 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Please wait...' : (isLoginView ? 'Sign In' : 'Get Started')}
          </button>
        </form>

        <button
          className="auth-switch"
          disabled={loading}
          onClick={() => {
            setIsLoginView(!isLoginView);
            setErrorMessage('');
          }}
        >
          {isLoginView ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  );
}

export default AuthPage;