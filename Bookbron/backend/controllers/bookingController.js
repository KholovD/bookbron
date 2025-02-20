const Booking = require('../models/Booking');
const Computer = require('../models/Computer');
const sendNotification = require('../utils/sendNotification');
const { sendBookingNotification, sendBookingReminder } = require('../utils/notifications');

exports.createBooking = async (req, res) => {
    try {
        const { computerId, startTime, endTime } = req.body;

        // Kompyuter mavjudligini tekshirish
        const computer = await Computer.findById(computerId);
        if (!computer || computer.status !== 'available') {
            return res.status(400).json({ message: 'Kompyuter band yoki mavjud emas' });
        }

        // Vaqt oralig'ida boshqa buyurtmalar yo'qligini tekshirish
        const conflictingBooking = await Booking.findOne({
            computer: computerId,
            status: 'active',
            $or: [
                { startTime: { $lte: endTime }, endTime: { $gte: startTime } }
            ]
        });

        if (conflictingBooking) {
            return res.status(400).json({ message: 'Bu vaqt oralig\'i band' });
        }

        // Buyurtma yaratish
        const booking = await Booking.create({
            user: req.user.id,
            computer: computerId,
            startTime,
            endTime,
            totalPrice: req.body.totalPrice
        });

        // Kompyuter statusini yangilash
        computer.status = 'occupied';
        await computer.save();

        // Telegram orqali xabar yuborish
        await sendBookingNotification(booking, req.user);

        // Vaqt tugashidan 10 daqiqa oldin eslatma yuborish
        const reminderTime = new Date(booking.endTime);
        reminderTime.setMinutes(reminderTime.getMinutes() - 10);
        
        setTimeout(async () => {
            await sendBookingReminder(booking, req.user);
        }, reminderTime - new Date());

        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('computer')
            .sort('-createdAt');

        res.json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Buyurtma topilmadi' });
        }

        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bu amalni bajarishga ruxsat yo\'q' });
        }

        booking.status = 'cancelled';
        await booking.save();

        // Kompyuter statusini yangilash
        const computer = await Computer.findById(booking.computer);
        computer.status = 'available';
        await computer.save();

        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
