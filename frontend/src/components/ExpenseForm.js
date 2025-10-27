// src/components/ExpenseForm.js
import React, { useState } from 'react';
import API from '../services/api';

const ExpenseForm = ({ categories, onAdd }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [expenseType, setExpenseType] = useState('personal'); // personal or shared
  const [totalAmount, setTotalAmount] = useState('');
  const [yourShare, setYourShare] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || !totalAmount || !yourShare) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await API.post('/expenses', {
        title,
        category,
        expenseType,
        totalAmount: Number(totalAmount),
        yourShare: Number(yourShare),
      });

      // Clear form
      setTitle('');
      setCategory('');
      setExpenseType('personal');
      setTotalAmount('');
      setYourShare('');

      // Notify parent to refresh dashboard
      onAdd();
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense');
    }
  };

  return (
    <div className="expense-form">
      <h3>Add New Expense</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Expense Type:</label>
          <select
            value={expenseType}
            onChange={(e) => setExpenseType(e.target.value)}
          >
            <option value="personal">Personal</option>
            <option value="shared">Shared</option>
          </select>
        </div>

        <div>
          <label>Total Amount:</label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            required
          />
        </div>

        {expenseType === 'shared' && (
          <div>
            <label>Your Share:</label>
            <input
              type="number"
              value={yourShare}
              onChange={(e) => setYourShare(e.target.value)}
              required
            />
          </div>
        )}

        {expenseType === 'personal' && (
          <input type="hidden" value={yourShare} />
        )}

        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default ExpenseForm;
