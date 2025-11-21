// src/components/ExpenseList.js
import React from 'react';
import API from '../services/api';
import './ExpenseList.css';

const ExpenseList = ({ expenses, onUpdate }) => {
  // Delete expense
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      await API.delete(`/expenses/${id}`);
      onUpdate(); // refresh dashboard
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense');
    }
  };

  // Mark shared expense as settled
  const handleSettle = async (id) => {
    try {
      await API.patch(`/expenses/${id}/settle`);
      onUpdate(); // refresh
    } catch (error) {
      console.error('Error settling expense:', error);
      alert('Failed to mark expense as settled');
    }
  };

  if (!expenses || expenses.length === 0) {
    return <p>No expenses recorded yet.</p>;
  }

  return (
    <div className="expense-list">
      <h3>Your Expenses</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Type</th>
            <th>Total</th>
            <th>Your Share</th>
            <th>Owed</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id}>
              <td>{expense.title}</td>
              <td>{expense.category?.name || 'Uncategorized'}</td>
              <td>{expense.expenseType}</td>
              <td>${expense.totalAmount}</td>
              <td>${expense.yourShare}</td>
              <td>
                {expense.expenseType === 'shared'
                  ? `$${expense.owedAmount}`
                  : '-'}
              </td>
              <td>
                {expense.isSettled ? (
                  <span style={{ color: 'green' }}>Settled</span>
                ) : (
                  <span style={{ color: 'orange' }}>Pending</span>
                )}
              </td>
              <td>
                <button
                  onClick={() => handleDelete(expense._id)}
                  style={{ marginRight: '8px' }}
                >
                  Delete
                </button>
                {expense.expenseType === 'shared' && !expense.isSettled && (
                  <button onClick={() => handleSettle(expense._id)}>
                    Mark Settled
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;