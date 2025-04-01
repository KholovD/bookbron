const User = require('../models/User');
const Zone = require('../models/Zone');
const Computer = require('../models/Computer');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

// Statistika
exports.getDashboardStats = async (req, res) => {
    try {
        const stats = {
            totalUsers: await User.countDocuments({ role: 'user' }),
            totalBookings: await Booking.countDocuments(),
            activeBookings: await Booking.countDocuments({ status: 'active' }),
            totalComputers: await Computer.countDocuments(),
            availableComputers: await Computer.countDocuments({ status: 'available' }),
            revenue: await Booking.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } }
            ])
        };

        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Zonalar boshqaruvi
exports.createZone = async (req, res) => {
    try {
        const zone = await Zone.create(req.body);
        res.status(201).json({ success: true, data: zone });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateZone = async (req, res) => {
    try {
        const zone = await Zone.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        if (!zone) {
            return res.status(404).json({ message: 'Zona topilmadi' });
        }

        res.json({ success: true, data: zone });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteZone = async (req, res) => {
    try {
        const zone = await Zone.findById(req.params.id);
        
        if (!zone) {
            return res.status(404).json({ message: 'Zona topilmadi' });
        }

        // Zonaga tegishli kompyuterlarni tekshirish
        const hasComputers = await Computer.findOne({ zone: req.params.id });
        if (hasComputers) {
            return res.status(400).json({ 
                message: 'Zonani o\'chirish uchun avval undagi kompyuterlarni o\'chiring' 
            });
        }

        await zone.remove();
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Kompyuterlar boshqaruvi
exports.createComputer = async (req, res) => {
    try {
        const computer = await Computer.create(req.body);
        res.status(201).json({ success: true, data: computer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateComputer = async (req, res) => {
    try {
        const computer = await Computer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!computer) {
            return res.status(404).json({ message: 'Kompyuter topilmadi' });
        }

        res.json({ success: true, data: computer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteComputer = async (req, res) => {
    try {
        const computer = await Computer.findById(req.params.id);
        
        if (!computer) {
            return res.status(404).json({ message: 'Kompyuter topilmadi' });
        }

        // Faol buyurtmalarni tekshirish
        const hasActiveBookings = await Booking.findOne({ 
            computer: req.params.id,
            status: 'active'
        });

        if (hasActiveBookings) {
            return res.status(400).json({ 
                message: 'Kompyuterni o\'chirish uchun avval faol buyurtmalarni bekor qiling' 
            });
        }

        await computer.remove();
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Foydalanuvchilar boshqaruvi
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xabarlar yuborish
exports.sendNotification = async (req, res) => {
    try {
        const { users, title, message, type } = req.body;

        const notifications = await Promise.all(
            users.map(async (userId) => {
                const notification = await Notification.create({
                    user: userId,
                    title,
                    message,
                    type
                });

                // Xabar turini tekshirib, tegishli servisga yuborish
                switch (type) {
                    case 'email':
                        await sendEmail(userId, title, message);
                        break;
                    case 'sms':
                        await sendSMS(userId, message);
                        break;
                    case 'telegram':
                        await sendTelegramMessage(userId, message);
                        break;
                }

                return notification;
            })
        );

        res.status(201).json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Hisobotlar
exports.getBookingReports = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const bookings = await Booking.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    totalBookings: { $sum: 1 },
                    revenue: { $sum: '$totalPrice' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        res.json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
