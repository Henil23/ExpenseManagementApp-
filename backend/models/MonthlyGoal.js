const mongoose = require('mongoose');

const MonthlyGoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  income: {
    type: Number,
    required: true
  },
  savingGoal: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const MonthlyGoal = mongoose.model('MonthlyGoal', MonthlyGoalSchema);

module.exports = MonthlyGoal;
