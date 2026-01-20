import { useMemo } from "react";

interface CodePreviewProps {
  code: string;
  className?: string;
}

const CodePreview = ({ code, className = "" }: CodePreviewProps) => {
  const previewHtml = useMemo(() => {
    // Create a safe preview by wrapping the code
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            * {
              box-sizing: border-box;
            }
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
              overflow: hidden;
            }
            body {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .preview-wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              padding: 24px;
            }
            .preview-content {
              transform-origin: center center;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            @keyframes ping {
              75%, 100% {
                transform: scale(2);
                opacity: 0;
              }
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            @keyframes bounce {
              0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
              50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
            }
            .animate-spin {
              animation: spin 1s linear infinite;
            }
            .animate-ping {
              animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
            }
            .animate-pulse {
              animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            .animate-bounce {
              animation: bounce 1s infinite;
            }
          </style>
        </head>
        <body>
          <div class="preview-wrapper">
            <div class="preview-content" id="content">
              ${code}
            </div>
          </div>
          <script>
            function getMaxAnimatedSize(element) {
              // Get computed styles to detect animations
              const styles = window.getComputedStyle(element);
              const animation = styles.animation || styles.webkitAnimation || '';
              
              let maxScale = 1;
              
              // Check for ping animation (scales to 2x)
              if (animation.includes('ping')) {
                maxScale = Math.max(maxScale, 2);
              }
              
              // Check for bounce animation (moves up 25%)
              if (animation.includes('bounce')) {
                maxScale = Math.max(maxScale, 1.25);
              }
              
              // Check all children for animations too
              element.querySelectorAll('*').forEach(child => {
                const childStyles = window.getComputedStyle(child);
                const childAnimation = childStyles.animation || childStyles.webkitAnimation || '';
                
                if (childAnimation.includes('ping')) {
                  maxScale = Math.max(maxScale, 2);
                }
                if (childAnimation.includes('bounce')) {
                  maxScale = Math.max(maxScale, 1.25);
                }
              });
              
              return maxScale;
            }
            
            function scaleContent() {
              const wrapper = document.querySelector('.preview-wrapper');
              const content = document.getElementById('content');
              if (!wrapper || !content) return;
              
              // Reset scale first
              content.style.transform = 'scale(1)';
              
              const wrapperRect = wrapper.getBoundingClientRect();
              const contentRect = content.getBoundingClientRect();
              
              // Get available space (with padding)
              const availableWidth = wrapperRect.width - 48;
              const availableHeight = wrapperRect.height - 48;
              
              // Get the max animation scale factor
              const animationScale = getMaxAnimatedSize(content);
              
              // Calculate the effective size including animation expansion
              const effectiveWidth = contentRect.width * animationScale;
              const effectiveHeight = contentRect.height * animationScale;
              
              // Calculate scale needed
              const scaleX = availableWidth / effectiveWidth;
              const scaleY = availableHeight / effectiveHeight;
              
              let scale = Math.min(scaleX, scaleY, 1);
              
              // Apply scale
              content.style.transform = 'scale(' + scale + ')';
            }
            
            // Run on load and resize
            window.addEventListener('load', function() {
              setTimeout(scaleContent, 100);
              setTimeout(scaleContent, 300);
            });
            window.addEventListener('resize', scaleContent);
            
            // Run multiple times to catch dynamic content
            setTimeout(scaleContent, 50);
            setTimeout(scaleContent, 200);
            setTimeout(scaleContent, 500);
            setTimeout(scaleContent, 1000);
          </script>
        </body>
      </html>
    `;
    return htmlContent;
  }, [code]);

  return (
    <div className={`relative rounded-lg overflow-hidden border border-border bg-muted/30 ${className}`}>
      <iframe
        srcDoc={previewHtml}
        className="absolute inset-0 w-full h-full"
        sandbox="allow-scripts"
        title="Preview do elemento"
      />
    </div>
  );
};

export default CodePreview;
