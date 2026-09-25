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
  const [selectedTx, setSelectedTx] = useState(null); // Details modal state

  const filteredTransactions = transactions.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesType = selectedType === 'All' || item.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return alert('No transactions to export.');
    const headers = ['Title,Type,Category,Amount,Date,Notes\n'];
    const rows = filteredTransactions.map((t) => {
      const formattedDate = new Date(t.date).toISOString().split('T')[0];
      return `"${t.title}",${t.type},${t.category},${t.amount},${formattedDate},"${t.notes || ''}"`;
    });
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `FinTrack_Statement_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (filteredTransactions.length === 0) return alert('No transactions to export.');
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

    const tableColumn = ['#', 'Title', 'Category', 'Type', 'Amount (INR)', 'Date', 'Notes'];
    const tableRows = filteredTransactions.map((t, idx) => [
      idx + 1,
      t.title,
      t.category,
      t.type.toUpperCase(),
      (t.type === 'income' ? '+ ' : '- ') + Number(t.amount).toLocaleString('en-IN'),
      new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      t.notes || '-',
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 46,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 3 },
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
          <button onClick={handleExportCSV} className="btn-export-csv" title="Export CSV">
            📥 CSV
          </button>
          <button onClick={handleExportPDF} className="btn-export-pdf" title="Export PDF">
            📄 PDF Statement
          </button>
        </div>
      </div>

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

      <div className="filter-toolbar">
        <input
          type="text"
          placeholder="🔍 Search title or notes..."
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
            <div
              key={item._id}
              className="tx-card"
              onClick={() => setSelectedTx(item)}
              style={{ cursor: 'pointer' }}
              title="Click to view details & note"
            >
              <div className="tx-info">
                <div className="tx-cat-badge">
                  {CATEGORY_ICONS[item.category] || '🏷️'}
                </div>
                <div className="tx-details">
                  <strong>
                    {item.title}
                    {item.notes && (
                      <span className="note-indicator-badge">📝 Note</span>
                    )}
                  </strong>
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
                  type="button"
                  className="btn-delete-icon"
                  title="Delete Transaction"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTransaction(item._id, item.title);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details & Notes Modal */}
      {selectedTx && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedTx(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
          }}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              width: '90%',
              maxWidth: '420px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Transaction Details</h3>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Title:</span>
                <strong>{selectedTx.title}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Type:</span>
                <strong style={{ color: selectedTx.type === 'income' ? '#10b981' : '#ef4444', textTransform: 'capitalize' }}>
                  {selectedTx.type}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Amount:</span>
                <strong>₹{selectedTx.amount.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Category:</span>
                <strong>{selectedTx.category}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Date:</span>
                <strong>{new Date(selectedTx.date).toLocaleString('en-IN')}</strong>
              </div>

              <div style={{ marginTop: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                <span style={{ color: '#64748b', display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                  📝 Note / Remark:
                </span>
                <p style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', color: '#1e293b', fontStyle: selectedTx.notes ? 'normal' : 'italic' }}>
                  {selectedTx.notes || 'No note attached to this entry.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionList;