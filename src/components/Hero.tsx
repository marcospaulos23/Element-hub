import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-16 pb-24 px-4 text-center overflow-hidden">
      {/* 3D Perspective Grid - Top Left */}
      <div 
        className="absolute top-0 left-0 w-[80%] h-[80%] pointer-events-none opacity-60"
        style={{
          transform: 'perspective(800px) rotateX(55deg) rotateZ(-45deg)',
          transformOrigin: 'top left',
          background: `
            linear-gradient(90deg, rgba(180, 150, 100, 0.15) 1px, transparent 1px),
            linear-gradient(rgba(180, 150, 100, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 30%, transparent 60%)',
          WebkitMaskImage: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 30%, transparent 60%)',
        }}
      />

      {/* 3D Perspective Grid - Bottom Right */}
      <div 
        className="absolute bottom-0 right-0 w-[80%] h-[80%] pointer-events-none opacity-60"
        style={{
          transform: 'perspective(800px) rotateX(55deg) rotateZ(-45deg)',
          transformOrigin: 'bottom right',
          background: `
            linear-gradient(90deg, rgba(180, 150, 100, 0.2) 1px, transparent 1px),
            linear-gradient(rgba(180, 150, 100, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(-45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 25%, transparent 55%)',
          WebkitMaskImage: 'linear-gradient(-45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 25%, transparent 55%)',
        }}
      />

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
