import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-16 pb-24 px-4 text-center overflow-hidden">
      {/* 3D Perspective Grid - ramp effect from top-right to bottom-left */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '100% 0%',
        }}
      >
        <div 
          className="absolute w-[250%] h-[250%]"
          style={{
            top: '-80%',
            right: '-60%',
            transform: 'rotateX(70deg) rotateZ(-50deg)',
            transformOrigin: 'top right',
            background: `
              linear-gradient(90deg, rgba(180, 140, 80, 0.35) 1px, transparent 1px),
              linear-gradient(rgba(180, 140, 80, 0.35) 1px, transparent 1px)
            `,
            backgroundSize: '45px 45px',
            maskImage: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 20%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 60%, transparent 80%)',
            WebkitMaskImage: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 20%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 60%, transparent 80%)',
          }}
        />
      </div>

      {/* Large circular glow effect - soft white to black gradient */}
      <div className="absolute inset-0 pointer-events-none flex items-start justify-center">
        <div 
          className="w-[1200px] h-[1200px] rounded-full"
          style={{
            marginTop: '-200px',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 30%, rgba(0, 0, 0, 0) 60%)',
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
