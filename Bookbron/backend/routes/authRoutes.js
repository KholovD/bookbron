const express = require('express');
const router = express.Router();
const smsService = require('../services/smsService');
const { body, validationResult } = require('express-validator');

// SMS kodlarni vaqtincha saqlash uchun
const otpStore = new Map();

// Parolni tiklash uchun so'rov
router.post('/forgot-password', 
    body('phone').matches(/^\+998[0-9]{9}$/),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Noto\'g\'ri telefon raqam formati' });
            }

            const { phone } = req.body;
            
            // Bazadan tekshirish
            const user = await User.findOne({ where: { phone } });
            if (!user) {
                return res.status(404).json({ message: 'Bunday telefon raqam topilmadi' });
            }

            // OTP generatsiya
            const otp = smsService.generateOTP();
            
            // SMS yuborish
            await smsService.sendSMS(
                phone,
                `BookBron: Parolni tiklash uchun kod: ${otp}. Hech kimga aytmang!`
            );

            // OTP ni vaqtincha saqlash (2 daqiqaga)
            otpStore.set(phone, {
                code: otp,
                expiry: Date.now() + 120000 // 2 daqiqa
            });

            setTimeout(() => {
                otpStore.delete(phone);
            }, 120000);

            res.json({ message: 'SMS kod yuborildi' });

        } catch (error) {
            console.error('Forgot password error:', error);
            res.status(500).json({ message: 'Serverda xatolik yuz berdi' });
        }
    }
);

// SMS kodni tekshirish
router.post('/verify-code',
    body('phone').matches(/^\+998[0-9]{9}$/),
    body('code').isLength({ min: 6, max: 6 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Noto\'g\'ri ma\'lumotlar' });
            }

            const { phone, code } = req.body;
            const storedOTP = otpStore.get(phone);

            if (!storedOTP) {
                return res.status(400).json({ message: 'SMS kod muddati tugagan' });
            }

            if (storedOTP.code !== code) {
                return res.status(400).json({ message: 'Noto\'g\'ri kod' });
            }

            if (Date.now() > storedOTP.expiry) {
                otpStore.delete(phone);
                return res.status(400).json({ message: 'SMS kod muddati tugagan' });
            }

            // Kod to'g'ri, keyingi bosqichga o'tish mumkin
            otpStore.delete(phone);
            res.json({ message: 'Kod tasdiqlandi' });

        } catch (error) {
            console.error('Verify code error:', error);
            res.status(500).json({ message: 'Serverda xatolik yuz berdi' });
        }
    }
);

module.exports = router; 