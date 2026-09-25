import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import StatsOverview from '../components/StatsOverview';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import BudgetBar from '../components/BudgetBar';
import ExpenseChart from '../components/ExpenseChart';
import ProfileModal from '../components/ProfileModal';

// Top-Right Toast Notification Configuration
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

function DashboardPage({
  user,
  token,
  onLogout,
  onUpdateUser,
  apiBaseUrl,
  theme,
  toggleTheme
}) {
  const [transactions, setTransactions] = useState([]);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('all'); // 'all', 'this_month', 'last_month'

  const [budget, setBudget] = useState(
    Number(localStorage.getItem(`budget_${user?.id}`)) || 10000
  );

  // Clean base URL bana lijiye:
  const cleanBase = (apiBaseUrl || 'https://fintrack-expense-tracker-2cis.onrender.com/api')
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '');

  useEffect(() => {
    loadTransactions();
  }, [token]);

  const loadTransactions = async () => {
    try {
      const res = await axios.get(`${cleanBase}/api/transactions`, {
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

  // ✅ Add Transaction with Success Toast
  const handleAddTransaction = async (formData) => {
    try {
      const res = await axios.post(`${cleanBase}/api/transactions`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions([res.data, ...transactions]);

      Toast.fire({
        icon: 'success',
        title: 'Transaction created successfully!'
      });
    } catch (err) {
      console.error(err);
      Toast.fire({
        icon: 'error',
        title: 'Failed to create transaction'
      });
    }
  };

  // ⚠️ Delete Confirmation Dialog + Cancelled + Success Toast
  const handleDeleteTransaction = async (id, title) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete "${title || 'this transaction'}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#0284c7',
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'No, keep it',
      reverseButtons: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${cleanBase}/api/transactions/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTransactions((prev) => prev.filter((item) => item._id !== id));

          Toast.fire({
            icon: 'success',
            title: 'Transaction deleted successfully!'
          });
        } catch (err) {
          console.error(err);
          Toast.fire({
            icon: 'error',
            title: 'Failed to delete transaction'
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Your records are safe :)',
          icon: 'error',
          confirmButtonColor: '#0284c7',
          confirmButtonText: 'OK'
        });
      }
    });
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
        theme={theme}
        toggleTheme={toggleTheme}
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