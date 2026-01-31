import { useEffect } from "react";

/**
 * Hook to apply client-side security measures
 * Note: True security headers must be set server-side
 */
export const useSecurityHeaders = () => {
  useEffect(() => {
    // Note: Iframe detection disabled for Lovable preview compatibility
    // In production with your own domain, you can re-enable this

    // Disable drag and drop to prevent file-based attacks
    const preventDragDrop = (e: DragEvent) => {
      // Allow drag/drop only on designated drop zones
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropzone="true"]')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Prevent form autocomplete on sensitive fields
    const disableAutocomplete = () => {
      document.querySelectorAll('input[type="password"], input[name*="card"], input[name*="cvv"]')
        .forEach(input => {
          input.setAttribute('autocomplete', 'off');
        });
    };

    // Monitor for suspicious console activity
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        // DevTools might be open - just log, don't block
        console.log('[Security] DevTools detected');
      }
    };

    // Add security event listeners
    document.addEventListener('dragover', preventDragDrop);
    document.addEventListener('drop', preventDragDrop);
    
    // Initial checks
    disableAutocomplete();
    
    // Periodic checks
    const interval = setInterval(detectDevTools, 5000);

    // Cleanup
    return () => {
      document.removeEventListener('dragover', preventDragDrop);
      document.removeEventListener('drop', preventDragDrop);
      clearInterval(interval);
    };
  }, []);
};

/**
 * Security configuration for the application
 */
export const SECURITY_CONFIG = {
  // Session timeout in milliseconds (30 minutes)
  SESSION_TIMEOUT: 30 * 60 * 1000,
  
  // Maximum failed login attempts before lockout
  MAX_LOGIN_ATTEMPTS: 5,
  
  // Lockout duration in milliseconds (15 minutes)
  LOCKOUT_DURATION: 15 * 60 * 1000,
  
  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBER: true,
  PASSWORD_REQUIRE_SPECIAL: false,
  
  // Rate limiting (requests per minute)
  RATE_LIMIT: 60,
  
  // File upload restrictions
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'],
  
  // Content restrictions
  MAX_INPUT_LENGTH: 10000,
  MAX_URL_LENGTH: 2048,
};

/**
 * Check if current connection is secure (HTTPS)
 */
export const isSecureConnection = (): boolean => {
  return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
};

/**
 * Generate a cryptographically secure random string
 */
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Hash a string using SHA-256 (for non-sensitive data only)
 */
export const hashString = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
};
