const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Avtorizatsiyadan o\'ting' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Avtorizatsiyadan o\'ting' });
    }
};

exports.isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Avtorizatsiyadan o\'ting' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Bu amalni bajarishga ruxsat yo\'q' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Avtorizatsiyadan o\'ting' });
    }
}; 