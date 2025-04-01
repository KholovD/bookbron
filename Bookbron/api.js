// Auth endpoints
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password

// Booking endpoints
GET /api/computers
GET /api/computers/:zoneId
POST /api/bookings
GET /api/bookings
GET /api/bookings/:id
PUT /api/bookings/:id/cancel

// Admin endpoints
GET /api/admin/users
POST /api/admin/zones
PUT /api/admin/zones/:id
DELETE /api/admin/zones/:id
POST /api/admin/computers
PUT /api/admin/computers/:id
DELETE /api/admin/computers/:id
POST /api/admin/notifications
GET /api/admin/statistics

// Notification endpoints
POST /api/notifications/send-email
POST /api/notifications/send-sms
POST /api/notifications/send-telegram 