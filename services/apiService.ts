
import { User, UserRole, AuthResponse } from '../types';

/**
 * MOCK DATABASE 
 * In a real app, this would be on the server.
 */
const MOCK_USERS = [
  {
    id: 'u1',
    business_id: 'b1',
    name: 'John Doe',
    email: 'demo@salesagent.ai',
    password: 'password', // Hash in production
    role: UserRole.OWNER,
    created_at: new Date().toISOString()
  },
  {
    id: 'u2',
    business_id: 'b1',
    name: 'Jane Smith',
    email: 'staff@salesagent.ai',
    password: 'password',
    role: UserRole.STAFF,
    created_at: new Date().toISOString()
  }
];

export const apiService = {
  /**
   * Simulated Login Endpoint
   * Returns a mock JWT and user profile
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      // Simulate network latency
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          // Generate a fake JWT
          const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(foundUser))}.mock_signature`;
          
          // Don't return the password field
          const { password: _, ...userWithoutPassword } = foundUser;
          
          resolve({
            user: userWithoutPassword as User,
            token: mockToken
          });
        } else {
          reject(new Error('Invalid email or password. Please try again.'));
        }
      }, 1200);
    });
  },

  /**
   * Simulated Session Verification
   */
  async verifyToken(token: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          resolve(payload as User);
        } catch (e) {
          reject(new Error('Session expired.'));
        }
      }, 500);
    });
  }
};
