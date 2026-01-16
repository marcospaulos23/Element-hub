import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Code, Layers, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border text-muted-foreground text-sm mb-8">
            <Sparkles className="w-4 h-4" />
            <span>+50 elementos prontos para usar</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6">
            Element Hub
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto mb-12 leading-relaxed">
            Explore nossa coleção de componentes UI modernos. Veja em ação e copie o código
            para usar em seus projetos.
          </p>

          <Link to="/repository">
            <Button size="lg" className="text-lg px-8 py-6 font-medium group">
              Explorar Repositório
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Por que usar o Element Hub?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Código Limpo</h3>
              <p className="text-muted-foreground font-light">
                Componentes bem estruturados e fáceis de integrar em qualquer projeto.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Componentes Modernos</h3>
              <p className="text-muted-foreground font-light">
                UI elements seguindo as melhores práticas de design e acessibilidade.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fácil de Usar</h3>
              <p className="text-muted-foreground font-light">
                Copie o código e cole direto no seu projeto. Simples assim.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
