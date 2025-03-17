const Payment = require('../models/Payment');
const paymentService = require('../services/paymentService');

exports.createPayment = async (req, res) => {
    try {
        const { bookingId, provider } = req.body;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Buyurtma topilmadi' });
        }

        let paymentResult;

        switch (provider) {
            case 'click':
                paymentResult = await paymentService.createClickPayment(
                    bookingId,
                    req.user.id,
                    booking.totalPrice
                );
                break;
            case 'payme':
                paymentResult = await paymentService.createPaymePayment(
                    bookingId,
                    req.user.id,
                    booking.totalPrice
                );
                break;
            default:
                return res.status(400).json({ message: 'Noto\'g\'ri to\'lov tizimi' });
        }

        res.json({
            success: true,
            data: {
                paymentId: paymentResult.payment._id,
                paymentUrl: paymentResult.paymentUrl
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPaymentStatus = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        
        if (!payment) {
            return res.status(404).json({ message: 'To\'lov topilmadi' });
        }

        res.json({
            success: true,
            data: {
                status: payment.status,
                amount: payment.amount,
                provider: payment.provider,
                createdAt: payment.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Click webhook
exports.handleClickWebhook = async (req, res) => {
    const result = await paymentService.handleClickWebhook(req.body);
    res.json(result);
};

// Payme webhook
exports.handlePaymeWebhook = async (req, res) => {
    const result = await paymentService.handlePaymeWebhook(req.body);
    res.json(result);
}; 