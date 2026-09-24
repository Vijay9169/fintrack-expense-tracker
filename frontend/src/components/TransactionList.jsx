import React from 'react';

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

function TransactionList({ transactions, onDeleteTransaction }) {
  return (
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
                  <span>
                    {item.category} • {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
              <div className="tx-right">
                <span className={`tx-amount ${item.type}`}>
                  {item.type === 'income' ? '+' : '-'} ₹{item.amount.toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => onDeleteTransaction(item._id)}
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
  );
}

export default TransactionList;