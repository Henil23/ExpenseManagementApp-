import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PredictionDisplay.css';

const PredictionDisplay = () => {
  const [goal, setGoal] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [prediction, setPrediction] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const [goalRes, expenseRes] = await Promise.all([
          axios.get('/api/monthlyGoal', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('/api/expenses', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);

        const goalAmount = goalRes.data.goalAmount;
        const expenses = expenseRes.data;
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        // Simple linear prediction: (daily avg * days in month)
        const currentDay = new Date().getDate();
        const daysInMonth = new Date().getFullYear() % 4 === 0 ? 30 : 31; // simplified
        const avgPerDay = total / currentDay;
        const predicted = avgPerDay * daysInMonth;

        setGoal(goalAmount);
        setTotalSpent(total);
        setPrediction(predicted);

        if (predicted <= goalAmount * 0.9) setStatus('🟢 On Track');
        else if (predicted <= goalAmount) setStatus('🟡 Slightly Over Budget');
        else setStatus('🔴 Over Budget');
      } catch (err) {
        console.error('Error fetching prediction data:', err);
      }
    };

    fetchPrediction();
  }, []);

  const progress = goal ? Math.min((totalSpent / goal) * 100, 100) : 0;

  return (
    <div className="prediction-card">
      <h3>Spending Prediction</h3>

      {goal ? (
        <>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{
                width: `${progress}%`,
                backgroundColor:
                  progress < 70 ? '#4caf50' : progress < 100 ? '#ffc107' : '#f44336',
              }}
            ></div>
          </div>

          <div className="prediction-info">
            <p><strong>Total Spent:</strong> ${totalSpent.toFixed(2)}</p>
            <p><strong>Goal:</strong> ${goal.toFixed(2)}</p>
            <p><strong>Predicted Spending:</strong> ${prediction?.toFixed(2)}</p>
            <p className="status-text">{status}</p>
          </div>
        </>
      ) : (
        <p>No goal set yet. Please set one to view predictions.</p>
      )}
    </div>
  );
};

export default PredictionDisplay;
