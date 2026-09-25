import React, { useState } from 'react';

import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const handleAuthSuccess = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleUpdateUser = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
  };

  if (!token) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} apiBaseUrl={API_BASE_URL} />;
  }

  return (
    <DashboardPage
      user={user}
      token={token}
      onLogout={handleLogout}
      onUpdateUser={handleUpdateUser}
      apiBaseUrl={API_BASE_URL}
    />
  );
}

export default App;