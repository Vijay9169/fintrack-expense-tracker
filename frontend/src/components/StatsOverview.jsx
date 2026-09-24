import React from 'react';

function StatsOverview({ balance, income, expense }) {
  return (
    <div className="stats-container">
      <div className="stat-box balance-box">
        <div className="stat-icon">💳</div>
        <div className="stat-details">
          <h5>Total Balance</h5>
          <h2 className="balance-value">₹{balance.toLocaleString('en-IN')}</h2>
        </div>
      </div>

      <div className="stat-box income-box">
        <div className="stat-icon">📈</div>
        <div className="stat-details">
          <h5>Total Income</h5>
          <h2 className="income-value">+ ₹{income.toLocaleString('en-IN')}</h2>
        </div>
      </div>

      <div className="stat-box expense-box">
        <div className="stat-icon">📉</div>
        <div className="stat-details">
          <h5>Total Expense</h5>
          <h2 className="expense-value">- ₹{expense.toLocaleString('en-IN')}</h2>
        </div>
      </div>
    </div>
  );
}

export default StatsOverview;