const mongoose = require('mongoose');

const computerSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true
    },
    zone: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Zone',
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'maintenance'],
        default: 'available'
    },
    specs: {
        type: String
    }
});

module.exports = mongoose.model('Computer', computerSchema);
