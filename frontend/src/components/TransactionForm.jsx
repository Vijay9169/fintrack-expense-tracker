import React, { useState } from 'react';

function TransactionForm({ onAddTransaction }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    onAddTransaction({
      title,
      amount: Number(amount),
      type,
      category,
    });

    setTitle('');
    setAmount('');
  };

  return (
    <div className="glass-card">
      <h3 className="card-title">Add Transaction</h3>
      <form onSubmit={handleSubmit} className="custom-form">
        <div className="type-toggle">
          <button
            type="button"
            className={type === 'expense' ? 'active-expense' : ''}
            onClick={() => {
              setType('expense');
              setCategory('Food');
            }}
          >
            Expense
          </button>
          <button
            type="button"
            className={type === 'income' ? 'active-income' : ''}
            onClick={() => {
              setType('income');
              setCategory('Salary');
            }}
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
  );
}

export default TransactionForm;