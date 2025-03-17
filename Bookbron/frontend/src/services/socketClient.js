class SocketClient {
    constructor() {
        this.socket = null;
        this.handlers = new Map();
    }

    connect(userId) {
        this.socket = new WebSocket(process.env.REACT_APP_WS_URL);

        this.socket.onopen = () => {
            console.log('WebSocket ulanish o\'rnatildi');
            this.authenticate(userId);
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const handler = this.handlers.get(data.type);
            
            if (handler) {
                handler(data.data);
            }
        };

        this.socket.onclose = () => {
            console.log('WebSocket ulanish uzildi');
            setTimeout(() => this.connect(userId), 5000); // Qayta ulanish
        };
    }

    authenticate(userId) {
        this.send({
            type: 'auth',
            userId
        });
    }

    subscribeToComputers(zoneId = null) {
        this.send({
            type: 'subscribe_computers',
            zoneId
        });
    }

    subscribeToBookings(userId, isAdmin = false) {
        this.send({
            type: 'subscribe_bookings',
            userId,
            isAdmin
        });
    }

    on(type, handler) {
        this.handlers.set(type, handler);
    }

    send(data) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        }
    }
}

export default new SocketClient(); 