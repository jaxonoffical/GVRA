const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  vehicle: { type: String, required: true }, // Vehicle name or model
  color: { type: String, required: true },
  numberPlate: { type: String, required: true },
  registered: { type: Boolean, default: false } // Indicates if the vehicle is registered
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
