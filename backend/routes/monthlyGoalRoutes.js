const express = require('express');
const router = express.Router();
const MonthlyGoal = require('../models/MonthlyGoal');
const Expense = require('../models/Expense');
const { authMiddleware } = require('../middleware/authMiddleware');

// Create or update monthly goal
router.post('/', authMiddleware, async (req, res) => {
  const { income, savingGoal } = req.body;

  if (!income || !savingGoal) {
    return res.status(400).json({ message: 'Income and saving goal are required' });
  }

  try {
    let goal = await MonthlyGoal.findOne({ user: req.user.userId });

    if (goal) {
      goal.income = income;
      goal.savingGoal = savingGoal;
      await goal.save();
    } else {
      goal = new MonthlyGoal({
        user: req.user.userId,
        income,
        savingGoal,
      });
      await goal.save();
    }

    res.status(200).json({ message: 'Monthly goal saved', goal });
  } catch (error) {
    console.error('Error saving monthly goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get monthly goal and predicted savings

router.get('/', authMiddleware, async (req, res) => {
  try {
    const goal = await MonthlyGoal.findOne({ user: req.user.userId });
    if (!goal) return res.status(404).json({ message: 'No goal found' });

    // Only current month expenses
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);

    const expenses = await Expense.find({
      user: req.user.userId,
      createdAt: { $gte: startOfMonth }
    });

    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.totalAmount, 0);
    const remaining = goal.income - goal.savingGoal - totalExpenses;
    const weeklyAllowance = remaining / 4;

    const predictedSavings = goal.savingGoal * 6;
    const predictedSavingsAfterExpenses = predictedSavings - (totalExpenses * 6);

    res.json({
      goal,
      totalExpenses,
      remainingAllowance: remaining,
      weeklyAllowance,
      predictedSavings,
      predictedSavingsAfterExpenses,
    });
  } catch (error) {
    console.error('Error fetching monthly goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
