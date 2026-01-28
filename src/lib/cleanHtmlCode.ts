/**
 * Cleans HTML code by extracting only the body content when a full HTML document is pasted.
 * This prevents conflicts with the CodePreview iframe which already provides the HTML structure.
 */
export function cleanHtmlCode(code: string): string {
  if (!code || typeof code !== 'string') {
    return code;
  }

  const trimmedCode = code.trim();

  // Check if it's a full HTML document
  const hasDoctype = /<!DOCTYPE\s+html/i.test(trimmedCode);
  const hasHtmlTag = /<html[\s>]/i.test(trimmedCode);
  
  if (!hasDoctype && !hasHtmlTag) {
    // Not a full document, return as-is
    return trimmedCode;
  }

  // Extract content from body tag
  const bodyMatch = trimmedCode.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  
  if (bodyMatch && bodyMatch[1]) {
    let bodyContent = bodyMatch[1].trim();
    
    // Also extract any <style> tags from the head to preserve custom CSS
    const headMatch = trimmedCode.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    let styleTags = '';
    
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
    }
    
    // Combine styles with body content
    if (styleTags) {
      return styleTags + '\n' + bodyContent;
    }
    
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
