import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Cloudflare IP ranges (IPv4) - Updated list
// https://www.cloudflare.com/ips-v4
const CLOUDFLARE_IPS = [
  "173.245.48.0/20",
  "103.21.244.0/22",
  "103.22.200.0/22",
  "103.31.4.0/22",
  "141.101.64.0/18",
  "108.162.192.0/18",
  "190.93.240.0/20",
  "188.114.96.0/20",
  "197.234.240.0/22",
  "198.41.128.0/17",
  "162.158.0.0/15",
  "104.16.0.0/13",
  "104.24.0.0/14",
  "172.64.0.0/13",
  "131.0.72.0/22"
];

// Security headers configuration
const securityHeaders = {
  // HSTS - Force HTTPS for 1 year, include subdomains
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  
  // Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",
  
  // Prevent clickjacking
  "X-Frame-Options": "DENY",
  
  // XSS Protection (legacy but still useful)
  "X-XSS-Protection": "1; mode=block",
  
  // Referrer Policy - Don't leak referrer to other origins
  "Referrer-Policy": "strict-origin-when-cross-origin",
  
  // Permissions Policy - Restrict browser features
  "Permissions-Policy": "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  
  // Content Security Policy - Strict CSP
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "media-src 'self' https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://fonts.googleapis.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join("; "),
  
  // Hide server information
  "X-Powered-By": "",
  "Server": "",
  
  // Cross-Origin policies
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp"
};

// CORS headers for the function itself
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Check if IP is in CIDR range
function ipInCidr(ip: string, cidr: string): boolean {
  const [range, bits] = cidr.split('/');
  const mask = ~(2 ** (32 - parseInt(bits)) - 1);
  
  const ipToInt = (ipStr: string) => 
    ipStr.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct), 0) >>> 0;
  
  const ipInt = ipToInt(ip);
  const rangeInt = ipToInt(range);
  
  return (ipInt & mask) === (rangeInt & mask);
}

// Check if request comes from Cloudflare
function isFromCloudflare(ip: string): boolean {
  return CLOUDFLARE_IPS.some(cidr => ipInCidr(ip, cidr));
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get client IP from various headers
    const cfConnectingIp = req.headers.get('cf-connecting-ip');
    const xForwardedFor = req.headers.get('x-forwarded-for');
    const xRealIp = req.headers.get('x-real-ip');
    
    // Determine if request comes through Cloudflare
    const isCloudflare = !!cfConnectingIp;
    
    // Log security info (for monitoring)
    console.log('[Security] Request info:', {
      isCloudflare,
      cfConnectingIp,
      userAgent: req.headers.get('user-agent')?.substring(0, 50),
      method: req.method,
      url: req.url
    });

    // Return security configuration and headers
    const response = {
      success: true,
      headers: securityHeaders,
      cloudflare: {
        detected: isCloudflare,
        clientIp: cfConnectingIp || 'unknown'
      },
      recommendations: [
        "Configure HSTS in Cloudflare dashboard",
        "Enable 'Always Use HTTPS' in Cloudflare",
        "Set SSL/TLS to 'Full (strict)' mode",
        "Enable 'Automatic HTTPS Rewrites'",
        "Configure WAF rules in Cloudflare",
        "Enable Bot Fight Mode",
        "Use Access rules to whitelist admin IPs"
      ]
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          ...securityHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('[Security] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Security check failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
