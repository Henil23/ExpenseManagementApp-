const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Create a new expense
router.post('/', async (req, res) => {
  const { userId, title, category, expenseType, totalAmount, yourShare } = req.body;

  if (!title || !category || !totalAmount || !yourShare) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const owedAmount = expenseType === 'shared' ? totalAmount - yourShare : 0;

    const newExpense = new Expense({
      user: userId,
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

// Get all expenses for a user
router.get('/:userId', async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.params.userId }).populate('category', 'name icon');
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an expense
router.put('/:id', async (req, res) => {
  const { title, category, totalAmount, yourShare, expenseType, isSettled } = req.body;

  try {
    const owedAmount = expenseType === 'shared' ? totalAmount - yourShare : 0;

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { title, category, totalAmount, yourShare, expenseType, owedAmount, isSettled },
      { new: true }
    );

    res.json({ message: 'Expense updated', expense: updatedExpense });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an expense
router.delete('/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark shared expense as settled
router.patch('/:id/settle', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

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
