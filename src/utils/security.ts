import { AES, enc } from 'crypto-js';
import { jwtDecode } from 'jwt-decode';

export class SecurityManager {
  private static instance: SecurityManager;
  private encryptionKey: string;

  private constructor() {
    this.encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
  }

  public static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  // Data encryption
  public encrypt(data: any): string {
    try {
      return AES.encrypt(
        JSON.stringify(data),
        this.encryptionKey
      ).toString();
    } catch (error) {
      logger.error('Encryption failed', error);
      throw new Error('Encryption failed');
    }
  }

  // Data decryption
  public decrypt(encryptedData: string): any {
    try {
      const bytes = AES.decrypt(encryptedData, this.encryptionKey);
      return JSON.parse(bytes.toString(enc.Utf8));
    } catch (error) {
      logger.error('Decryption failed', error);
      throw new Error('Decryption failed');
    }
  }

  // Token validation
  public validateToken(token: string): boolean {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  // XSS prevention
  public sanitizeInput(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Security headers
  public getSecurityHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': "default-src 'self'",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    };
  }
} 