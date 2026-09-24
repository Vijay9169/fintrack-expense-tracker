import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import StatsOverview from '../components/StatsOverview';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import BudgetBar from '../components/BudgetBar';
import ExpenseChart from '../components/ExpenseChart';

function DashboardPage({ user, token, onLogout, apiBaseUrl }) {
  const [transactions, setTransactions] = useState([]);
  // Modal open/close state
  const [isChartOpen, setIsChartOpen] = useState(false);
  
  const [budget, setBudget] = useState(
    Number(localStorage.getItem(`budget_${user?.id}`)) || 10000
  );

  useEffect(() => {
    loadTransactions();
  }, [token]);

  const loadTransactions = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBudget = (newBudgetAmount) => {
    setBudget(newBudgetAmount);
    localStorage.setItem(`budget_${user?.id}`, newBudgetAmount);
  };

  const handleAddTransaction = async (formData) => {
    try {
      const res = await axios.post(`${apiBaseUrl}/transactions`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions([res.data, ...transactions]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
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

  return (
    <div className="app-layout">
      <Navbar user={user} onLogout={onLogout} />

      <main className="main-content">
        <StatsOverview balance={balanceTotal} income={incomeTotal} expense={expenseTotal} />

        {/* Budget Row + Analytics Button */}
        <div className="budget-wrapper-row">
          <div>
            <BudgetBar
              totalExpense={expenseTotal}
              budget={budget}
              onUpdateBudget={handleUpdateBudget}
            />
          </div>
          <button 
            type="button" 
            onClick={() => setIsChartOpen(true)} 
            className="btn-analytics"
          >
            📊 View Analytics
          </button>
        </div>

        {/* Main Grid */}
        <div className="dashboard-grid">
          <TransactionForm onAddTransaction={handleAddTransaction} />
          <TransactionList transactions={transactions} onDeleteTransaction={handleDeleteTransaction} />
        </div>

        {/* Modal Component */}
        <ExpenseChart
          transactions={transactions}
          isOpen={isChartOpen}
          onClose={() => setIsChartOpen(false)}
        />
      </main>
    </div>
  );
}

export default DashboardPage;