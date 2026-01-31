/**
 * Security module exports
 * Centralized security utilities for the application
 */

export * from './inputSanitizer';

// Re-export security hooks
export { useSecurityHeaders, SECURITY_CONFIG, isSecureConnection, generateSecureToken, hashString } from '@/hooks/useSecurityHeaders';
