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
            #mover {
              position: absolute;
              top: 0;
              left: 0;
              will-change: transform;
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
          <div id="mover">
            <div class="preview-content" id="content">
              ${code}
            </div>
          </div>

          <script>
            function getAllBounds(el) {
              let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
              
              function measure(node) {
                const r = node.getBoundingClientRect();
                if (r.width > 0 || r.height > 0) {
                  left = Math.min(left, r.left);
                  top = Math.min(top, r.top);
                  right = Math.max(right, r.right);
                  bottom = Math.max(bottom, r.bottom);
                }
              }
              
              measure(el);
              el.querySelectorAll('*').forEach(measure);
              
              if (!isFinite(left)) return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
              
              return {
                left,
                top,
                right,
                bottom,
                width: right - left,
                height: bottom - top,
                cx: (left + right) / 2,
                cy: (top + bottom) / 2
              };
            }

            async function centerContent() {
              const mover = document.getElementById('mover');
              const content = document.getElementById('content');
              if (!mover || !content) return;

              // Reset para medir tamanho real
              mover.style.transform = 'translate(0, 0)';
              content.style.transform = 'none';
              
              await new Promise(r => requestAnimationFrame(r));

              // Medir bounds máximos durante 1.2s de animação
              let minL = Infinity, minT = Infinity, maxR = -Infinity, maxB = -Infinity;
              const start = performance.now();
              
              while (performance.now() - start < 1200) {
                const b = getAllBounds(content);
                minL = Math.min(minL, b.left);
                minT = Math.min(minT, b.top);
                maxR = Math.max(maxR, b.right);
                maxB = Math.max(maxB, b.bottom);
                await new Promise(r => requestAnimationFrame(r));
              }

              const totalW = maxR - minL;
              const totalH = maxB - minT;
              
              // Centro do conteúdo animado
              const contentCx = minL + totalW / 2;
              const contentCy = minT + totalH / 2;
              
              // Centro da tela
              const screenCx = window.innerWidth / 2;
              const screenCy = window.innerHeight / 2;
              
              // Mover para centralizar
              const moveX = screenCx - contentCx;
              const moveY = screenCy - contentCy;
              
              mover.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
            }

            window.addEventListener('load', centerContent);
            setTimeout(centerContent, 50);
            setTimeout(centerContent, 200);
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
