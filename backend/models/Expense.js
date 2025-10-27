const mongoose = require('mongoose');
const { type } = require('os');
const { ref } = require('process');

const expenseSchema = new mongoose.Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String, 
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    date: {
        type: Date, 
        default: Date.now,
    },
    expenseType: {
        type: String, 
        enum: ['Personal', 'Shared'],
        default: 'Personal',
    },
  //for shared expenses
  totalAmount: {
    type: Number,
    required: true,
  },
  yourShare: {
    type: Number,
    required: true,
    },
owedAmount: {
    type: Number,
    default: 0, // totlalAmount - yourShare
},
isSettled: {
    type:Boolean, 
    default: false, 
},
});
module.exports = mongoose.model('Expense',expenseSchema);
