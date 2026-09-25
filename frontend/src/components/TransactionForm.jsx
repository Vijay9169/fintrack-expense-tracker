import React, { useState } from 'react';

function TransactionForm({ onAddTransaction }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false); // 👈 Loader state

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    // Double-click prevent karne ke liye check
    if (loading) return;

    setLoading(true); // Button lock aur spinner active
    try {
      await onAddTransaction({
        title,
        amount: Number(amount),
        type,
        category,
        notes,
        date: new Date(),
      });

      // Successful add hone ke baad hi form clear hoga
      setTitle('');
      setAmount('');
      setNotes('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // Request complete hone par button unlock
    }
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
          >
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
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading}
          style={{
            opacity: loading ? 0.75 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {loading ? (
            <>
              <span className="spinner-border"></span>
              Saving...
            </>
          ) : (
            'Save Transaction'
          )}
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;