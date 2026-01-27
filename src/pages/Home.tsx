import KamuiButton from "@/components/KamuiButton";
import { useState } from "react";

const Home = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <KamuiButton onAnimationStart={() => setIsAnimating(true)}>
        <div 
          className={`max-w-xl transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
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
