import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import StatsOverview from '../components/StatsOverview';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import BudgetBar from '../components/BudgetBar';
import ExpenseChart from '../components/ExpenseChart';
import ProfileModal from '../components/ProfileModal';

function DashboardPage({ user, token, onLogout, onUpdateUser, apiBaseUrl }) {
  const [transactions, setTransactions] = useState([]);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('all'); // 'all', 'this_month', 'last_month'

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

  // Monthly Range Filtering
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const rangedTransactions = transactions.filter((t) => {
    if (timeRange === 'all') return true;
    const txDate = new Date(t.date);

    if (timeRange === 'this_month') {
      return (
        txDate.getFullYear() === currentYear &&
        txDate.getMonth() === currentMonth
      );
    }

    if (timeRange === 'last_month') {
      const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
      return (
        txDate.getFullYear() === lastMonthDate.getFullYear() &&
        txDate.getMonth() === lastMonthDate.getMonth()
      );
    }

    return true;
  });

  const incomeTotal = rangedTransactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expenseTotal = rangedTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balanceTotal = incomeTotal - expenseTotal;

  return (
    <div className="app-layout">
      <Navbar
        user={user}
        onLogout={onLogout}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <main className="main-content">
        <StatsOverview balance={balanceTotal} income={incomeTotal} expense={expenseTotal} />

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

        <div className="dashboard-grid">
          <TransactionForm onAddTransaction={handleAddTransaction} />
          <TransactionList
            transactions={rangedTransactions}
            onDeleteTransaction={handleDeleteTransaction}
            user={user}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        </div>

        <ExpenseChart
          transactions={rangedTransactions}
          isOpen={isChartOpen}
          onClose={() => setIsChartOpen(false)}
        />

        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={user}
          onUpdateUser={onUpdateUser}
          totalTransactions={transactions.length}
          apiBaseUrl={apiBaseUrl}
          token={token}
        />
      </main>
    </div>
  );
}

export default DashboardPage;