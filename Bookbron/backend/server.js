const express = require('express');
const http = require('http');
const SocketService = require('./services/socketService');
const connectDB = require('./config/database');

const app = express();
const server = http.createServer(app);
const socketService = new SocketService(server);

// Global o'zgaruvchi sifatida saqlash
app.set('socketService', socketService);

// ... boshqa middleware va routelar ...

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server ${PORT} portda ishga tushdi`);
}); 