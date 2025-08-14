import crypto from 'crypto';

/**
 * Secure token encryption and decryption utilities
 * Uses AES-256-CBC encryption for storing sensitive platform tokens
 */

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET || 'fallback-key-for-development';

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
  console.warn('⚠️  WARNING: ENCRYPTION_KEY should be at least 32 characters long for production use');
}

/**
 * Encrypt a token for secure storage
 */
export function encryptToken(token: string): string {
  try {
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(ALGORITHM, key);
    
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Token encryption failed:', error);
    throw new Error('Failed to encrypt token');
  }
}

/**
 * Decrypt a token for API usage
 */
export function decryptToken(encryptedToken: string): string {
  try {
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const [ivHex, encrypted] = encryptedToken.split(':');
    
    if (!ivHex || !encrypted) {
      throw new Error('Invalid encrypted token format');
    }
    
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipher(ALGORITHM, key);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Token decryption failed:', error);
    throw new Error('Failed to decrypt token');
  }
}

/**
 * Check if a token is encrypted
 */
export function isEncrypted(token: string): boolean {
  return token.includes(':') && token.split(':').length === 2;
}

/**
 * Safely decrypt a token (returns original if not encrypted)
 */
export function safeDecryptToken(token: string): string {
  if (isEncrypted(token)) {
    return decryptToken(token);
  }
  return token;
}

/**
 * Generate a secure random string for webhook verification tokens
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash a string for comparison (e.g., webhook verification)
 */
export function hashString(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}
