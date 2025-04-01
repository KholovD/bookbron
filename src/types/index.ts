// Asosiy tiplar
interface User {
  id: string;
  username: string;
  role: 'admin' | 'manager' | 'staff';
  email: string;
  createdAt: Date;
}

interface Computer {
  id: string;
  name: string;
  status: 'available' | 'in-use' | 'maintenance';
  specs: {
    cpu: string;
    ram: string;
    gpu: string;
  };
  hourlyRate: number;
  location: string;
  lastMaintenance?: Date;
}

interface Session {
  id: string;
  computerId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  totalAmount?: number;
  status: 'active' | 'completed' | 'cancelled';
}

interface Payment {
  id: string;
  sessionId: string;
  amount: number;
  method: 'cash' | 'card' | 'payme';
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  minQuantity: number;
  supplierId: string;
}