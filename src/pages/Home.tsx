import KamuiButton from "@/components/KamuiButton";
import { useState } from "react";

const Home = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-hidden flex items-center justify-center relative">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Red glow at bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-[60%] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(
              ellipse 90% 60% at 50% 100%,
              hsl(var(--destructive) / 0.45) 0%,
              hsl(var(--destructive) / 0.22) 42%,
              transparent 78%
            ),
            linear-gradient(
              to top,
              hsl(var(--destructive) / 0.18) 0%,
              transparent 62%
            )
          `,
        }}
      />
      <KamuiButton onAnimationStart={() => setIsAnimating(true)}>
        <div 
          className={`max-w-xl text-center transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 whitespace-nowrap">
            Element Hub
          </h1>

          <p className="text-base md:text-lg text-muted-foreground font-light max-w-xl mb-10 leading-relaxed">
            Explore nossa coleção de componentes UI modernos. Veja em ação e copie o código
            para usar em seus projetos.
          </p>
        </div>
      </KamuiButton>
    </div>
  );
};

export default Home;
