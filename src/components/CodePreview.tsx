import { useMemo, useState, useEffect, useRef, useCallback } from "react";

interface CodePreviewProps {
  code: string;
  className?: string;
  pauseOnIdle?: boolean;
}

const CodePreview = ({ code, className = "", pauseOnIdle = false }: CodePreviewProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeKey = useRef(0);
  
  // Quando hover muda, comunicar com iframe ou recriar
  useEffect(() => {
    if (!pauseOnIdle) return;
    
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    
    if (isHovered) {
      // Esconder snapshot e reiniciar animação
      iframeKey.current += 1;
      iframe.contentWindow.postMessage({ type: 'PLAY' }, '*');
    } else {
      // Capturar snapshot e parar
      iframe.contentWindow.postMessage({ type: 'CAPTURE_AND_STOP' }, '*');
    }
  }, [isHovered, pauseOnIdle]);
  
  // Escutar mensagens do iframe (snapshot capturado)
  useEffect(() => {
    if (!pauseOnIdle) return;
    
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'SNAPSHOT') {
        setSnapshot(e.data.dataUrl);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [pauseOnIdle]);

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
            
            body.hidden-content #container {
              visibility: hidden;
            }
          </style>
        </head>
        <body>
          <div id="container">
            <div id="scaler">
              <div id="content">
                ${code}
              </div>
            </div>
          </div>

          <script>
            let isPlaying = ${!pauseOnIdle};
            let savedScale = 1;
            let savedOffsetX = 0;
            let savedOffsetY = 0;
            
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
                left, top, right, bottom,
                width: right - left,
                height: bottom - top,
                cx: (left + right) / 2,
                cy: (top + bottom) / 2
              };
            }

            // Reiniciar todas as animações
            function restartAnimations() {
              const content = document.getElementById('content');
              if (!content) return;
              
              const elements = content.querySelectorAll('*');
              elements.forEach(el => {
                const anim = el.style.animation;
                el.style.animation = 'none';
                el.offsetHeight; // Force reflow
                el.style.animation = anim || '';
              });
              
              // Também para elementos com classes de animação
              const animatedEls = content.querySelectorAll('[class*="animate-"]');
              animatedEls.forEach(el => {
                const classes = el.className;
                el.className = '';
                el.offsetHeight;
                el.className = classes;
              });
            }

            async function measureAndFit() {
              const container = document.getElementById('container');
              const scaler = document.getElementById('scaler');
              const content = document.getElementById('content');
              if (!container || !scaler || !content) return;

              container.style.transform = 'translate(-50%, -50%)';
              scaler.style.transform = 'scale(1)';
              
              await new Promise(r => requestAnimationFrame(r));

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
              
              const viewW = window.innerWidth;
              const viewH = window.innerHeight;
              const padding = 30;
              
              const availableW = viewW - padding;
              const availableH = viewH - padding;
              
              savedScale = 1;
              if (totalW > availableW || totalH > availableH) {
                const scaleX = availableW / totalW;
                const scaleY = availableH / totalH;
                savedScale = Math.min(scaleX, scaleY);
              }
              
              scaler.style.transform = 'scale(' + savedScale + ')';
              
              const screenCx = viewW / 2;
              const screenCy = viewH / 2;
              
              savedOffsetX = screenCx - animCx;
              savedOffsetY = screenCy - animCy;
              container.style.transform = 'translate(calc(-50% + ' + savedOffsetX + 'px), calc(-50% + ' + savedOffsetY + 'px))';
              
              // Se pauseOnIdle, capturar snapshot inicial e esconder
              if (${pauseOnIdle}) {
                await captureSnapshot();
                document.body.classList.add('hidden-content');
              }
              
              keepCentered();
            }

            async function captureSnapshot() {
              try {
                const { default: html2canvas } = await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm');
                const canvas = await html2canvas(document.body, {
                  backgroundColor: null,
                  scale: 2
                });
                const dataUrl = canvas.toDataURL('image/png');
                window.parent.postMessage({ type: 'SNAPSHOT', dataUrl }, '*');
              } catch (e) {
                console.error('Snapshot failed', e);
              }
            }

            function keepCentered() {
              if (!isPlaying) {
                requestAnimationFrame(keepCentered);
                return;
              }
              
              const container = document.getElementById('container');
              const content = document.getElementById('content');
              if (!container || !content) return;
              
              const b = getAllBounds(content);
              const viewW = window.innerWidth;
              const viewH = window.innerHeight;
              
              const dx = (viewW / 2) - b.cx;
              const dy = (viewH / 2) - b.cy;
              
              container.style.transform = 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px))';
              
              requestAnimationFrame(keepCentered);
            }

            window.addEventListener('message', async (e) => {
              if (e.data?.type === 'PLAY') {
                isPlaying = true;
                document.body.classList.remove('hidden-content');
                restartAnimations();
              } else if (e.data?.type === 'CAPTURE_AND_STOP') {
                await captureSnapshot();
                isPlaying = false;
                document.body.classList.add('hidden-content');
              }
            });

            window.addEventListener('load', () => measureAndFit());
            setTimeout(measureAndFit, 50);
          </script>
        </body>
      </html>
    `;
    return htmlContent;
  }, [code, pauseOnIdle]);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnIdle) {
      setIsHovered(true);
    }
  }, [pauseOnIdle]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnIdle) {
      setIsHovered(false);
    }
  }, [pauseOnIdle]);

  return (
    <div 
      className={`relative rounded-lg overflow-hidden border border-border bg-muted/30 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Snapshot estático quando não hover */}
      {pauseOnIdle && snapshot && !isHovered && (
        <img 
          src={snapshot} 
          alt="Preview"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      {/* Iframe com animação */}
      <iframe
        ref={iframeRef}
        srcDoc={previewHtml}
        className={`absolute inset-0 w-full h-full ${pauseOnIdle && !isHovered ? 'invisible' : 'visible'}`}
        sandbox="allow-scripts"
        title="Preview do elemento"
      />
    </div>
  );
};

export default CodePreview;
