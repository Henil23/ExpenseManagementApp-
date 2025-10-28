import React, { useState } from 'react';
import API from '../services/api';
import './ExpenseForm.css';

const ExpenseForm = ({ categories, onAdd }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [expenseType, setExpenseType] = useState('personal'); // personal | shared
  const [totalAmount, setTotalAmount] = useState('');
  const [yourShare, setYourShare] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || !totalAmount || !yourShare) {
      setMessage('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      await API.post('/expenses', {
        title,
        category,
        expenseType,
        totalAmount: parseFloat(totalAmount),
        yourShare: parseFloat(yourShare),
      });

      setMessage('Expense added successfully ✅');
      setTitle('');
      setCategory('');
      setExpenseType('personal');
      setTotalAmount('');
      setYourShare('');
      onAdd(); // refresh dashboard
    } catch (error) {
      console.error('Error adding expense:', error);
      setMessage(error.response?.data?.message || 'Failed to add expense.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expense-form">
      <h2>Add New Expense</h2>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Grocery shopping"
            required
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Expense Type */}
        <div className="form-group">
          <label>Expense Type</label>
          <select
            value={expenseType}
            onChange={(e) => setExpenseType(e.target.value)}
          >
            <option value="personal">Personal</option>
            <option value="shared">Shared</option>
          </select>
        </div>

        {/* Total Amount */}
        <div className="form-group">
          <label>Total Amount ($)</label>
          <input
            type="number"
            step="0.01"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            placeholder="e.g. 120.50"
            required
          />
        </div>

        {/* Your Share */}
        <div className="form-group">
          <label>Your Share ($)</label>
          <input
            type="number"
            step="0.01"
            value={yourShare}
            onChange={(e) => setYourShare(e.target.value)}
            placeholder="e.g. 60.25"
            required
          />
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
