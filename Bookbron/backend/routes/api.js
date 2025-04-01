const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { register, login, forgotPassword } = require('../controllers/authController');
const { createBooking, getBookings, cancelBooking } = require('../controllers/bookingController');

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/forgot-password', forgotPassword);

// Booking routes
router.post('/bookings', auth, createBooking);
router.get('/bookings', auth, getBookings);
router.put('/bookings/:id/cancel', auth, cancelBooking);

module.exports = router;
