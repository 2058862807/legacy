/**
 * Client-Side Encryption for Sensitive Estate Planning Documents
 * Implements end-to-end encryption before data reaches servers
 */

export class DocumentEncryption {
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly KEY_LENGTH = 256;
  private static readonly IV_LENGTH = 12;

  /**
   * Generate a new encryption key for user documents
   */
  static async generateKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH,
      },
      true, // extractable
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Export key for secure storage (encrypted with user password)
   */
  static async exportKey(key: CryptoKey): Promise<ArrayBuffer> {
    return await window.crypto.subtle.exportKey('raw', key);
  }

  /**
   * Import key from stored format
   */
  static async importKey(keyData: ArrayBuffer): Promise<CryptoKey> {
    return await window.crypto.subtle.importKey(
      'raw',
      keyData,
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt sensitive document data before sending to server
   */
  static async encryptDocument(
    data: string | object,
    key: CryptoKey
  ): Promise<{
    encryptedData: string;
    iv: string;
    authTag: string;
  }> {
    try {
      // Convert data to string if object
      const plaintext = typeof data === 'string' ? data : JSON.stringify(data);
      
      // Generate random IV
      const iv = window.crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
      
      // Encrypt the data
      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: this.ALGORITHM,
          iv: iv,
        },
        key,
        new TextEncoder().encode(plaintext)
      );

      // Extract encrypted data and auth tag
      const encryptedArray = new Uint8Array(encrypted);
      const encryptedData = encryptedArray.slice(0, -16); // All but last 16 bytes
      const authTag = encryptedArray.slice(-16); // Last 16 bytes

      return {
        encryptedData: this.arrayBufferToBase64(encryptedData),
        iv: this.arrayBufferToBase64(iv),
        authTag: this.arrayBufferToBase64(authTag),
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt document data');
    }
  }

  /**
   * Decrypt document data received from server
   */
  static async decryptDocument(
    encryptedData: string,
    iv: string,
    authTag: string,
    key: CryptoKey
  ): Promise<any> {
    try {
      // Convert base64 back to ArrayBuffer
      const encrypted = new Uint8Array([
        ...Array.from(this.base64ToArrayBuffer(encryptedData)),
        ...Array.from(this.base64ToArrayBuffer(authTag))
      ]);

      // Decrypt the data
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: this.ALGORITHM,
          iv: this.base64ToArrayBuffer(iv),
        },
        key,
        encrypted
      );

      // Convert back to string and parse if JSON
      const plaintext = new TextDecoder().decode(decrypted);
      
      try {
        return JSON.parse(plaintext);
      } catch {
        return plaintext; // Return as string if not valid JSON
      }
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt document data');
    }
  }

  /**
   * Derive key from user password for key encryption
   */
  static async deriveKeyFromPassword(
    password: string,
    salt: Uint8Array
  ): Promise<CryptoKey> {
    // Import password as key material
    const passwordKey = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    // Derive actual encryption key
    return await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      passwordKey,
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Generate salt for password-based key derivation
   */
  static generateSalt(): Uint8Array {
    return window.crypto.getRandomValues(new Uint8Array(16));
  }

  // Utility functions
  private static arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private static base64ToArrayBuffer(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
}

/**
 * Secure Document Manager - High-level interface for document encryption
 */
export class SecureDocumentManager {
  private userKey: CryptoKey | null = null;

  /**
   * Initialize with user's encryption key (derived from password)
   */
  async initializeUser(password: string, salt?: Uint8Array): Promise<void> {
    const actualSalt = salt || DocumentEncryption.generateSalt();
    this.userKey = await DocumentEncryption.deriveKeyFromPassword(password, actualSalt);
    
    // Store salt in localStorage for future sessions (NOT the key!)
    localStorage.setItem('nextera_salt', DocumentEncryption.prototype.constructor.prototype.arrayBufferToBase64.call(null, actualSalt));
  }

  /**
   * Securely create will data with client-side encryption
   */
  async createSecureWill(willData: any): Promise<{
    encryptedWill: any;
    keyFingerprint: string;
  }> {
    if (!this.userKey) {
      throw new Error('User encryption key not initialized');
    }

    const encrypted = await DocumentEncryption.encryptDocument(willData, this.userKey);
    
    // Create key fingerprint for verification (not the actual key!)
    const keyBuffer = await DocumentEncryption.exportKey(this.userKey);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', keyBuffer);
    const keyFingerprint = DocumentEncryption.prototype.constructor.prototype.arrayBufferToBase64.call(null, hashBuffer.slice(0, 8));

    return {
      encryptedWill: encrypted,
      keyFingerprint
    };
  }

  /**
   * Decrypt will data for user viewing
   */
  async decryptWill(encryptedWill: any): Promise<any> {
    if (!this.userKey) {
      throw new Error('User encryption key not initialized');
    }

    return await DocumentEncryption.decryptDocument(
      encryptedWill.encryptedData,
      encryptedWill.iv,
      encryptedWill.authTag,
      this.userKey
    );
  }
}

// Export singleton instance
export const secureDocumentManager = new SecureDocumentManager();