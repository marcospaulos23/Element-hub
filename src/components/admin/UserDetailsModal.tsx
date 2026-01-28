import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Calendar, Mail, Shield, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  is_approved: boolean;
  created_at: string;
  email?: string;
}

interface UserDetailsModalProps {
  user: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserAuthData {
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

const UserDetailsModal = ({ user, open, onOpenChange }: UserDetailsModalProps) => {
  const [authData, setAuthData] = useState<UserAuthData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user) {
      fetchUserAuthData(user.user_id);
    } else {
      setAuthData(null);
    }
  }, [open, user]);

  const fetchUserAuthData = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-user-email', {
        body: { user_id: userId }
      });

      if (error) {
        console.error('Error fetching user auth data:', error);
      } else {
        setAuthData(data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Usuário</DialogTitle>
          <DialogDescription>
            Informações do perfil do usuário
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4">
            {user.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt="" 
                className="w-16 h-16 rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-border">
                <span className="text-primary font-bold text-xl">
                  {(user.display_name || "U")[0].toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg">
                {user.display_name || "Sem nome"}
              </h3>
              <Badge variant={user.is_approved ? "default" : "secondary"}>
                {user.is_approved ? "Aprovado" : "Pendente"}
              </Badge>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Nome de Exibição</p>
                <p className="font-medium">{user.display_name || "Não informado"}</p>
              </div>
            </div>

            {/* Email from auth */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">E-mail</p>
                {loading ? (
                  <Skeleton className="h-5 w-48" />
                ) : (
                  <p className="font-medium">{authData?.email || "Não disponível"}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Data de Cadastro</p>
                <p className="font-medium">
                  {new Date(user.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
            </div>

            {/* Last sign in */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Último Acesso</p>
                {loading ? (
                  <Skeleton className="h-5 w-40" />
                ) : authData?.last_sign_in_at ? (
                  <p className="font-medium">
                    {new Date(authData.last_sign_in_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                ) : (
                  <p className="font-medium text-muted-foreground">Nunca acessou</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Status de Acesso</p>
                <p className="font-medium">
                  {user.is_approved ? "Acesso liberado" : "Aguardando aprovação"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-5 h-5 flex items-center justify-center text-muted-foreground text-xs font-mono">
                ID
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ID do Usuário</p>
                <p className="font-mono text-xs break-all">{user.user_id}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
