import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MonthlyGoalForm.css';

const MonthlyGoalForm = () => {
  const [goal, setGoal] = useState('');
  const [currentGoal, setCurrentGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch current goal on load
  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const res = await axios.get('/api/monthlyGoal', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.data) setCurrentGoal(res.data.goalAmount);
      } catch (err) {
        console.error('Error fetching goal:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGoal();
  }, []);

  // Handle goal submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        '/api/monthlyGoal',
        { goalAmount: parseFloat(goal) },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setMessage('Monthly goal saved successfully 🎯');
      setCurrentGoal(res.data.goalAmount);
      setGoal('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error saving goal:', err);
      setMessage('Failed to save goal. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="goal-card">
      <h3>Set Monthly Goal</h3>

      {currentGoal && (
        <p className="current-goal">
          🎯 Current Goal: <strong>${currentGoal.toLocaleString()}</strong>
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Enter new goal amount"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          required
        />
        <button type="submit">Save Goal</button>
      </form>

      {message && <p className="goal-message">{message}</p>}
    </div>
  );
};

export default MonthlyGoalForm;
