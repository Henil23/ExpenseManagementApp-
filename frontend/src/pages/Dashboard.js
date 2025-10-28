// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import DashboardCharts from '../components/DashboardCharts';
import MonthlyGoalForm from '../components/MonthlyGoalForm';
import './Dashboard.css';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [monthlyGoal, setMonthlyGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all dashboard data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [expenseRes, categoryRes, goalRes] = await Promise.all([
        API.get('/expenses'),
        API.get('/categories'),
        API.get('/monthlyGoal'),
      ]);

      setExpenses(expenseRes.data);
      setCategories(categoryRes.data);
      setMonthlyGoal(goalRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h1>Welcome to Your Expense Dashboard</h1>

      {/* Monthly Goal Form */}
      <MonthlyGoalForm
        monthlyGoal={monthlyGoal}
        onUpdate={fetchData}
      />

      {/* Allowance & Savings Info */}
      {monthlyGoal && (
        <div className="allowance-info">
          <p><strong>Total Expenses:</strong> ${monthlyGoal.totalExpenses}</p>
          <p><strong>Remaining Allowance:</strong> ${monthlyGoal.remainingAllowance}</p>
          <p><strong>Weekly Allowance:</strong> ${monthlyGoal.weeklyAllowance}</p>
          <p><strong>Predicted Savings (6 months):</strong> ${monthlyGoal.predictedSavingsAfterExpenses}</p>
        </div>
      )}

      {/* Add New Expense */}
      <ExpenseForm
        categories={categories}
        onAdd={fetchData}
      />

      {/* Expense List */}
      <ExpenseList
        expenses={expenses}
        onUpdate={fetchData}
      />

      {/* Charts */}
      <DashboardCharts
        expenses={expenses}
        categories={categories}
      />
    </div>
  );
};

export default Dashboard;
