import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-16 pb-8 px-4 text-center">
      {/* Large circular glow effect - soft white to black gradient */}
      <div className="fixed inset-0 pointer-events-none -z-10 flex items-start justify-center">
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

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <span className="gradient-text">Element Hub</span>
        </h1>

        <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: "200ms" }}>
          Explore nossa coleção de componentes UI modernos. Veja em ação e copie o código
          para usar em seus projetos.
        </p>
      </div>
    </section>
  );
};

export default Hero;
