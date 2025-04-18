
const mongoose = require('mongoose');

const warrantSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    officerid: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Warrant', warrantSchema);
