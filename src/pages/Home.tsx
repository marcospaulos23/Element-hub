import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="min-h-screen bg-background flex items-center">
      <div className="w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
            Element Hub
          </h1>

          <p className="text-base md:text-lg text-muted-foreground font-light max-w-xl mb-10 leading-relaxed">
            Explore nossa coleção de componentes UI modernos. Veja em ação e copie o código
            para usar em seus projetos.
          </p>

          <Link to="/repository">
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base px-6 py-6 font-medium group bg-foreground text-background hover:bg-foreground/90 hover:text-background border-0"
            >
              Explorar Repositório
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
