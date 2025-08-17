/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */
/**
 * Article ID Encoder/Decoder Utility
 * 
 * This utility provides functions to encode and decode article IDs for URL security.
 * It creates long, obfuscated IDs that are harder to guess or enumerate.
 */

// Secret key for encoding (in production, this should be in environment variables)
const SECRET_KEY = 'xblog_secret_2024_v1';

/**
 * Simple hash function to create a consistent hash from a string
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash &= hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Base62 encoding for shorter, URL-safe strings
 */
const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function toBase62(num: number): string {
  if (num === 0) return '0';
  
  let result = '';
  while (num > 0) {
    result = BASE62_CHARS[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

function fromBase62(str: string): number {
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const value = BASE62_CHARS.indexOf(char);
    if (value === -1) throw new Error('Invalid Base62 character');
    result = result * 62 + value;
  }
  return result;
}

/**
 * Encode an article ID into a long, obfuscated string
 * 
 * @param articleId - The original article ID (number or string)
 * @returns Encoded string that can be used in URLs
 */
export function encodeArticleId(articleId: number | string): string {
  const id = typeof articleId === 'string' ? parseInt(articleId, 10) : articleId;
  
  if (Number.isNaN(id) || id <= 0) {
    throw new Error('Invalid article ID');
  }

  // Create a timestamp-based salt for uniqueness
  const timestamp = Date.now();
  const salt = timestamp % 10000; // Use last 4 digits of timestamp
  
  // Combine ID with salt and secret
  const combined = `${id}_${salt}_${SECRET_KEY}`;
  const hash = simpleHash(combined);
  
  // Create the encoded parts
  const encodedId = toBase62(id);
  const encodedSalt = toBase62(salt);
  const encodedHash = toBase62(hash);
  const encodedTimestamp = toBase62(Math.floor(timestamp / 1000)); // Use seconds for shorter string
  
  // Combine all parts with separators
  // Format: {hash}_{timestamp}_{id}_{salt}_{checksum}
  const checksum = simpleHash(`${encodedId}${encodedSalt}${encodedHash}`);
  const encodedChecksum = toBase62(checksum);
  
  return `${encodedHash}_${encodedTimestamp}_${encodedId}_${encodedSalt}_${encodedChecksum}`;
}

/**
 * Decode an encoded article ID back to the original ID
 * 
 * @param encodedId - The encoded article ID string
 * @returns Original article ID as number
 */
export function decodeArticleId(encodedId: string): number {
  try {
    const parts = encodedId.split('_');
    
    if (parts.length !== 5) {
      throw new Error('Invalid encoded ID format');
    }
    
    const [encodedHash, encodedTimestamp, encodedIdPart, encodedSalt, encodedChecksum] = parts;
    
    // Decode the parts
    const hash = fromBase62(encodedHash);
    const timestamp = fromBase62(encodedTimestamp);
    const id = fromBase62(encodedIdPart);
    const salt = fromBase62(encodedSalt);
    const checksum = fromBase62(encodedChecksum);
    
    // Verify checksum
    const expectedChecksum = simpleHash(`${encodedIdPart}${encodedSalt}${encodedHash}`);
    if (checksum !== expectedChecksum) {
      throw new Error('Invalid checksum - ID may be corrupted');
    }
    
    // Verify hash
    const combined = `${id}_${salt}_${SECRET_KEY}`;
    const expectedHash = simpleHash(combined);
    if (hash !== expectedHash) {
      throw new Error('Invalid hash - ID may be tampered with');
    }
    
    // Optional: Check if timestamp is reasonable (not too old)
    const currentTime = Math.floor(Date.now() / 1000);
    const maxAge = 365 * 24 * 60 * 60; // 1 year in seconds
    if (currentTime - timestamp > maxAge) {
      console.warn('Encoded ID is very old, but still valid');
    }
    
    return id;
  } catch (error) {
    throw new Error(`Failed to decode article ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Navigation helper function that automatically encodes article ID
 * 
 * @param navigate - React Router navigate function
 * @param articleId - Article ID to encode
 * @param basePath - Base path (default: '/generate')
 * @param additionalParams - Additional URL parameters
 */
export function navigateToArticle(
  navigate: (path: string) => void,
  articleId: number | string,
  basePath: string = '/generate',
  additionalParams?: Record<string, string>
): void {
  try {
    const encodedId = encodeArticleId(articleId);
    const params = new URLSearchParams();
    params.set('articleId', encodedId);
    
    // Add any additional parameters
    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        params.set(key, value);
      });
    }
    
    const url = `${basePath}?${params.toString()}`;
    navigate(url);
  } catch (error) {
    console.error('Failed to navigate to article:', error);
    // Fallback to original ID if encoding fails
    const params = new URLSearchParams();
    params.set('articleId', articleId.toString());
    
    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        params.set(key, value);
      });
    }
    
    const url = `${basePath}?${params.toString()}`;
    navigate(url);
  }
}

/**
 * Hook to get article ID from URL parameters (automatically decodes)
 * 
 * @param searchParams - URLSearchParams from useSearchParams
 * @returns Decoded article ID or null if not found/invalid
 */
export function getArticleIdFromParams(searchParams: URLSearchParams): number | null {
  const encodedId = searchParams.get('articleId');
  
  if (!encodedId) {
    return null;
  }
  
  try {
    // Try to decode the ID
    return decodeArticleId(encodedId);
  } catch (error) {
    console.warn('Failed to decode article ID, trying as plain number:', error);
    
    // Fallback: try to parse as plain number (for backward compatibility)
    const plainId = parseInt(encodedId, 10);
    if (!Number.isNaN(plainId) && plainId > 0) {
      return plainId;
    }
    
    return null;
  }
}
