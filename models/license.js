
const { Schema, model } = require('mongoose');

const licenseSchema = new Schema({
    userId: { type: String, required: true },
    status: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const License = model('License', licenseSchema);

module.exports = License;
