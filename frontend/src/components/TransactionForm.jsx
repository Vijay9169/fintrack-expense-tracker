import React, { useState } from 'react';

function TransactionForm({ onAddTransaction }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    onAddTransaction({
      title,
      amount: Number(amount),
      type,
      category,
      notes,
      date: new Date(),
    });

    setTitle('');
    setAmount('');
    setNotes('');
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
            placeholder="e.g. Swiggy order, Client advance"
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
                <option value="Salary">💰 Salary</option>
                <option value="Freelance">💻 Freelance</option>
                <option value="Investment">📈 Investment Return</option>
                <option value="Other">🏷️ Other Income</option>
              </>
            )}
          </select>
        </div>

        <div className="form-group">
          <label>Note / Remark (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Paid via UPI"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary">
          Save Transaction
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;