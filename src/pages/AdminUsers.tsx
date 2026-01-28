import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X, ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  is_approved: boolean;
  created_at: string;
  email?: string;
}

// Email do administrador autorizado
const ADMIN_EMAIL = "marcoscorporation23@gmail.com";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Verifica se o usuário é admin pelo email
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    // Redireciona imediatamente se não for admin
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
        return;
      }
      if (user.email !== ADMIN_EMAIL) {
        navigate("/repository");
        return;
      }
      fetchUsers();
    }
  }, [user, authLoading, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  const handleApproval = async (userId: string, approve: boolean) => {
    setProcessingId(userId);
    
    const { error } = await supabase
      .from("profiles")
      .update({ is_approved: approve })
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: approve ? "Acesso liberado!" : "Acesso revogado",
        description: approve 
          ? "O usuário agora pode acessar o repositório." 
          : "O acesso do usuário foi revogado.",
      });
      await fetchUsers();
    }
    
    setProcessingId(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-border text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta página.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/">Voltar ao Início</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingUsers = users.filter(u => !u.is_approved);
  const approvedUsers = users.filter(u => u.is_approved);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/settings" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar às Configurações
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
          <p className="text-muted-foreground mt-1">
            Aprove ou revogue acesso dos usuários ao repositório
          </p>
        </div>

        {/* Pending Users */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Pendentes
              {pendingUsers.length > 0 && (
                <Badge variant="secondary">{pendingUsers.length}</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Usuários aguardando aprovação de acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingUsers.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhum usuário pendente
              </p>
            ) : (
              <div className="space-y-3">
                {pendingUsers.map((profile) => (
                  <div 
                    key={profile.id} 
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      {profile.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt="" 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-medium">
                            {(profile.display_name || "U")[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">
                          {profile.display_name || "Sem nome"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(profile.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproval(profile.user_id, true)}
                        disabled={processingId === profile.user_id}
                      >
                        {processingId === profile.user_id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Aprovar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Approved Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Aprovados
              <Badge variant="default">{approvedUsers.length}</Badge>
            </CardTitle>
            <CardDescription>
              Usuários com acesso liberado ao repositório
            </CardDescription>
          </CardHeader>
          <CardContent>
            {approvedUsers.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhum usuário aprovado
              </p>
            ) : (
              <div className="space-y-3">
                {approvedUsers.map((profile) => (
                  <div 
                    key={profile.id} 
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      {profile.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt="" 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-medium">
                            {(profile.display_name || "U")[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">
                          {profile.display_name || "Sem nome"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(profile.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleApproval(profile.user_id, false)}
                        disabled={processingId === profile.user_id}
                      >
                        {processingId === profile.user_id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <X className="w-4 h-4 mr-1" />
                            Revogar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;
