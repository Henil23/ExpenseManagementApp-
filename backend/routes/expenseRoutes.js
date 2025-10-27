const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { authMiddleware } = require('../middleware/authMiddleware');

// Create a new expense
router.post('/', authMiddleware, async (req, res) => {
  const { title, category, expenseType, totalAmount, yourShare } = req.body;

  if (!title || !category || !totalAmount || !yourShare) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const owedAmount = expenseType === 'shared' ? totalAmount - yourShare : 0;

    const newExpense = new Expense({
      user: req.user.userId,
      title,
      category,
      expenseType,
      totalAmount,
      yourShare,
      owedAmount,
    });

    await newExpense.save();
    res.status(201).json({ message: 'Expense recorded successfully', expense: newExpense });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all expenses for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.userId }).populate('category', 'name icon');
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an expense
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, category, totalAmount, yourShare, expenseType, isSettled } = req.body;

  try {
    const owedAmount = expenseType === 'shared' ? totalAmount - yourShare : 0;

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { title, category, totalAmount, yourShare, expenseType, owedAmount, isSettled },
      { new: true }
    );

    if (!updatedExpense) return res.status(404).json({ message: 'Expense not found' });

    res.json({ message: 'Expense updated', expense: updatedExpense });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an expense
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedExpense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!deletedExpense) return res.status(404).json({ message: 'Expense not found' });

    res.json({ message: 'Expense deleted' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark shared expense as settled
router.patch('/:id/settle', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user.userId });

    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    expense.isSettled = true;
    await expense.save();

    res.json({ message: 'Expense marked as settled', expense });
  } catch (error) {
    console.error('Error marking expense as settled:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
