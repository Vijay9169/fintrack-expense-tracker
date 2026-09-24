import React, { useState } from 'react';

function BudgetBar({ totalExpense, budget, onUpdateBudget }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(budget);

  const percentage = budget > 0 ? Math.min(Math.round((totalExpense / budget) * 100), 100) : 0;
  const isOverBudget = budget > 0 && totalExpense > budget;
  const isWarning = percentage >= 80 && !isOverBudget;

  const handleSave = (e) => {
    e.preventDefault();
    if (newBudget > 0) {
      onUpdateBudget(Number(newBudget));
      setIsEditing(false);
    }
  };

  let barColor = '#10b981'; // Green
  if (isWarning) barColor = '#f59e0b'; // Amber / Orange
  if (isOverBudget) barColor = '#ef4444'; // Red

  return (
    <div className="glass-card budget-card">
      <div className="budget-header">
        <div>
          <h4>Monthly Budget Tracker</h4>
          <p>
            Spent <strong>₹{totalExpense.toLocaleString('en-IN')}</strong> of{' '}
            <strong>₹{budget.toLocaleString('en-IN')}</strong> ({percentage}%)
          </p>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="budget-edit-form">
            <input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              placeholder="Enter Budget"
              autoFocus
            />
            <button type="submit" className="btn-small">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="btn-small-cancel">✕</button>
          </form>
        ) : (
          <button onClick={() => setIsEditing(true)} className="btn-edit-budget">
            ✏️ Set Budget
          </button>
        )}
      </div>

      {/* Progress Track */}
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: barColor,
          }}
        />
      </div>

      {/* Alert Warning Text */}
      {isOverBudget && (
        <div className="budget-alert-badge alert-danger">
          ⚠️ Alert: You have exceeded your monthly budget by ₹{(totalExpense - budget).toLocaleString('en-IN')}!
        </div>
      )}
      {isWarning && (
        <div className="budget-alert-badge alert-warning">
          ⚡ Warning: You have reached {percentage}% of your monthly limit!
        </div>
      )}
    </div>
  );
}

export default BudgetBar;