import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-16 pb-24 px-4 text-center overflow-hidden">
      {/* Perspective grid background - asymmetric layout like reference image */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-left grid - converging towards center-right */}
        <div 
          className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg) rotateZ(-15deg)',
            transformOrigin: 'bottom right',
            maskImage: 'radial-gradient(ellipse 100% 100% at 100% 100%, transparent 20%, black 60%)',
            WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 100% 100%, transparent 20%, black 60%)',
          }}
        />
        {/* Bottom-right grid - converging towards center-left */}
        <div 
          className="absolute -bottom-[10%] -right-[10%] w-[70%] h-[70%]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(-60deg) rotateZ(-15deg)',
            transformOrigin: 'top left',
            maskImage: 'radial-gradient(ellipse 100% 100% at 0% 0%, transparent 20%, black 60%)',
            WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 0% 0%, transparent 20%, black 60%)',
          }}
        />
        {/* Center fade overlay - larger clear area */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 55% at 50% 50%, hsl(var(--background)) 0%, hsl(var(--background) / 0.95) 50%, transparent 80%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>+50 elementos prontos para usar</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-semibold tracking-wider mb-8 animate-fade-in" style={{ animationDelay: "100ms", fontFamily: "'Orbitron', sans-serif" }}>
          <span className="gradient-text">Hub de Elementos</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed" style={{ animationDelay: "200ms" }}>
          Explore nossa coleção de componentes UI modernos. Veja em ação e copie o código
          para usar em seus projetos.
        </p>
      </div>
    </section>
  );
};

export default Hero;
