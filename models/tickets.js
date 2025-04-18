
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    officerid: {
        type: String,
        required: true
    },
    offense: {
        type: String,
        required: true
    },
    price: {
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

module.exports = mongoose.model('Ticket', ticketSchema);
