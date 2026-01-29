/**
 * Cleans HTML code by extracting only the body content when a full HTML document is pasted.
 * This prevents conflicts with the CodePreview iframe which already provides the HTML structure.
 */
export function cleanHtmlCode(code: string): string {
  if (!code || typeof code !== 'string') {
    return code;
  }

  const trimmedCode = code.trim();
  console.log('[cleanHtmlCode] Input length:', trimmedCode.length);

  // Check if it's a full HTML document
  const hasDoctype = /<!DOCTYPE\s+html/i.test(trimmedCode);
  const hasHtmlTag = /<html[\s>]/i.test(trimmedCode);
  
  console.log('[cleanHtmlCode] Has DOCTYPE:', hasDoctype, 'Has HTML tag:', hasHtmlTag);
  
  if (!hasDoctype && !hasHtmlTag) {
    // Not a full document, return as-is
    console.log('[cleanHtmlCode] Not a full document, returning as-is');
    return trimmedCode;
  }

  // Extract content from body tag
  const bodyMatch = trimmedCode.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  console.log('[cleanHtmlCode] Body match found:', !!bodyMatch);
  
  if (bodyMatch && bodyMatch[1]) {
    let bodyContent = bodyMatch[1].trim();
    
    // Also extract any <style> tags from the head to preserve custom CSS
    const headMatch = trimmedCode.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    let styleTags = '';
    let externalScripts = '';
    
    if (headMatch && headMatch[1]) {
      const styleMatches = headMatch[1].match(/<style[^>]*>[\s\S]*?<\/style>/gi);
      if (styleMatches) {
        styleTags = styleMatches.join('\n');
      }
      
      // Also extract Google Fonts links
      const fontLinks = headMatch[1].match(/<link[^>]*fonts\.googleapis\.com[^>]*>/gi);
      if (fontLinks) {
        styleTags = fontLinks.join('\n') + '\n' + styleTags;
      }
      
      // Extract external script tags (CDN libraries like GSAP, but exclude Tailwind since it's already included)
      const scriptMatches = headMatch[1].match(/<script[^>]*src=["'][^"']+["'][^>]*><\/script>/gi);
      if (scriptMatches) {
        // Filter out Tailwind CDN since CodePreview already includes it
        const filteredScripts = scriptMatches.filter(script => !script.includes('tailwindcss.com'));
        externalScripts = filteredScripts.join('\n');
      }
    }
    
    // Combine external scripts, styles with body content
    let result = '';
    if (externalScripts) {
      result += externalScripts + '\n';
    }
    if (styleTags) {
      result += styleTags + '\n';
    }
    if (result) {
      result += bodyContent;
      console.log('[cleanHtmlCode] Result with scripts/styles, length:', result.length);
      return result;
    }
    
    console.log('[cleanHtmlCode] Result body only, length:', bodyContent.length);
    return bodyContent;
  }

  // Fallback: if no body found but it has html structure, try to extract meaningful content
  // Remove DOCTYPE and html/head tags
  let cleaned = trimmedCode
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<html[^>]*>/gi, '')
    .replace(/<\/html>/gi, '')
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
    .replace(/<body[^>]*>/gi, '')
    .replace(/<\/body>/gi, '')
    .trim();

  return cleaned || trimmedCode;
}
