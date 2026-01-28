import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-16 pb-24 px-4 text-center overflow-hidden">
      {/* Perspective grid background - asymmetric layout like reference image */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-left grid - large, filling the corner */}
        <div 
          className="absolute -top-[40%] -left-[30%] w-[120%] h-[120%]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '35px 35px',
            transform: 'perspective(600px) rotateX(55deg) rotateZ(-20deg)',
            transformOrigin: 'bottom right',
            maskImage: 'radial-gradient(ellipse 70% 70% at 80% 80%, transparent 10%, black 50%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 80% 80%, transparent 10%, black 50%)',
          }}
        />
        {/* Bottom-right grid - large, filling the corner */}
        <div 
          className="absolute -bottom-[40%] -right-[30%] w-[120%] h-[120%]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '35px 35px',
            transform: 'perspective(600px) rotateX(-55deg) rotateZ(-20deg)',
            transformOrigin: 'top left',
            maskImage: 'radial-gradient(ellipse 70% 70% at 20% 20%, transparent 10%, black 50%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 20% 20%, transparent 10%, black 50%)',
          }}
        />
        {/* Center fade overlay - clear area for title */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 45% 40% at 50% 50%, hsl(var(--background)) 0%, hsl(var(--background) / 0.9) 60%, transparent 100%)',
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
