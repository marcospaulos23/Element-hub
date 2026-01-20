import { useMemo, useState, useEffect, useRef } from "react";

interface CodePreviewProps {
  code: string;
  className?: string;
  pauseOnIdle?: boolean;
}

const CodePreview = ({ code, className = "", pauseOnIdle = false }: CodePreviewProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Comunicar com o iframe sobre o estado de pausa
  useEffect(() => {
    if (!pauseOnIdle) return;
    
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    
    try {
      iframe.contentWindow.postMessage({ type: 'SET_PAUSED', paused: !isHovered }, '*');
    } catch (e) {
      // Ignore cross-origin errors
    }
  }, [isHovered, pauseOnIdle]);

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
            #container {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
            #scaler {
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
            
            /* Estado pausado */
            body.paused * {
              animation-play-state: paused !important;
              transition: none !important;
            }
          </style>
        </head>
        <body class="${pauseOnIdle ? 'paused' : ''}">
          <div id="container">
            <div id="scaler">
              <div id="content">
                ${code}
              </div>
            </div>
          </div>

          <script>
            let isPaused = ${pauseOnIdle ? 'true' : 'false'};
            let rafId = null;
            
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
              
              if (!isFinite(left)) return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, cx: 0, cy: 0 };
              
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

            let currentScale = 1;
            let offsetX = 0;
            let offsetY = 0;

            async function measureAndFit() {
              const container = document.getElementById('container');
              const scaler = document.getElementById('scaler');
              const content = document.getElementById('content');
              if (!container || !scaler || !content) return;

              // Reset
              container.style.transform = 'translate(-50%, -50%)';
              scaler.style.transform = 'scale(1)';
              
              // Temporariamente despausar para medir
              document.body.classList.remove('paused');
              
              await new Promise(r => requestAnimationFrame(r));

              // Medir bounds máximos durante 1.5s de animação
              let minL = Infinity, minT = Infinity, maxR = -Infinity, maxB = -Infinity;
              const start = performance.now();
              
              while (performance.now() - start < 1500) {
                const b = getAllBounds(content);
                minL = Math.min(minL, b.left);
                minT = Math.min(minT, b.top);
                maxR = Math.max(maxR, b.right);
                maxB = Math.max(maxB, b.bottom);
                await new Promise(r => requestAnimationFrame(r));
              }

              const totalW = maxR - minL;
              const totalH = maxB - minT;
              const animCx = (minL + maxR) / 2;
              const animCy = (minT + maxB) / 2;
              
              // Tamanho do viewport
              const viewW = window.innerWidth;
              const viewH = window.innerHeight;
              const padding = 30;
              
              // Calcular escala
              const availableW = viewW - padding;
              const availableH = viewH - padding;
              
              currentScale = 1;
              if (totalW > availableW || totalH > availableH) {
                const scaleX = availableW / totalW;
                const scaleY = availableH / totalH;
                currentScale = Math.min(scaleX, scaleY);
              }
              
              scaler.style.transform = 'scale(' + currentScale + ')';
              
              // Centro da tela
              const screenCx = viewW / 2;
              const screenCy = viewH / 2;
              
              // Calcular offset para centralizar o centro da animação no centro da tela
              offsetX = screenCx - animCx;
              offsetY = screenCy - animCy;
              
              // Restaurar estado pausado se necessário
              if (isPaused) {
                document.body.classList.add('paused');
              }
            }

            function keepCentered() {
              if (isPaused) {
                rafId = requestAnimationFrame(keepCentered);
                return;
              }
              
              const container = document.getElementById('container');
              const content = document.getElementById('content');
              if (!container || !content) return;
              
              const b = getAllBounds(content);
              const viewW = window.innerWidth;
              const viewH = window.innerHeight;
              
              // Ajustar posição continuamente para manter no centro
              const dx = (viewW / 2) - b.cx;
              const dy = (viewH / 2) - b.cy;
              
              container.style.transform = 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px))';
              
              rafId = requestAnimationFrame(keepCentered);
            }

            // Escutar mensagens do React
            window.addEventListener('message', (e) => {
              if (e.data && e.data.type === 'SET_PAUSED') {
                isPaused = e.data.paused;
                if (isPaused) {
                  document.body.classList.add('paused');
                } else {
                  document.body.classList.remove('paused');
                }
              }
            });

            async function init() {
              await measureAndFit();
              keepCentered();
            }

            window.addEventListener('load', init);
            setTimeout(init, 100);
          </script>
        </body>
      </html>
    `;
    return htmlContent;
  }, [code, pauseOnIdle]);

  return (
    <div 
      className={`relative rounded-lg overflow-hidden border border-border bg-muted/30 ${className}`}
      onMouseEnter={() => pauseOnIdle && setIsHovered(true)}
      onMouseLeave={() => pauseOnIdle && setIsHovered(false)}
    >
      <iframe
        ref={iframeRef}
        srcDoc={previewHtml}
        className="absolute inset-0 w-full h-full"
        sandbox="allow-scripts"
        title="Preview do elemento"
      />
    </div>
  );
};

export default CodePreview;
