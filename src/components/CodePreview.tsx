import { useCallback, useMemo, useRef } from "react";

interface CodePreviewProps {
  code: string;
  className?: string;
  /**
   * Quando true (usado no grid do repositório):
   * - ao carregar: roda um instante e congela ("print" = frame atual)
   * - ao hover: reinicia do início e roda
   * - ao sair do hover: congela no frame atual
   */
  pauseOnIdle?: boolean;
}

const CodePreview = ({ code, className = "", pauseOnIdle = false }: CodePreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const postToIframe = useCallback((message: unknown) => {
    try {
      iframeRef.current?.contentWindow?.postMessage(message, "*");
    } catch {
      // noop
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!pauseOnIdle) return;
    postToIframe({ type: "PLAY_FROM_START" });
  }, [pauseOnIdle, postToIframe]);

  const handleMouseLeave = useCallback(() => {
    if (!pauseOnIdle) return;
    postToIframe({ type: "FREEZE_FRAME" });
  }, [pauseOnIdle, postToIframe]);

  const previewHtml = useMemo(() => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
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
            #scaler { transform-origin: center center; }

            /* Pausa global (vira "print" do frame atual) */
            body.paused #content,
            body.paused #content * {
              animation-play-state: paused !important;
            }

            /* Tailwind-like animations (fallback) */
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
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
        <body class="${pauseOnIdle ? "paused" : ""}">
          <div id="container">
            <div id="scaler">
              <div id="content">${code}</div>
            </div>
          </div>

          <script>
            const HOVER_MODE = ${pauseOnIdle ? "true" : "false"};
            let rafId = null;
            let isPlaying = !HOVER_MODE;
            let savedScale = 1;

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

            function centerOnce() {
              const container = document.getElementById('container');
              const content = document.getElementById('content');
              if (!container || !content) return;
              const b = getAllBounds(content);
              const viewW = window.innerWidth;
              const viewH = window.innerHeight;
              const dx = (viewW / 2) - b.cx;
              const dy = (viewH / 2) - b.cy;
              container.style.transform = 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px))';
            }

            function tick() {
              if (!isPlaying) return;
              centerOnce();
              rafId = requestAnimationFrame(tick);
            }

            function startLoop() {
              if (rafId) cancelAnimationFrame(rafId);
              rafId = requestAnimationFrame(tick);
            }

            function stopLoop() {
              if (rafId) cancelAnimationFrame(rafId);
              rafId = null;
            }

            function freezeFrame() {
              // Mantém o frame atual visível ("print") e para o loop
              document.body.classList.add('paused');
              isPlaying = false;
              stopLoop();
            }

            function playFromStart() {
              const content = document.getElementById('content');
              const scaler = document.getElementById('scaler');
              if (!content) return;

              // Reinicia animações recriando o DOM do conteúdo
              const original = content.__originalMarkup || content.innerHTML;
              content.__originalMarkup = original;
              content.innerHTML = original;

              if (scaler) scaler.style.transform = 'scale(' + savedScale + ')';

              document.body.classList.remove('paused');
              isPlaying = true;
              startLoop();
            }

            async function measureAndFitOnce() {
              const scaler = document.getElementById('scaler');
              const content = document.getElementById('content');
              if (!scaler || !content) return;

              // se estiver em hover mode, temporariamente roda para medir e depois congela
              const wasPaused = document.body.classList.contains('paused');
              document.body.classList.remove('paused');

              let minL = Infinity, minT = Infinity, maxR = -Infinity, maxB = -Infinity;
              const start = performance.now();

              while (performance.now() - start < 650) {
                const b = getAllBounds(content);
                minL = Math.min(minL, b.left);
                minT = Math.min(minT, b.top);
                maxR = Math.max(maxR, b.right);
                maxB = Math.max(maxB, b.bottom);
                await new Promise(r => requestAnimationFrame(r));
              }

              const totalW = maxR - minL;
              const totalH = maxB - minT;

              const viewW = window.innerWidth;
              const viewH = window.innerHeight;
              const padding = 30;
              const availableW = viewW - padding;
              const availableH = viewH - padding;

              savedScale = 1;
              if (totalW > availableW || totalH > availableH) {
                savedScale = Math.min(availableW / totalW, availableH / totalH);
              }

              scaler.style.transform = 'scale(' + savedScale + ')';

              if (wasPaused) document.body.classList.add('paused');
            }

            window.addEventListener('message', (e) => {
              if (!e.data || !e.data.type) return;
              if (e.data.type === 'PLAY_FROM_START') playFromStart();
              if (e.data.type === 'FREEZE_FRAME') freezeFrame();
            });

            async function init() {
              const content = document.getElementById('content');
              if (content && !content.__originalMarkup) content.__originalMarkup = content.innerHTML;

              await measureAndFitOnce();

              if (HOVER_MODE) {
                // gera um "print" inicial sem deixar tudo rodando
                playFromStart();
                setTimeout(() => freezeFrame(), 200);
              } else {
                document.body.classList.remove('paused');
                isPlaying = true;
                startLoop();
              }
            }

            window.addEventListener('load', init);
            setTimeout(init, 60);
          </script>
        </body>
      </html>
    `;

    return htmlContent;
  }, [code, pauseOnIdle]);

  return (
    <div
      className={`relative rounded-lg overflow-hidden border border-border bg-muted/30 ${className}`}
      onMouseEnter={handleMouseEnter}
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
