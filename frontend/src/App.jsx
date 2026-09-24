import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

const CATEGORY_ICONS = {
  Food: '🍔',
  Shopping: '🛍️',
  Travel: '🚕',
  Bills: '⚡',
  Salary: '💰',
  Freelance: '💻',
  Investment: '📈',
  Other: '🏷️',
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // Auth States
  const [isLoginView, setIsLoginView] = useState(true);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Transaction States
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');

  useEffect(() => {
    if (token) {
      loadTransactions();
    }
  }, [token]);

  const loadTransactions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const endpoint = isLoginView ? '/auth/login' : '/auth/register';
    const payload = isLoginView 
      ? { email: authEmail, password: authPassword }
      : { name: authName, email: authEmail, password: authPassword };

    try {
      const res = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Authentication error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setTransactions([]);
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    try {
      const res = await axios.post(
        `${API_BASE_URL}/transactions`,
        { title, amount: Number(amount), type, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions([res.data, ...transactions]);
      setTitle('');
      setAmount('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(transactions.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const incomeTotal = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expenseTotal = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balanceTotal = incomeTotal - expenseTotal;

  // View: Auth Screen
  if (!token) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <div className="brand" style={{ justifyContent: 'center', marginBottom: '14px' }}>
              <div className="brand-icon">₹</div>
              <span>FinTrack</span>
            </div>
            <h2>{isLoginView ? 'Welcome Back' : 'Create an Account'}</h2>
            <p>{isLoginView ? 'Enter your credentials to access your dashboard' : 'Start managing your finances securely today'}</p>
          </div>

          {errorMessage && (
            <p style={{ color: '#ef4444', textAlign: 'center', fontSize: '13px', marginBottom: '12px' }}>
              {errorMessage}
            </p>
          )}

          <form onSubmit={handleAuthSubmit}>
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

  // View: Dashboard
  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="brand">
            <div className="brand-icon">₹</div>
            <span>FinTrack</span>
          </div>

          <div className="user-nav">
            <div className="user-profile">
              <div className="avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
              <div>
                <strong style={{ fontSize: '14px', display: 'block' }}>{user?.name}</strong>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{user?.email}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Page Area */}
      <main className="main-content">
        {/* Top 3 Stat Cards */}
        <div className="stats-container">
          <div className="stat-box balance-box">
            <div className="stat-icon">💳</div>
            <div className="stat-details">
              <h5>Total Balance</h5>
              <h2 className="balance-value">₹{balanceTotal.toLocaleString('en-IN')}</h2>
            </div>
          </div>

          <div className="stat-box income-box">
            <div className="stat-icon">📈</div>
            <div className="stat-details">
              <h5>Total Income</h5>
              <h2 className="income-value">+ ₹{incomeTotal.toLocaleString('en-IN')}</h2>
            </div>
          </div>

          <div className="stat-box expense-box">
            <div className="stat-icon">📉</div>
            <div className="stat-details">
              <h5>Total Expense</h5>
              <h2 className="expense-value">- ₹{expenseTotal.toLocaleString('en-IN')}</h2>
            </div>
          </div>
        </div>

        {/* 2-Column Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Add Transaction Card */}
          <div className="glass-card">
            <h3 className="card-title">Add Transaction</h3>
            <form onSubmit={handleAddTransaction} className="custom-form">
              {/* Type Toggle Buttons */}
              <div className="type-toggle">
                <button
                  type="button"
                  className={type === 'expense' ? 'active-expense' : ''}
                  onClick={() => { setType('expense'); setCategory('Food'); }}
                >
                  Expense
                </button>
                <button
                  type="button"
                  className={type === 'income' ? 'active-income' : ''}
                  onClick={() => { setType('income'); setCategory('Salary'); }}
                >
                  Income
                </button>
              </div>

              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="e.g. Swiggy order, Monthly salary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {type === 'expense' ? (
                    <>
                      <option value="Food">🍔 Food & Dining</option>
                      <option value="Shopping">🛍️ Shopping</option>
                      <option value="Travel">🚕 Travel & Fuel</option>
                      <option value="Bills">⚡ Bills & Utilities</option>
                      <option value="Other">🏷️ Other</option>
                    </>
                  ) : (
                    <>
                      <option value="Salary">💰 Monthly Salary</option>
                      <option value="Freelance">💻 Freelancing</option>
                      <option value="Investment">📈 Investments</option>
                      <option value="Other">🏷️ Other</option>
                    </>
                  )}
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                Save Transaction
              </button>
            </form>
          </div>

          {/* History Feed */}
          <div className="glass-card">
            <div className="card-title">
              <span>Transaction History</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                {transactions.length} Records
              </span>
            </div>

            {transactions.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>📂</div>
                <p>No transactions yet. Add your first expense or income on the left!</p>
              </div>
            ) : (
              <div className="tx-list">
                {transactions.map((item) => (
                  <div key={item._id} className="tx-card">
                    <div className="tx-info">
                      <div className="tx-cat-badge">
                        {CATEGORY_ICONS[item.category] || '🏷️'}
                      </div>
                      <div className="tx-details">
                        <strong>{item.title}</strong>
                        <span>{item.category} • {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>
                    <div className="tx-right">
                      <span className={`tx-amount ${item.type}`}>
                        {item.type === 'income' ? '+' : '-'} ₹{item.amount.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => handleDeleteTransaction(item._id)}
                        className="btn-delete"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;