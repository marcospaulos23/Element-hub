import { useRef, useEffect, useState, useCallback, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface KamuiButtonProps {
  children?: ReactNode;
  onAnimationStart?: () => void;
}

const KamuiButton = ({ children, onAnimationStart }: KamuiButtonProps) => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const animationRef = useRef<number>();
  const [isHidden, setIsHidden] = useState(false);
  const stateRef = useRef({
    particles: [] as any[],
    angle: 0,
    totalRotation: 0,
    isEnding: false,
    zoomScale: 1,
    zoomAcceleration: 1.005,
    isActivated: false,
    isWaiting: false,
  });

  class Particle {
    x: number;
    y: number;
    dist: number;
    angle: number;
    speed: number;
    size: number;
    color: string;
    isFromRect: boolean;
    active: boolean;
    canvasWidth: number;
    canvasHeight: number;

    constructor(startX: number, startY: number, isFromRect: boolean, canvasWidth: number, canvasHeight: number) {
      this.isFromRect = isFromRect;
      this.active = true;
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.x = startX;
      this.y = startY;
      this.dist = 0;
      this.angle = 0;

      if (isFromRect) {
        const dx = this.x - canvasWidth / 2;
        const dy = this.y - canvasHeight / 2;
        this.dist = Math.sqrt(dx * dx + dy * dy);
        this.angle = Math.atan2(dy, dx);
      } else {
        this.reset();
      }

      this.speed = 0.04 + Math.random() * 0.04;
      this.size = Math.random() * 2 + 0.5;

      const brightness = Math.floor(Math.random() * 50) + 205;
      const alpha = Math.random() * 0.5 + 0.2;
      this.color = `rgba(${brightness}, ${brightness}, ${brightness}, ${alpha})`;
    }

    reset() {
      this.dist = Math.random() * (Math.max(this.canvasWidth, this.canvasHeight) / 1.5);
      this.angle = Math.random() * Math.PI * 2;
    }

    update(isEnding: boolean, currentZoom: number) {
      this.angle += this.speed * (isEnding ? currentZoom * 0.4 : 1);
      const suctionBase = isEnding ? 16 : 7;
      const suctionSpeed = suctionBase * (isEnding ? Math.pow(currentZoom, 0.8) : 1);

      this.dist -= suctionSpeed;

      if (this.dist < 2) {
        if (this.isFromRect || isEnding) {
          this.active = false;
        } else {
          this.reset();
          this.dist = Math.max(this.canvasWidth, this.canvasHeight) / 1.5;
        }
      }
    }

    draw(ctx: CanvasRenderingContext2D, scale: number) {
      if (!this.active) return;
      const centerX = this.canvasWidth / 2;
      const centerY = this.canvasHeight / 2;

      const x = centerX + Math.cos(this.angle) * this.dist * scale;
      const y = centerY + Math.sin(this.angle) * this.dist * scale;

      ctx.beginPath();
      ctx.arc(x, y, this.size * scale, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  const triggerKamui = useCallback(() => {
    const state = stateRef.current;
    const canvas = canvasRef.current;
    const btn = btnRef.current;

    if (state.isActivated || state.isWaiting || !canvas || !btn) return;

    const rect = btn.getBoundingClientRect();
    state.isActivated = true;
    state.isWaiting = false;
    setIsHidden(true);
    onAnimationStart?.();

    const width = canvas.width;
    const height = canvas.height;
    const startX = rect.left;
    const startY = rect.top;
    const step = 4;

    state.particles = [];
    state.totalRotation = 0;
    state.isEnding = false;
    state.zoomScale = 1;
    state.zoomAcceleration = 1.008;

    for (let x = 0; x < rect.width; x += step) {
      for (let y = 0; y < rect.height; y += step) {
        state.particles.push(new Particle(startX + x, startY + y, true, width, height));
      }
    }

    for (let i = 0; i < 550; i++) {
      state.particles.push(new Particle(0, 0, false, width, height));
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const animate = () => {
      const state = stateRef.current;
      const width = canvas.width;
      const height = canvas.height;

      const trailOpacity = state.isEnding ? 0.4 : 0.2;
      ctx.fillStyle = `rgba(0, 0, 0, ${trailOpacity})`;
      ctx.fillRect(0, 0, width, height);

      if (state.isActivated) {
        if (state.isEnding) {
          state.zoomAcceleration *= 1.025;
          state.zoomScale *= state.zoomAcceleration;
          canvas.style.transform = `scale(${state.zoomScale})`;
        }

        for (let i = state.particles.length - 1; i >= 0; i--) {
          const p = state.particles[i];
          p.update(state.isEnding, state.zoomScale);
          p.draw(ctx, state.zoomScale);
          if (!p.active) state.particles.splice(i, 1);
        }

        const rotationSpeed = 0.12 + (state.isEnding ? state.zoomScale * 0.15 : 0);
        state.angle += rotationSpeed;
        state.totalRotation += rotationSpeed;

        if (state.totalRotation >= Math.PI * 5 && !state.isEnding) {
          state.isEnding = true;
        }

        if (state.isEnding && (state.zoomScale > 80 || state.particles.length === 0)) {
          state.isActivated = false;
          state.isWaiting = true;

          setTimeout(() => {
            navigate("/repository");
          }, 400);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [navigate]);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center" style={{ perspective: "1500px" }}>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none transition-opacity duration-600"
      />
      <div className="flex flex-col items-center text-center z-10 px-6">
        {children}
        <button
          ref={btnRef}
          onClick={triggerKamui}
          className={`
            px-10 py-[18px] bg-foreground text-background border-none rounded-[14px]
            font-extrabold text-base cursor-pointer flex items-center gap-3
            uppercase tracking-wide transition-all duration-400
            hover:-translate-y-1 hover:scale-[1.02]
            active:-translate-y-[1px] active:scale-[0.98]
            ${isHidden ? "hidden" : ""}
          `}
          style={{
            boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          }}
        >
          <span>Explorar Repositório</span>
          <svg
            className="w-[22px] h-[22px] stroke-[3] transition-transform duration-400 group-hover:translate-x-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default KamuiButton;
