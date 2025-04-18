
const mongoose = require('mongoose');

const trailerSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  trailer : { type: String, required: true },
  numberPlate: { type: String, required: true }
});

module.exports = mongoose.model('Trailer', trailerSchema);
