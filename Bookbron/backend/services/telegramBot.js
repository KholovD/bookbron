const TelegramBot = require('node-telegram-bot-api');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Computer = require('../models/Computer');
const Zone = require('../models/Zone');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Telegram ID ni saqlash uchun User modeliga qo'shimcha maydon
const updateUserSchema = {
    telegramId: {
        type: String,
        unique: true,
        sparse: true
    }
};

// Botni ishga tushirish
const initBot = () => {
    // Start komandasi
    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;
        
        const keyboard = {
            reply_markup: {
                keyboard: [
                    ['📱 Ro\'yxatdan o\'tish'],
                    ['🖥 Bo\'sh kompyuterlar'],
                    ['📋 Mening buyurtmalarim']
                ],
                resize_keyboard: true
            }
        };

        bot.sendMessage(chatId, 
            'Internet Cafe botiga xush kelibsiz!\n' +
            'Xizmatlardan foydalanish uchun ro\'yxatdan o\'ting.',
            keyboard
        );
    });

    // Ro'yxatdan o'tish
    bot.onText(/📱 Ro\'yxatdan o\'tish/, async (msg) => {
        const chatId = msg.chat.id;
        
        try {
            const existingUser = await User.findOne({ telegramId: chatId.toString() });
            
            if (existingUser) {
                return bot.sendMessage(chatId, 'Siz allaqachon ro\'yxatdan o\'tgansiz!');
            }

            bot.sendMessage(chatId, 
                'Ro\'yxatdan o\'tish uchun email manzilingizni yuboring:',
                { reply_markup: { force_reply: true } }
            );
        } catch (error) {
            bot.sendMessage(chatId, 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
        }
    });

    // Bo'sh kompyuterlar ro'yxati
    bot.onText(/🖥 Bo\'sh kompyuterlar/, async (msg) => {
        const chatId = msg.chat.id;
        
        try {
            const user = await User.findOne({ telegramId: chatId.toString() });
            
            if (!user) {
                return bot.sendMessage(chatId, 'Iltimos, avval ro\'yxatdan o\'ting!');
            }

            const zones = await Zone.find();
            let message = '🏢 Mavjud zonalar va bo\'sh kompyuterlar:\n\n';

            for (const zone of zones) {
                const computers = await Computer.find({ 
                    zone: zone._id,
                    status: 'available'
                });

                message += `${zone.name}: ${computers.length} ta bo\'sh kompyuter\n`;
                message += `💰 Narx: ${zone.pricePerHour} so\'m/soat\n\n`;
            }

            bot.sendMessage(chatId, message);
        } catch (error) {
            bot.sendMessage(chatId, 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
        }
    });

    // Mening buyurtmalarim
    bot.onText(/📋 Mening buyurtmalarim/, async (msg) => {
        const chatId = msg.chat.id;
        
        try {
            const user = await User.findOne({ telegramId: chatId.toString() });
            
            if (!user) {
                return bot.sendMessage(chatId, 'Iltimos, avval ro\'yxatdan o\'ting!');
            }

            const bookings = await Booking.find({ 
                user: user._id,
                status: 'active'
            }).populate('computer');

            if (bookings.length === 0) {
                return bot.sendMessage(chatId, 'Sizda faol buyurtmalar yo\'q.');
            }

            let message = '🎮 Sizning faol buyurtmalaringiz:\n\n';
            
            for (const booking of bookings) {
                const computer = await Computer.findById(booking.computer);
                const zone = await Zone.findById(computer.zone);

                message += `Zona: ${zone.name}\n`;
                message += `Kompyuter: №${computer.number}\n`;
                message += `Boshlanish vaqti: ${booking.startTime.toLocaleString()}\n`;
                message += `Tugash vaqti: ${booking.endTime.toLocaleString()}\n`;
                message += `Narx: ${booking.totalPrice} so\'m\n\n`;
            }

            bot.sendMessage(chatId, message);
        } catch (error) {
            bot.sendMessage(chatId, 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
        }
    });

    // Email orqali ro'yxatdan o'tish
    bot.on('message', async (msg) => {
        if (msg.reply_to_message && 
            msg.reply_to_message.text.includes('email manzilingizni yuboring')) {
            const chatId = msg.chat.id;
            const email = msg.text;

            try {
                const user = await User.findOne({ email });
                
                if (!user) {
                    return bot.sendMessage(chatId, 
                        'Bu email manzil tizimda ro\'yxatdan o\'tmagan.\n' +
                        'Iltimos, avval websaytda ro\'yxatdan o\'ting.'
                    );
                }

                user.telegramId = chatId.toString();
                await user.save();

                bot.sendMessage(chatId, 
                    '✅ Tabriklaymiz! Siz muvaffaqiyatli ro\'yxatdan o\'tdingiz.\n' +
                    'Endi bot orqali buyurtmalaringizni kuzatishingiz mumkin.'
                );
            } catch (error) {
                bot.sendMessage(chatId, 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
            }
        }
    });
};

// Telegram orqali xabar yuborish
const sendTelegramNotification = async (userId, message) => {
    try {
        const user = await User.findById(userId);
        
        if (!user || !user.telegramId) {
            throw new Error('Foydalanuvchi telegram botga ulanmagan');
        }

        await bot.sendMessage(user.telegramId, message);
        return true;
    } catch (error) {
        console.error('Telegram xabar yuborish xatosi:', error);
        return false;
    }
};

const sendNotification = async (userId, title, message, type = 'telegram') => {
    switch (type) {
        case 'telegram':
            return await sendTelegramNotification(userId, `${title}\n\n${message}`);
        // Boshqa xabar turlarini qo'shish mumkin (SMS, Email)
        default:
            throw new Error('Noto\'g\'ri xabar turi');
    }
};

// Buyurtma yaratilganda xabar yuborish
const sendBookingNotification = async (booking, user) => {
    const computer = await Computer.findById(booking.computer);
    const zone = await Zone.findById(computer.zone);

    const message = 
        `🎮 Yangi buyurtma yaratildi!\n\n` +
        `Zona: ${zone.name}\n` +
        `Kompyuter: №${computer.number}\n` +
        `Boshlanish vaqti: ${booking.startTime.toLocaleString()}\n` +
        `Tugash vaqti: ${booking.endTime.toLocaleString()}\n` +
        `Narx: ${booking.totalPrice} so'm`;

    await sendNotification(user._id, 'Buyurtma tasdiqlandi', message);
};

// Buyurtma tugashidan oldin eslatma
const sendBookingReminder = async (booking, user) => {
    const computer = await Computer.findById(booking.computer);
    
    const message = 
        `⚠️ Eslatma!\n\n` +
        `Kompyuter №${computer.number} uchun vaqtingiz\n` +
        `${booking.endTime.toLocaleString()} da tugaydi.\n\n` +
        `Agar davom ettirmoqchi bo'lsangiz, yangi buyurtma bering.`;

    await sendNotification(user._id, 'Vaqt tugashiga oz qoldi', message);
};

module.exports = {
    initBot,
    sendTelegramNotification,
    sendNotification,
    sendBookingNotification,
    sendBookingReminder
};
