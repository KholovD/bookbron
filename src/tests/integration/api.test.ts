import { setupTestDatabase, teardownTestDatabase } from '../utils/testDb';
import { api } from '@/services/api';
import { createTestUser, createTestComputer } from '../utils/testFactories';

describe('API Integration Tests', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('Authentication', () => {
    it('should login successfully with valid credentials', async () => {
      const user = await createTestUser({
        username: 'testuser',
        password: 'Test123!'
      });

      const response = await api.post('/auth/login', {
        username: user.username,
        password: 'Test123!'
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');
      expect(response.data).toHaveProperty('refreshToken');
    });

    it('should fail login with invalid credentials', async () => {
      await expect(api.post('/auth/login', {
        username: 'invalid',
        password: 'invalid'
      })).rejects.toThrow('Invalid credentials');
    });
  });

  describe('Computer Management', () => {
    let authToken: string;

    beforeEach(async () => {
      const loginResponse = await api.post('/auth/login', {
        username: 'admin',
        password: 'admin123'
      });
      authToken = loginResponse.data.token;
    });

    it('should create computer session', async () => {
      const computer = await createTestComputer();
      
      const response = await api.post(
        `/computers/${computer.id}/sessions`,
        { userId: 'test-user' },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      expect(response.status).toBe(201);
      expect(response.data.status).toBe('active');
    });
  });
}); 