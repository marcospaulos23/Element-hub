import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-16 pb-8 px-4 text-center overflow-visible">
      {/* Background glow effect */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at center, hsl(var(--primary) / 0.12) 0%, hsl(var(--primary) / 0.05) 30%, transparent 70%)',
        }}
      />
      <div 
        className="absolute left-[30%] top-[30%] w-[400px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, hsl(var(--accent) / 0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>+50 elementos prontos para usar</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <span className="gradient-text">Element Hub</span>
        </h1>

        <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed" style={{ animationDelay: "200ms" }}>
          Explore nossa coleção de componentes UI modernos. Veja em ação e copie o código
          para usar em seus projetos.
        </p>

        <div className="flex items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <a href="#elements" className="btn-primary inline-flex items-center gap-2">
            Explorar Elementos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
