const mongoose = require('mongoose');
const { ref } = require('process');

const categorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String, 
        default: '📌',
    },
    });
    module.exports = mongoose.model('Category',categorySchema);
