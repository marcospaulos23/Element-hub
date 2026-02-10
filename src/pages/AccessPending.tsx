import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Home, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AccessPending = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute top-6 right-6">
        <Button
          variant="ghost"
          onClick={() => signOut()}
          className="text-muted-foreground hover:text-foreground gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sair / Outra conta
        </Button>
      </div>

      <Card className="w-full max-w-md border-border text-center">
        <CardHeader>
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Solicitação Enviada!</CardTitle>
          <CardDescription className="text-base mt-2">
            O pedido de acesso já foi solicitado. Quando seu login for liberado,
            você poderá acessar tranquilamente com o e-mail e senha cadastrados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Você receberá acesso assim que um administrador aprovar sua conta.
          </p>
          <Button asChild className="w-full">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessPending;
