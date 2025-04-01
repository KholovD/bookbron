const crypto = require('crypto');
const axios = require('axios');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { sendNotification } = require('./telegramBot');

class PaymentService {
    constructor() {
        this.clickSettings = {
            merchantId: process.env.CLICK_MERCHANT_ID,
            serviceId: process.env.CLICK_SERVICE_ID,
            secretKey: process.env.CLICK_SECRET_KEY,
            merchantUserId: process.env.CLICK_MERCHANT_USER_ID
        };

        this.paymeSettings = {
            merchantId: process.env.PAYME_MERCHANT_ID,
            secretKey: process.env.PAYME_SECRET_KEY
        };
    }

    // Click to'lov tizimi uchun
    async createClickPayment(bookingId, userId, amount) {
        try {
            const payment = await Payment.create({
                booking: bookingId,
                user: userId,
                amount,
                provider: 'click'
            });

            const sign = crypto
                .createHash('md5')
                .update(
                    this.clickSettings.merchantId +
                    this.clickSettings.serviceId +
                    payment._id +
                    amount +
                    this.clickSettings.secretKey
                )
                .digest('hex');

            const paymentUrl = `https://my.click.uz/services/pay?service_id=${
                this.clickSettings.serviceId
            }&merchant_id=${
                this.clickSettings.merchantId
            }&amount=${amount}&transaction_param=${
                payment._id
            }&sign_time=${
                Date.now()
            }&sign_string=${sign}`;

            return {
                payment,
                paymentUrl
            };
        } catch (error) {
            throw new Error('Click to\'lov yaratishda xatolik: ' + error.message);
        }
    }

    // Payme to'lov tizimi uchun
    async createPaymePayment(bookingId, userId, amount) {
        try {
            const payment = await Payment.create({
                booking: bookingId,
                user: userId,
                amount,
                provider: 'payme'
            });

            const paymeRequest = {
                method: 'cards.create',
                params: {
                    card: { number: '', expire: '' },
                    amount: amount * 100, // Payme tiyinlarda ishlaydi
                    save: false
                }
            };

            const response = await axios.post(
                'https://checkout.payme.uz/api',
                paymeRequest,
                {
                    headers: {
                        'X-Auth': this.paymeSettings.merchantId
                    }
                }
            );

            payment.paymentData = response.data;
            await payment.save();

            return {
                payment,
                paymentUrl: response.data.result.url
            };
        } catch (error) {
            throw new Error('Payme to\'lov yaratishda xatolik: ' + error.message);
        }
    }

    // Click webhook
    async handleClickWebhook(data) {
        try {
            const payment = await Payment.findById(data.merchant_trans_id);
            if (!payment) {
                throw new Error('To\'lov topilmadi');
            }

            const sign = crypto
                .createHash('md5')
                .update(
                    data.click_trans_id +
                    data.service_id +
                    this.clickSettings.secretKey +
                    data.merchant_trans_id +
                    data.amount +
                    data.action +
                    data.sign_time
                )
                .digest('hex');

            if (sign !== data.sign_string) {
                throw new Error('Noto\'g\'ri sign');
            }

            if (data.error === 0) {
                payment.status = 'completed';
                payment.transactionId = data.click_trans_id;
                await payment.save();

                await this.processSuccessfulPayment(payment);
                return { error: 0 };
            } else {
                payment.status = 'failed';
                await payment.save();
                return { error: data.error };
            }
        } catch (error) {
            console.error('Click webhook xatosi:', error);
            return { error: -1, error_note: error.message };
        }
    }

    // Payme webhook
    async handlePaymeWebhook(data) {
        try {
            const { id, method, params } = data;
            let result = {};

            switch (method) {
                case 'CheckTransaction':
                    result = await this.checkPaymeTransaction(params);
                    break;
                case 'CreateTransaction':
                    result = await this.createPaymeTransaction(params);
                    break;
                case 'PerformTransaction':
                    result = await this.performPaymeTransaction(params);
                    break;
                case 'CancelTransaction':
                    result = await this.cancelPaymeTransaction(params);
                    break;
                default:
                    throw new Error('Noto\'g\'ri metod');
            }

            return {
                jsonrpc: '2.0',
                id,
                result
            };
        } catch (error) {
            console.error('Payme webhook xatosi:', error);
            return {
                jsonrpc: '2.0',
                id: data.id,
                error: {
                    code: -32400,
                    message: error.message
                }
            };
        }
    }

    // To'lov muvaffaqiyatli bo'lganda
    async processSuccessfulPayment(payment) {
        try {
            const booking = await Booking.findById(payment.booking);
            booking.status = 'active';
            await booking.save();

            // Foydalanuvchiga xabar yuborish
            await sendNotification(
                payment.user,
                'To\'lov muvaffaqiyatli',
                `Buyurtma #${booking._id} uchun to'lov qabul qilindi.\nSumma: ${payment.amount} so'm`
            );
        } catch (error) {
            console.error('To\'lovni qayta ishlashda xatolik:', error);
        }
    }
}

module.exports = new PaymentService(); 