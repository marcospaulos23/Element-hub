import { z } from "zod";

/**
 * Security utilities for input sanitization and validation
 * Prevents SQL Injection, XSS, and other injection attacks
 */

// Common dangerous patterns for SQL Injection
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|EXEC|UNION|SCRIPT)\b)/gi,
  /(--)|(\/\*)|(\*\/)|(\bOR\b\s+\d+\s*=\s*\d+)|(\bAND\b\s+\d+\s*=\s*\d+)/gi,
  /(;|\||&&|`|\$\(|\${)/g,
  /(\bCHAR\s*\()|(\bCONCAT\s*\()|(\bCONVERT\s*\()/gi,
];

// Common dangerous patterns for XSS
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
  /<link/gi,
  /<meta/gi,
  /data:/gi,
  /vbscript:/gi,
];

// Path traversal patterns
const PATH_TRAVERSAL_PATTERNS = [
  /\.\.\//g,
  /\.\.\\\\?/g,
  /%2e%2e%2f/gi,
  /%2e%2e\//gi,
  /\.%2e\//gi,
  /%2e\.\//gi,
];

/**
 * Check if string contains SQL injection patterns
 */
export function containsSqlInjection(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * Check if string contains XSS patterns
 */
export function containsXss(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  return XSS_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * Check if string contains path traversal patterns
 */
export function containsPathTraversal(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  return PATH_TRAVERSAL_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * Sanitize HTML by escaping dangerous characters
 */
export function escapeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };
  
  return input.replace(/[&<>"'`=/]/g, char => htmlEscapes[char] || char);
}

/**
 * Remove all HTML tags from string
 */
export function stripHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize input by removing dangerous patterns
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  let sanitized = input.trim();
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  
  // Remove SQL comments
  sanitized = sanitized.replace(/--/g, '').replace(/\/\*/g, '').replace(/\*\//g, '');
  
  // Remove script tags and event handlers
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  return sanitized;
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  
  try {
    const parsed = new URL(url);
    
    // Only allow http, https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    
    // Block javascript: URLs
    if (url.toLowerCase().includes('javascript:')) {
      return null;
    }
    
    return parsed.href;
  } catch {
    return null;
  }
}

/**
 * Validate email format strictly
 */
export function isValidEmail(email: string): boolean {
  const emailSchema = z.string().email().max(255);
  return emailSchema.safeParse(email).success;
}

/**
 * Create safe filename by removing dangerous characters
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') return '';
  
  return filename
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // Remove invalid chars
    .replace(/\.\./g, '') // Remove path traversal
    .replace(/^\.+/, '') // Remove leading dots
    .trim()
    .substring(0, 255); // Limit length
}

/**
 * Comprehensive input validation result
 */
export interface ValidationResult {
  isValid: boolean;
  sanitized: string;
  threats: string[];
}

/**
 * Perform comprehensive security validation on input
 */
export function validateInput(input: string, options?: {
  maxLength?: number;
  allowHtml?: boolean;
  allowSpecialChars?: boolean;
}): ValidationResult {
  const { maxLength = 10000, allowHtml = false, allowSpecialChars = true } = options || {};
  
  const threats: string[] = [];
  let sanitized = input || '';
  
  // Check for various attack patterns
  if (containsSqlInjection(sanitized)) {
    threats.push('SQL Injection pattern detected');
  }
  
  if (containsXss(sanitized)) {
    threats.push('XSS pattern detected');
  }
  
  if (containsPathTraversal(sanitized)) {
    threats.push('Path traversal pattern detected');
  }
  
  // Length check
  if (sanitized.length > maxLength) {
    threats.push(`Input exceeds maximum length of ${maxLength}`);
    sanitized = sanitized.substring(0, maxLength);
  }
  
  // Sanitize based on options
  sanitized = sanitizeInput(sanitized);
  
  if (!allowHtml) {
    sanitized = stripHtml(sanitized);
  }
  
  if (!allowSpecialChars) {
    sanitized = sanitized.replace(/[^\w\s\-_.@]/g, '');
  }
  
  return {
    isValid: threats.length === 0,
    sanitized,
    threats,
  };
}

/**
 * Zod schemas for common secure inputs
 */
export const secureSchemas = {
  // Safe text input (no HTML, limited length)
  safeText: z.string()
    .trim()
    .min(1, "Campo obrigatório")
    .max(1000, "Texto muito longo")
    .refine(val => !containsSqlInjection(val), "Caracteres inválidos detectados")
    .refine(val => !containsXss(val), "Conteúdo não permitido"),
  
  // Safe email
  safeEmail: z.string()
    .trim()
    .email("Email inválido")
    .max(255, "Email muito longo")
    .transform(val => val.toLowerCase()),
  
  // Safe URL
  safeUrl: z.string()
    .trim()
    .url("URL inválida")
    .max(2048, "URL muito longa")
    .refine(val => {
      try {
        const url = new URL(val);
        return ['http:', 'https:'].includes(url.protocol);
      } catch {
        return false;
      }
    }, "Protocolo de URL não permitido"),
  
  // Safe password (for validation, not storage)
  safePassword: z.string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .max(128, "Senha muito longa")
    .refine(val => /[A-Z]/.test(val), "Senha deve conter letra maiúscula")
    .refine(val => /[a-z]/.test(val), "Senha deve conter letra minúscula")
    .refine(val => /[0-9]/.test(val), "Senha deve conter número"),
  
  // Safe username
  safeUsername: z.string()
    .trim()
    .min(3, "Nome de usuário muito curto")
    .max(50, "Nome de usuário muito longo")
    .regex(/^[a-zA-Z0-9_-]+$/, "Nome de usuário contém caracteres inválidos"),
};
