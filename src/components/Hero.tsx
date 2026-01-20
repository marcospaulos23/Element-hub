import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-16 pb-8 px-4 text-center">
      {/* Background effects - positioned to extend beyond section bounds */}
      <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
        <div 
          className="absolute left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[120px]"
          style={{
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)',
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{
            top: '20%',
            left: '30%',
            background: 'radial-gradient(circle, hsl(var(--accent) / 0.06) 0%, transparent 70%)',
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
