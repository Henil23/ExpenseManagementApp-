const mongoose = require('mongoose');

const monthlyGoalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    income: {
        type: Number,
        required: true,
    },
    savingsGoal: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('MonthlyGoal', monthlyGoalSchema);
module.exports = monthlyGoal;