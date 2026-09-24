import React, { useState } from 'react';
import axios from 'axios';

function AuthPage({ onAuthSuccess, apiBaseUrl }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const endpoint = isLoginView ? '/auth/login' : '/auth/register';
    const payload = isLoginView
      ? { email: authEmail, password: authPassword }
      : { name: authName, email: authEmail, password: authPassword };

    try {
      const res = await axios.post(`${apiBaseUrl}${endpoint}`, payload);
      onAuthSuccess(res.data.token, res.data.user);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Authentication error');
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
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '6px' }}>
            {isLoginView ? 'Sign In' : 'Get Started'}
          </button>
        </form>

        <button
          className="auth-switch"
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