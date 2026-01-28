import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-16 pb-24 px-4 text-center overflow-hidden">
      {/* Perspective grid background - contained within hero section */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top grid - perspective from top */}
        <div 
          className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[150%] h-[70%]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: 'translateX(-50%) perspective(400px) rotateX(55deg)',
            transformOrigin: 'center bottom',
          }}
        />
        {/* Bottom grid - perspective from bottom */}
        <div 
          className="absolute -bottom-[30%] left-1/2 -translate-x-1/2 w-[150%] h-[70%]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: 'translateX(-50%) perspective(400px) rotateX(-55deg)',
            transformOrigin: 'center top',
          }}
        />
        {/* Center fade overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 40% 35% at 50% 50%, hsl(var(--background)) 0%, hsl(var(--background) / 0.9) 30%, transparent 60%)',
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
