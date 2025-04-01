const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    pricePerHour: {
        type: Number,
        required: true
    },
    description: String,
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Zone', zoneSchema);
