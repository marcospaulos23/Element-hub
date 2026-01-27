/**
 * Converts React/JSX code to HTML
 * Handles common JSX patterns and transforms them to valid HTML
 */
export function convertJsxToHtml(code: string): { html: string; wasConverted: boolean } {
  // Check if it looks like JSX/React code
  const jsxPatterns = [
    /className=/,
    /onClick=\{/,
    /onChange=\{/,
    /onSubmit=\{/,
    /\{\/\*.*\*\/\}/,  // JSX comments
    /const\s+\w+\s*=/,
    /function\s+\w+/,
    /=>\s*\{/,
    /=>\s*\(/,
    /import\s+/,
    /export\s+(default\s+)?/,
    /return\s*\(/,
    /<\w+\s+[^>]*\{[^}]+\}/,  // JSX expressions in attributes
  ];

  const isJsx = jsxPatterns.some(pattern => pattern.test(code));

  if (!isJsx) {
    return { html: code, wasConverted: false };
  }

  let html = code;

  // Remove import statements
  html = html.replace(/import\s+.*?from\s+['"][^'"]+['"];?\s*/g, '');
  html = html.replace(/import\s+['"][^'"]+['"];?\s*/g, '');

  // Remove export statements
  html = html.replace(/export\s+default\s+\w+;?\s*/g, '');
  html = html.replace(/export\s+\{[^}]*\};?\s*/g, '');

  // Extract JSX from React component patterns
  const componentPatterns = [
    // Arrow function component: const Name = () => ( ... ) or => { return ( ... ) }
    /(?:const|let|var)\s+\w+\s*=\s*(?:\([^)]*\)|[^=])*=>\s*\(\s*([\s\S]*?)\s*\)\s*;?\s*$/,
    /(?:const|let|var)\s+\w+\s*=\s*(?:\([^)]*\)|[^=])*=>\s*\{\s*return\s*\(\s*([\s\S]*?)\s*\)\s*;?\s*\}\s*;?\s*$/,
    // Function component: function Name() { return ( ... ) }
    /function\s+\w+\s*\([^)]*\)\s*\{\s*return\s*\(\s*([\s\S]*?)\s*\)\s*;?\s*\}\s*$/,
  ];

  for (const pattern of componentPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      html = match[1].trim();
      break;
    }
  }

  // Remove simpler return statements
  html = html.replace(/return\s*\(\s*/g, '');
  html = html.replace(/\s*\)\s*;?\s*}\s*;?\s*$/g, '');
  html = html.replace(/^\s*\(\s*/g, '');
  html = html.replace(/\s*\)\s*;?\s*$/g, '');

  // Remove const/let/var declarations that might be left
  html = html.replace(/(?:const|let|var)\s+\w+\s*=\s*\([^)]*\)\s*=>\s*/g, '');
  html = html.replace(/(?:const|let|var)\s+\w+\s*=\s*function[^{]*\{[^}]*return\s*/g, '');

  // Convert className to class
  html = html.replace(/className=/g, 'class=');

  // Convert htmlFor to for
  html = html.replace(/htmlFor=/g, 'for=');

  // Remove JSX expression wrappers in simple cases
  // {" "} or {' '} -> space
  html = html.replace(/\{\s*["']\s*["']\s*\}/g, ' ');
  
  // Simple string expressions like {"text"} or {'text'}
  html = html.replace(/\{\s*["']([^"']+)["']\s*\}/g, '$1');

  // Remove event handlers: onClick={...}, onChange={...}, etc.
  html = html.replace(/\s+on[A-Z]\w*=\{[^}]*\}/g, '');

  // Remove ref={...}
  html = html.replace(/\s+ref=\{[^}]*\}/g, '');

  // Remove key={...}
  html = html.replace(/\s+key=\{[^}]*\}/g, '');

  // Convert style objects: style={{ color: 'red' }} -> style="color: red"
  html = html.replace(/style=\{\{([^}]+)\}\}/g, (_, styleContent) => {
    try {
      const cssString = styleContent
        .split(',')
        .map((prop: string) => {
          const [key, value] = prop.split(':').map((s: string) => s.trim());
          if (!key || !value) return '';
          // Convert camelCase to kebab-case
          const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          // Remove quotes from value
          const cssValue = value.replace(/["']/g, '');
          return `${cssKey}: ${cssValue}`;
        })
        .filter(Boolean)
        .join('; ');
      return `style="${cssString}"`;
    } catch {
      return '';
    }
  });

  // Remove remaining JSX expressions that we can't convert
  // But preserve template literal content
  html = html.replace(/\{`([^`]*)`\}/g, '$1');
  
  // Remove other complex expressions like {variable} or {condition && <element>}
  html = html.replace(/\{[^}]*\}/g, '');

  // Remove JSX comments {/* ... */}
  html = html.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

  // Remove React fragments
  html = html.replace(/<React\.Fragment>/g, '');
  html = html.replace(/<\/React\.Fragment>/g, '');
  html = html.replace(/<Fragment>/g, '');
  html = html.replace(/<\/Fragment>/g, '');
  html = html.replace(/<>/g, '');
  html = html.replace(/<\/>/g, '');

  // Self-closing tags that need to be proper HTML
  const voidElements = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'];
  
  // Convert self-closing non-void elements: <div /> -> <div></div>
  html = html.replace(/<(\w+)([^>]*?)\/>/g, (match, tag, attrs) => {
    if (voidElements.includes(tag.toLowerCase())) {
      return `<${tag}${attrs}>`;
    }
    return `<${tag}${attrs}></${tag}>`;
  });

  // Clean up whitespace
  html = html.replace(/^\s+|\s+$/g, '');
  html = html.replace(/\n\s*\n/g, '\n');

  // Remove any remaining JavaScript artifacts
  html = html.replace(/;\s*$/gm, '');
  html = html.replace(/^\s*}\s*$/gm, '');
  html = html.replace(/^\s*\)\s*$/gm, '');

  // Final cleanup
  html = html.trim();

  return { html, wasConverted: true };
}

/**
 * Checks if code appears to be JSX/React rather than HTML
 */
export function looksLikeJsx(code: string): boolean {
  const jsxIndicators = [
    /className=/,
    /\{[^}]+\}/,  // JSX expressions
    /const\s+\w+\s*=/,
    /function\s+\w+/,
    /=>\s*[\({]/,
    /import\s+/,
    /export\s+/,
    /return\s*\(/,
  ];

  return jsxIndicators.some(pattern => pattern.test(code));
}
