import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WhatsNew = () => {
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
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 
              className="text-4xl font-bold tracking-wider"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Novidades
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Fique por dentro de todas as atualizações e novos elementos adicionados ao Element Hub.
          </p>
        </div>

        {/* Announcement Card */}
        <Card className="border-border mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">📢 Onde Anunciamos as Novidades</CardTitle>
            <CardDescription className="text-base">
              Todas as atualizações, novos elementos e melhorias são anunciados exclusivamente em nossos canais de transmissão.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Discord Card */}
              <div className="p-6 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/30 hover:border-[#5865F2]/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-full bg-[#5865F2]/20">
                    <svg 
                      viewBox="0 0 24 24" 
                      className="w-6 h-6 text-[#5865F2]"
                      fill="currentColor"
                    >
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Discord</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Entre no nosso servidor do Discord para receber notificações em tempo real sobre novos elementos, tutoriais e interagir com a comunidade.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-[#5865F2]/50 text-[#5865F2] hover:bg-[#5865F2]/10"
                  onClick={() => window.open('https://discord.gg/', '_blank')}
                >
                  Entrar no Discord
                </Button>
              </div>

              {/* WhatsApp Card */}
              <div className="p-6 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:border-[#25D366]/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-full bg-[#25D366]/20">
                    <MessageCircle className="w-6 h-6 text-[#25D366]" />
                  </div>
                  <h3 className="text-xl font-semibold">WhatsApp</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Entre no nosso grupo ou canal do WhatsApp para receber atualizações diretamente no seu celular com facilidade.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/10"
                  onClick={() => window.open('https://wa.me/', '_blank')}
                >
                  Entrar no WhatsApp
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="p-6 rounded-xl bg-muted/50 border border-border text-center">
          <h2 className="text-xl font-semibold mb-3">🚀 O que você vai encontrar</h2>
          <ul className="space-y-2 text-muted-foreground max-w-md mx-auto text-left">
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Anúncios de novos elementos e categorias</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Tutoriais e dicas de uso</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Melhorias e correções da plataforma</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Pedidos da comunidade e votações</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default WhatsNew;
