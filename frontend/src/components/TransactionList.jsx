import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

function TransactionList({
  transactions,
  onDeleteTransaction,
  user,
  timeRange,
  setTimeRange,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Filter Logic: Search + Category + Type
  const filteredTransactions = transactions.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesType = selectedType === 'All' || item.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  // CSV Export
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
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

  // PDF Export
  const handleExportPDF = () => {
    if (filteredTransactions.length === 0) {
      alert('No transactions to export.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229);
    doc.text('FinTrack Account Statement', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`, 14, 28);
    if (user?.name) {
      doc.text(`Account Holder: ${user.name} (${user.email || ''})`, 14, 34);
    }
    doc.text(`Filter Period: ${timeRange.toUpperCase()}`, 14, 40);

    const tableColumn = ['#', 'Title', 'Category', 'Type', 'Amount (INR)', 'Date'];
    const tableRows = filteredTransactions.map((t, idx) => [
      idx + 1,
      t.title,
      t.category,
      t.type.toUpperCase(),
      (t.type === 'income' ? '+ ' : '- ') + Number(t.amount).toLocaleString('en-IN'),
      new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 46,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 4 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    doc.save(`FinTrack_Statement_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="glass-card">
      <div className="card-title" style={{ flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span>Transaction History</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginLeft: '8px' }}>
            {filteredTransactions.length} of {transactions.length} Records
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleExportCSV} className="btn-export-csv" title="Export to CSV">
            📥 CSV
          </button>
          <button onClick={handleExportPDF} className="btn-export-pdf" title="Download PDF">
            📄 PDF Statement
          </button>
        </div>
      </div>

      {/* Quick Month Switcher Toolbar */}
      <div className="range-filter-row">
        <button
          type="button"
          className={`range-pill ${timeRange === 'all' ? 'active' : ''}`}
          onClick={() => setTimeRange('all')}
        >
          All Time
        </button>
        <button
          type="button"
          className={`range-pill ${timeRange === 'this_month' ? 'active' : ''}`}
          onClick={() => setTimeRange('this_month')}
        >
          This Month
        </button>
        <button
          type="button"
          className={`range-pill ${timeRange === 'last_month' ? 'active' : ''}`}
          onClick={() => setTimeRange('last_month')}
        >
          Last Month
        </button>
      </div>

      {/* Filter Toolbar */}
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
          <p>No transactions found for the selected period or filters.</p>
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