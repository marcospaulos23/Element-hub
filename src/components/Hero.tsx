import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-16 pb-24 px-4 text-center overflow-hidden">
      {/* 3D Perspective Grid - matching reference image */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          perspective: '1000px',
          perspectiveOrigin: '100% 50%',
        }}
      >
        <div 
          className="absolute w-[200%] h-[200%]"
          style={{
            top: '-50%',
            right: '-50%',
            transform: 'rotateX(60deg) rotateZ(-45deg)',
            transformOrigin: 'center center',
            background: `
              linear-gradient(90deg, rgba(180, 140, 80, 0.25) 1px, transparent 1px),
              linear-gradient(rgba(180, 140, 80, 0.25) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 70% 50%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 70% 50%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)',
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
