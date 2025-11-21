const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { authMiddleware } = require('../middleware/authMiddleware');

// Create a new category
router.post('/', authMiddleware, async (req, res) => {
  const { name, icon } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    const newCategory = new Category({
      user: req.user.userId, // <-- from JWT
      name,
      icon,
    });

    await newCategory.save();
    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all categories for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.userId });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update category
router.put('/:id', authMiddleware, async (req, res) => {
  const { name, icon } = req.body;

  try {
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { name, icon },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category updated', category: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete category
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
