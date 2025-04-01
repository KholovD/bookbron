const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// To'lov yaratish
router.post('/create', auth, paymentController.createPayment);

// To'lov holatini tekshirish
router.get('/status/:id', auth, paymentController.getPaymentStatus);

// Click webhook
router.post('/click/webhook', paymentController.handleClickWebhook);

// Payme webhook
router.post('/payme/webhook', paymentController.handlePaymeWebhook);

module.exports = router; 