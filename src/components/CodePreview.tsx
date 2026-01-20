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
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              padding: 0;
              overflow: hidden;
            }
            #transformer {
              will-change: transform;
            }
            .preview-content {
              position: relative;
              display: inline-block;
              transform-origin: center center;
              will-change: transform;
            }

            /* Minimal Tailwind animation compat */
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
          <div class="preview-wrapper" id="wrapper">
            <div id="transformer">
              <div class="preview-content" id="content">
                ${code}
              </div>
            </div>
          </div>

          <script>
            function unionRectFor(root) {
              const rects = [root.getBoundingClientRect()];
              const nodes = root.querySelectorAll ? root.querySelectorAll('*') : [];
              for (let i = 0; i < nodes.length; i++) {
                // Skip invisible nodes quickly (but keep opacity animations)
                const el = nodes[i];
                const cs = window.getComputedStyle(el);
                if (cs.display === 'none' || cs.visibility === 'hidden') continue;
                rects.push(el.getBoundingClientRect());
              }

              let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
              for (let i = 0; i < rects.length; i++) {
                const r = rects[i];
                if (!isFinite(r.left) || !isFinite(r.top) || !isFinite(r.right) || !isFinite(r.bottom)) continue;
                left = Math.min(left, r.left);
                top = Math.min(top, r.top);
                right = Math.max(right, r.right);
                bottom = Math.max(bottom, r.bottom);
              }

              if (!isFinite(left) || !isFinite(top) || !isFinite(right) || !isFinite(bottom)) {
                return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, cx: 0, cy: 0 };
              }

              const width = Math.max(0, right - left);
              const height = Math.max(0, bottom - top);
              return {
                left,
                top,
                right,
                bottom,
                width,
                height,
                cx: left + width / 2,
                cy: top + height / 2,
              };
            }

            function nextFrame() {
              return new Promise((resolve) => requestAnimationFrame(() => resolve()));
            }

            async function sampleMaxRect(root, ms) {
              const start = performance.now();
              let max = null;

              while (performance.now() - start < ms) {
                const r = unionRectFor(root);
                if (!max) {
                  max = r;
                } else {
                  max.left = Math.min(max.left, r.left);
                  max.top = Math.min(max.top, r.top);
                  max.right = Math.max(max.right, r.right);
                  max.bottom = Math.max(max.bottom, r.bottom);
                  max.width = Math.max(0, max.right - max.left);
                  max.height = Math.max(0, max.bottom - max.top);
                  max.cx = max.left + max.width / 2;
                  max.cy = max.top + max.height / 2;
                }
                await nextFrame();
              }

              return max || unionRectFor(root);
            }

            let centerRaf = null;

            function startCenterLoop() {
              const wrapper = document.getElementById('wrapper');
              const transformer = document.getElementById('transformer');
              const content = document.getElementById('content');
              if (!wrapper || !transformer || !content) return;

              if (centerRaf) cancelAnimationFrame(centerRaf);

              const tick = () => {
                const wrapperRect = wrapper.getBoundingClientRect();
                const rect = unionRectFor(content);

                const wrapperCx = wrapperRect.left + wrapperRect.width / 2;
                const wrapperCy = wrapperRect.top + wrapperRect.height / 2;

                const dx = wrapperCx - rect.cx;
                const dy = wrapperCy - rect.cy;

                transformer.style.transform = 'translate3d(' + dx + 'px, ' + dy + 'px, 0)';
                centerRaf = requestAnimationFrame(tick);
              };

              tick();
            }

            async function fitToPreview() {
              const wrapper = document.getElementById('wrapper');
              const transformer = document.getElementById('transformer');
              const content = document.getElementById('content');
              if (!wrapper || !transformer || !content) return;

              // Reset transforms
              transformer.style.transform = 'translate3d(0px, 0px, 0)';
              content.style.transform = 'scale(1)';

              // Give layout a frame
              await nextFrame();

              // Measure max animated bounds over ~2.2s (cobre a maioria dos loops de animação)
              const maxRect = await sampleMaxRect(content, 2200);
              const wrapperRect = wrapper.getBoundingClientRect();

              // A small safety margin so glow/shadows won't touch edges
              const margin = 12;
              const availableWidth = Math.max(1, wrapperRect.width - margin * 2);
              const availableHeight = Math.max(1, wrapperRect.height - margin * 2);

              const w = Math.max(1, maxRect.width);
              const h = Math.max(1, maxRect.height);

              const scale = Math.min(availableWidth / w, availableHeight / h, 1);
              content.style.transform = 'scale(' + scale + ')';

              // Keep the animation centered at all times
              await nextFrame();
              startCenterLoop();
            }

            // Run multiple times to catch dynamic rendering/animations
            window.addEventListener('load', () => {
              fitToPreview();
              setTimeout(fitToPreview, 200);
              setTimeout(fitToPreview, 600);
            });
            window.addEventListener('resize', () => fitToPreview());
            setTimeout(fitToPreview, 50);
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
