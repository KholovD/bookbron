import { io, Socket } from 'socket.io-client';
import { store } from '@/store';
import { updateComputerStatus, updateActiveSession } from '@/store/slices/monitoringSlice';
import { showNotification } from '@/utils/notification';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    try {
      this.socket = io(import.meta.env.VITE_WS_URL, {
        auth: {
          token: localStorage.getItem('token')
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: this.maxReconnectAttempts
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('WebSocket ulanishda xatolik:', error);
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Ulanish holati
    this.socket.on('connect', () => {
      console.log('WebSocket ulandi');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket uzildi');
    });

    // Kompyuter holati o'zgarishlari
    this.socket.on('computer:status', (data) => {
      store.dispatch(updateComputerStatus(data));
    });

    // Faol sessiyalar o'zgarishlari
    this.socket.on('session:update', (data) => {
      store.dispatch(updateActiveSession(data));
    });

    // Tizim xabarnomalari
    this.socket.on('system:notification', (data) => {
      showNotification(data.message, data.type);
    });

    // Xatoliklar
    this.socket.on('error', (error) => {
      console.error('WebSocket xatolik:', error);
      showNotification('Server bilan aloqa uzildi', 'error');
    });
  }

  // Kompyuterni boshqarish
  sendComputerCommand(computerId: string, command: string) {
    if (!this.socket) return;
    
    this.socket.emit('computer:command', { computerId, command });
  }

  // Xabar yuborish
  sendMessage(userId: string, message: string) {
    if (!this.socket) return;
    
    this.socket.emit('message:send', { userId, message });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const wsService = new WebSocketService(); 