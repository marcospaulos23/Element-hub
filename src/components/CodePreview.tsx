import { useMemo } from "react";

interface CodePreviewProps {
  code: string;
  className?: string;
}

const CodePreview = ({ code, className = "" }: CodePreviewProps) => {
  const previewHtml = useMemo(() => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            * { box-sizing: border-box; }
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
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
            .preview-content {
              transform-origin: center center;
            }

            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes ping {
              75%, 100% { transform: scale(2); opacity: 0; }
            }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            @keyframes bounce {
              0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
              50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
            }
            .animate-spin { animation: spin 1s linear infinite; }
            .animate-ping { animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; }
            .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            .animate-bounce { animation: bounce 1s infinite; }
          </style>
        </head>
        <body>
          <div class="preview-wrapper">
            <div class="preview-content" id="content">
              ${code}
            </div>
          </div>

          <script>
            function getContentBounds(el) {
              const rect = el.getBoundingClientRect();
              let bounds = { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
              
              el.querySelectorAll('*').forEach(child => {
                const r = child.getBoundingClientRect();
                if (r.width === 0 && r.height === 0) return;
                bounds.left = Math.min(bounds.left, r.left);
                bounds.top = Math.min(bounds.top, r.top);
                bounds.right = Math.max(bounds.right, r.right);
                bounds.bottom = Math.max(bounds.bottom, r.bottom);
              });
              
              return {
                width: bounds.right - bounds.left,
                height: bounds.bottom - bounds.top
              };
            }

            async function fitContent() {
              const content = document.getElementById('content');
              if (!content) return;

              content.style.transform = 'scale(1)';
              
              await new Promise(r => requestAnimationFrame(r));

              // Medir por 1.5s para pegar o tamanho máximo da animação
              let maxW = 0, maxH = 0;
              const start = performance.now();
              
              while (performance.now() - start < 1500) {
                const bounds = getContentBounds(content);
                maxW = Math.max(maxW, bounds.width);
                maxH = Math.max(maxH, bounds.height);
                await new Promise(r => requestAnimationFrame(r));
              }

              const viewW = window.innerWidth;
              const viewH = window.innerHeight;
              const padding = 40;

              const scaleX = (viewW - padding) / maxW;
              const scaleY = (viewH - padding) / maxH;
              
              // Escala entre 0.5 e 1 para não ficar muito pequeno nem muito grande
              let scale = Math.min(scaleX, scaleY, 1);
              scale = Math.max(scale, 0.5);

              content.style.transform = 'scale(' + scale + ')';
            }

            window.addEventListener('load', () => {
              fitContent();
            });
            
            setTimeout(fitContent, 100);
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
