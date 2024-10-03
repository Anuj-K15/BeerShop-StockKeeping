const mongoose = require('mongoose');

const SalesSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    quantity: { type: Number, required: true },
    date: { type: Date, default: Date.now } // Automatically sets date and time
});

module.exports = mongoose.model('Sales', SalesSchema);
