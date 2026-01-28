import { Link } from "react-router-dom";
import { ArrowLeft, Copy, MousePointerClick, Search, Code2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const HowToUse = () => {
  const steps = [
    {
      icon: Search,
      title: "1. Navegue pelo Repositório",
      description: "Use o filtro de categorias na parte superior para encontrar os elementos que você precisa. Temos botões, fundos, animações e muito mais!"
    },
    {
      icon: MousePointerClick,
      title: "2. Visualize o Elemento",
      description: "Clique em qualquer card de elemento para abrir o modal com a prévia em tamanho maior e ver como ele funciona em ação."
    },
    {
      icon: Code2,
      title: "3. Acesse o Código",
      description: "No modal do elemento, você encontra as abas HTML e CSS separadas. Cada uma contém o código pronto para usar."
    },
    {
      icon: Copy,
      title: "4. Copie e Use",
      description: "Clique no botão 'Copiar Código' para copiar o código para a área de transferência. Cole diretamente no seu projeto!"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link 
            to="/repository" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Repositório
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl font-bold mb-4 tracking-wider"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Como Utilizar
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Aprenda a navegar pelo Element Hub e utilize os elementos UI em seus projetos de forma rápida e fácil.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {steps.map((step, index) => (
            <Card key={index} className="border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-12 p-6 rounded-xl bg-muted/50 border border-border">
          <h2 className="text-xl font-semibold mb-4">💡 Dicas Extras</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Os elementos são compatíveis com qualquer framework que suporte HTML/CSS</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Alguns elementos usam variáveis CSS que você pode personalizar facilmente</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Use a prévia para testar como o elemento fica antes de copiar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Elementos com fundo claro são indicados na prévia para melhor visualização</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default HowToUse;
