const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const HostingOrderSchema = new Schema({
    host: { type: String, required: true },
    order: { type: Number, required: true }
});

module.exports = HostingOrder = mongoose.model('hostingOrders', HostingOrderSchema);