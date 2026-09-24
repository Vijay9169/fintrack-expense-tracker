import React, { useState } from 'react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const filteredTransactions = transactions.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesType = selectedType === 'All' || item.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  // CSV Export Logic
  const handleExportCSV = () => {
    if (transactions.length === 0) {
      alert('No transactions to export.');
      return;
    }

    const headers = ['Title,Type,Category,Amount,Date\n'];
    const rows = filteredTransactions.map((t) => {
      const formattedDate = new Date(t.date).toISOString().split('T')[0];
      return `"${t.title}",${t.type},${t.category},${t.amount},${formattedDate}`;
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + headers.concat(rows).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinTrack_Statement_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-card">
      <div className="card-title">
        <div>
          <span>Transaction History</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginLeft: '10px' }}>
            {filteredTransactions.length} of {transactions.length} Records
          </span>
        </div>

        {/* 1-Click CSV Export Button */}
        <button onClick={handleExportCSV} className="btn-export-csv">
          📥 Export CSV
        </button>
      </div>

      <div className="filter-toolbar">
        <input
          type="text"
          placeholder="🔍 Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="filter-selects">
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="All">All Types</option>
            <option value="expense">Expense Only</option>
            <option value="income">Income Only</option>
          </select>

          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Shopping">Shopping</option>
            <option value="Travel">Travel</option>
            <option value="Bills">Bills</option>
            <option value="Salary">Salary</option>
            <option value="Freelance">Freelance</option>
            <option value="Investment">Investment</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🔍</div>
          <p>No transactions match your search or filter criteria.</p>
        </div>
      ) : (
        <div className="tx-list">
          {filteredTransactions.map((item) => (
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