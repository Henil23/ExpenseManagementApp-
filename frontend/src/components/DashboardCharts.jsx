import React, { useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import './DashboardCharts.css';

const COLORS = ['#0077ff', '#ff3b30', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4'];

const DashboardCharts = ({ expenses = [], categories = [] }) => {

  // --- Prepare category data for PieChart ---
  const categoryData = useMemo(() => {
    const data = {};

    expenses.forEach(exp => {
      const catName =
        categories.find(cat => cat._id === exp.category)?.name || 'Uncategorized';
      data[catName] = (data[catName] || 0) + exp.totalAmount;
    });

    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [expenses, categories]);

  // --- Prepare expense trend for LineChart ---
  const monthlyData = useMemo(() => {
    const map = {};
    expenses.forEach(exp => {
      const date = new Date(exp.createdAt);
      const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      map[month] = (map[month] || 0) + exp.totalAmount;
    });
    return Object.entries(map).map(([month, total]) => ({ month, total }));
  }, [expenses]);

  return (
    <div className="charts-container">
      <h2>Expense Insights</h2>

      <div className="chart-grid">

        {/* Pie Chart */}
        <div className="chart-card">
          <h3>Expenses by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {categoryData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No expense data available.</p>
          )}
        </div>

        {/* Line Chart */}
        <div className="chart-card">
          <h3>Monthly Expense Trend</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#0077ff" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No monthly data available.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardCharts;
