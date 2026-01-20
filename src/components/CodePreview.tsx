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
            function getFullBounds(el) {
              let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
              
              const rect = el.getBoundingClientRect();
              left = Math.min(left, rect.left);
              top = Math.min(top, rect.top);
              right = Math.max(right, rect.right);
              bottom = Math.max(bottom, rect.bottom);
              
              el.querySelectorAll('*').forEach(child => {
                const r = child.getBoundingClientRect();
                if (r.width === 0 && r.height === 0) return;
                left = Math.min(left, r.left);
                top = Math.min(top, r.top);
                right = Math.max(right, r.right);
                bottom = Math.max(bottom, r.bottom);
              });
              
              return {
                left: left,
                top: top,
                right: right,
                bottom: bottom,
                width: right - left,
                height: bottom - top,
                cx: (left + right) / 2,
                cy: (top + bottom) / 2
              };
            }

            async function fitAndCenter() {
              const content = document.getElementById('content');
              const wrapper = document.querySelector('.preview-wrapper');
              if (!content || !wrapper) return;

              // Reset
              content.style.transform = 'scale(1)';
              wrapper.style.transform = 'translate(-50%, -50%)';
              
              await new Promise(r => requestAnimationFrame(r));

              // Medir por 1.5s para pegar o tamanho máximo da animação
              let minL = Infinity, minT = Infinity, maxR = -Infinity, maxB = -Infinity;
              const start = performance.now();
              
              while (performance.now() - start < 1500) {
                const bounds = getFullBounds(content);
                minL = Math.min(minL, bounds.left);
                minT = Math.min(minT, bounds.top);
                maxR = Math.max(maxR, bounds.right);
                maxB = Math.max(maxB, bounds.bottom);
                await new Promise(r => requestAnimationFrame(r));
              }

              const maxW = maxR - minL;
              const maxH = maxB - minT;
              const maxCx = (minL + maxR) / 2;
              const maxCy = (minT + maxB) / 2;

              const viewW = window.innerWidth;
              const viewH = window.innerHeight;
              const padding = 20;

              const scaleX = (viewW - padding) / maxW;
              const scaleY = (viewH - padding) / maxH;
              
              let scale = Math.min(scaleX, scaleY, 1);
              scale = Math.max(scale, 0.4);

              content.style.transform = 'scale(' + scale + ')';

              // Recalcular centro após escala e ajustar posição
              await new Promise(r => requestAnimationFrame(r));
              
              const screenCx = viewW / 2;
              const screenCy = viewH / 2;
              
              // Pegar o centro atual do conteúdo escalado
              const newBounds = getFullBounds(content);
              const offsetX = screenCx - newBounds.cx;
              const offsetY = screenCy - newBounds.cy;
              
              wrapper.style.transform = 'translate(calc(-50% + ' + offsetX + 'px), calc(-50% + ' + offsetY + 'px))';
            }

            window.addEventListener('load', () => {
              fitAndCenter();
            });
            
            setTimeout(fitAndCenter, 100);
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
