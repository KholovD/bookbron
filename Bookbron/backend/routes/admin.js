const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Dashboard
router.get('/stats', isAdmin, adminController.getDashboardStats);

// Zonalar
router.post('/zones', isAdmin, adminController.createZone);
router.put('/zones/:id', isAdmin, adminController.updateZone);
router.delete('/zones/:id', isAdmin, adminController.deleteZone);

// Kompyuterlar
router.post('/computers', isAdmin, adminController.createComputer);
router.put('/computers/:id', isAdmin, adminController.updateComputer);
router.delete('/computers/:id', isAdmin, adminController.deleteComputer);

// Foydalanuvchilar
router.get('/users', isAdmin, adminController.getUsers);
router.put('/users/:id', isAdmin, adminController.updateUser);

// Xabarlar
router.post('/notifications', isAdmin, adminController.sendNotification);

// Hisobotlar
router.get('/reports/bookings', isAdmin, adminController.getBookingReports);

module.exports = router;
