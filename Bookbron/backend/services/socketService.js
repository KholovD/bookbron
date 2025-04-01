const WebSocket = require('ws');
const Computer = require('../models/Computer');
const Booking = require('../models/Booking');

class SocketService {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.clients = new Map(); // {userId: ws}
        this.init();
    }

    init() {
        this.wss.on('connection', (ws, req) => {
            console.log('Yangi WebSocket ulanish');

            ws.on('message', async (message) => {
                try {
                    const data = JSON.parse(message);
                    await this.handleMessage(ws, data);
                } catch (error) {
                    console.error('WebSocket xabari xatosi:', error);
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: error.message
                    }));
                }
            });

            ws.on('close', () => {
                this.removeClient(ws);
            });
        });
    }

    async handleMessage(ws, data) {
        switch (data.type) {
            case 'auth':
                this.authenticateClient(ws, data.userId);
                break;

            case 'subscribe_computers':
                await this.sendComputersStatus(ws, data.zoneId);
                break;

            case 'subscribe_bookings':
                if (data.isAdmin) {
                    await this.sendAllBookings(ws);
                } else {
                    await this.sendUserBookings(ws, data.userId);
                }
                break;

            default:
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Noma\'lum xabar turi'
                }));
        }
    }

    authenticateClient(ws, userId) {
        this.clients.set(userId, ws);
        ws.userId = userId;
        
        ws.send(JSON.stringify({
            type: 'auth_success',
            message: 'Muvaffaqiyatli autentifikatsiya'
        }));
    }

    removeClient(ws) {
        if (ws.userId) {
            this.clients.delete(ws.userId);
        }
    }

    async sendComputersStatus(ws, zoneId) {
        try {
            const computers = await Computer.find(
                zoneId ? { zone: zoneId } : {}
            ).populate('zone');

            const computersData = computers.map(computer => ({
                id: computer._id,
                number: computer.number,
                zone: computer.zone.name,
                status: computer.status
            }));

            ws.send(JSON.stringify({
                type: 'computers_status',
                data: computersData
            }));
        } catch (error) {
            console.error('Kompyuterlar holatini yuborishda xatolik:', error);
        }
    }

    async sendUserBookings(ws, userId) {
        try {
            const bookings = await Booking.find({
                user: userId,
                status: 'active'
            }).populate('computer');

            ws.send(JSON.stringify({
                type: 'user_bookings',
                data: bookings
            }));
        } catch (error) {
            console.error('Buyurtmalarni yuborishda xatolik:', error);
        }
    }

    async sendAllBookings(ws) {
        try {
            const bookings = await Booking.find({
                status: 'active'
            }).populate(['computer', 'user']);

            ws.send(JSON.stringify({
                type: 'all_bookings',
                data: bookings
            }));
        } catch (error) {
            console.error('Barcha buyurtmalarni yuborishda xatolik:', error);
        }
    }

    // Kompyuter holati o'zgarganda barcha mijozlarga xabar yuborish
    async broadcastComputerUpdate(computerId) {
        try {
            const computer = await Computer.findById(computerId).populate('zone');
            
            const updateData = {
                type: 'computer_update',
                data: {
                    id: computer._id,
                    number: computer.number,
                    zone: computer.zone.name,
                    status: computer.status
                }
            };

            this.broadcast(JSON.stringify(updateData));
        } catch (error) {
            console.error('Kompyuter yangilanishini yuborishda xatolik:', error);
        }
    }

    // Buyurtma o'zgarganda tegishli foydalanuvchiga xabar yuborish
    async sendBookingUpdate(booking) {
        try {
            const ws = this.clients.get(booking.user.toString());
            if (ws) {
                ws.send(JSON.stringify({
                    type: 'booking_update',
                    data: booking
                }));
            }
        } catch (error) {
            console.error('Buyurtma yangilanishini yuborishda xatolik:', error);
        }
    }

    // Vaqt hisoblagich yangilanishini yuborish
    async sendTimerUpdate(bookingId) {
        try {
            const booking = await Booking.findById(bookingId);
            const ws = this.clients.get(booking.user.toString());
            
            if (ws) {
                const remainingTime = booking.endTime - new Date();
                ws.send(JSON.stringify({
                    type: 'timer_update',
                    data: {
                        bookingId,
                        remainingTime
                    }
                }));
            }
        } catch (error) {
            console.error('Timer yangilanishini yuborishda xatolik:', error);
        }
    }

    // Barcha ulangan mijozlarga xabar yuborish
    broadcast(message) {
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
}

module.exports = SocketService; 