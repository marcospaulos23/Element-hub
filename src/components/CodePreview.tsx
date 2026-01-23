import { useMemo, useRef, useCallback } from "react";

interface CodePreviewProps {
  code: string;
  className?: string;
}

const CodePreview = ({ code, className = "" }: CodePreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
              display: flex;
              justify-content: center;
              align-items: center;
            }
            #container {
              display: flex;
              justify-content: center;
              align-items: center;
            }
            #scaler {
              transform-origin: center center;
            }
            #content {
              display: flex;
              justify-content: center;
              align-items: center;
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
            
            /* Prevent button text from wrapping */
            button { white-space: nowrap; }
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
            async function measureAndFit() {
              const scaler = document.getElementById('scaler');
              const content = document.getElementById('content');
              if (!scaler || !content) return;

              // Reset scale
              scaler.style.transform = 'scale(1)';
              
              await new Promise(r => requestAnimationFrame(r));

              // Medir bounds máximos durante 1.5s de animação
              let maxW = 0, maxH = 0;
              const start = performance.now();
              
              while (performance.now() - start < 1500) {
                const b = content.getBoundingClientRect();
                maxW = Math.max(maxW, b.width);
                maxH = Math.max(maxH, b.height);
                await new Promise(r => requestAnimationFrame(r));
              }

              // Tamanho do viewport
              const viewW = window.innerWidth;
              const viewH = window.innerHeight;
              const padding = 8;
              
              // Calcular escala
              const availableW = viewW - padding;
              const availableH = viewH - padding;
              
              const scaleX = availableW / maxW;
              const scaleY = availableH / maxH;
              const scale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.6), 3.0);
              
              scaler.style.transform = 'scale(' + scale + ')';
            }

            // Função para reiniciar todas as animações
            function restartAnimations() {
              const content = document.getElementById('content');
              if (!content) return;
              
              // Seleciona todos os elementos dentro do content
              const allElements = content.querySelectorAll('*');
              allElements.forEach(el => {
                // Força o reinício das animações removendo e readicionando
                const computedStyle = window.getComputedStyle(el);
                const animationName = computedStyle.animationName;
                
                if (animationName && animationName !== 'none') {
                  el.style.animation = 'none';
                  el.offsetHeight; // Força reflow
                  el.style.animation = '';
                }
              });
              
              // Também reinicia animações do próprio content
              const contentStyle = window.getComputedStyle(content);
              if (contentStyle.animationName && contentStyle.animationName !== 'none') {
                content.style.animation = 'none';
                content.offsetHeight;
                content.style.animation = '';
              }
            }

            // Escuta mensagens do parent para reiniciar animações
            window.addEventListener('message', function(event) {
              if (event.data === 'restartAnimations') {
                restartAnimations();
              }
            });

            async function init() {
              await measureAndFit();
            }

            window.addEventListener('load', init);
            setTimeout(init, 100);
          </script>
        </body>
      </html>
    `;
    return htmlContent;
  }, [code]);

  // Handler para reiniciar animações quando o mouse sai
  const handleMouseLeave = useCallback(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage('restartAnimations', '*');
    }
  }, []);

  return (
    <div 
      className={`relative rounded-lg overflow-hidden border border-border bg-muted/30 ${className}`}
      onMouseLeave={handleMouseLeave}
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
