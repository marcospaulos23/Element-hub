import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Shield, Bell, Users, Boxes } from "lucide-react";
import { Link } from "react-router-dom";
import UserDetailsModal from "@/components/admin/UserDetailsModal";
import PendingUserCard from "@/components/admin/PendingUserCard";
import ApprovedUserCard from "@/components/admin/ApprovedUserCard";
import AdminStatsChart from "@/components/admin/AdminStatsChart";
import { DashboardFilter, FilterPeriod } from "@/components/admin/DashboardFilter";
import { DateRange } from "react-day-picker";
import { subDays, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import StatCard from "@/components/admin/StatCard";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  is_approved: boolean;
  created_at: string;
  email?: string;
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [elementsCount, setElementsCount] = useState(0);

  // Verifica se o usuário é admin pelo hook useAuth
  const { isAdmin } = useAuth();

  /* New state for filtering */
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("today");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
  });

  useEffect(() => {
    // Redireciona imediatamente se não for admin
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
        return;
      }
      if (!isAdmin) {
        navigate("/repository");
        return;
      }
      fetchUsers();
      fetchElementsCount();
    }
  }, [user, authLoading, navigate]);

  // Realtime subscription para novos usuários pendentes
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('pending-users')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'profiles',
          filter: 'is_approved=eq.false'
        },
        (payload) => {
          const newUser = payload.new as UserProfile;
          toast({
            title: "🔔 Nova solicitação de acesso!",
            description: `${newUser.display_name || "Novo usuário"} solicitou acesso ao repositório.`,
          });
          // Atualiza a lista de usuários
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, toast]);

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

  const fetchElementsCount = async () => {
    const { count, error } = await supabase
      .from("elements")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching elements count:", error);
    } else {
      setElementsCount(count || 0);
    }
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

  const handleReject = async (userId: string) => {
    setProcessingId(userId);

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Erro ao rejeitar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Usuário rejeitado",
        description: "A solicitação de acesso foi rejeitada.",
      });
      await fetchUsers();
    }

    setProcessingId(null);
  };

  const handleUserClick = (profile: UserProfile) => {
    setSelectedUser(profile);
    setDetailsOpen(true);
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

  // Handle filter changes
  const handlePeriodChange = (period: FilterPeriod) => {
    setFilterPeriod(period);
    const today = new Date();

    if (period === "today") {
      setDateRange({ from: startOfDay(today), to: endOfDay(today) });
    } else if (period === "week") {
      setDateRange({ from: subDays(today, 7), to: endOfDay(today) });
    } else if (period === "month") {
      setDateRange({ from: subDays(today, 30), to: endOfDay(today) });
    } else if (period === "all") {
      setDateRange(undefined);
    } else {
      // Custom: keep existing range or init empty
      if (!dateRange) setDateRange({ from: today, to: today });
    }
  };

  // Filter logic
  const filteredUsers = users.filter(user => {
    if (filterPeriod === "all") return true;
    if (!dateRange?.from) return true;

    const userDate = new Date(user.created_at);
    // Ensure we compare inclusive of the day
    const start = startOfDay(dateRange.from);
    const end = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);

    return isWithinInterval(userDate, { start, end });
  });

  // Prepare Chart Data
  const chartData = filteredUsers.reduce((acc, user) => {
    const date = new Date(user.created_at).toISOString().split('T')[0];
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, [] as { date: string; count: number }[]).sort((a, b) => a.date.localeCompare(b.date));

  const pendingUsers = filteredUsers.filter(u => !u.is_approved);
  const approvedUsers = filteredUsers.filter(u => u.is_approved);

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

        {/* Header Section */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
            <p className="text-muted-foreground mt-1">
              Aprove ou revogue acesso dos usuários ao repositório
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <DashboardFilter
              period={filterPeriod}
              dateRange={dateRange}
              onPeriodChange={handlePeriodChange}
              onDateRangeChange={setDateRange}
            />

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm py-1">
                Total: {users.length}
              </Badge>
              {filterPeriod !== "all" && (
                <Badge variant="secondary" className="text-sm py-1">
                  Neste período: {filteredUsers.length}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Total de Logins"
            value={users.length}
            icon={Users}
            iconColor="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            title="Total de Elementos"
            value={elementsCount}
            icon={Boxes}
            iconColor="text-purple-600"
            bgColor="bg-purple-50"
          />
          <StatCard
            title="Usuários Aprovados"
            value={approvedUsers.length}
            icon={Shield}
            iconColor="text-green-600"
            bgColor="bg-green-50"
          />
        </div>

        {/* Stats Chart */}
        <div className="mb-6">
          <AdminStatsChart data={chartData} />
        </div>

        {/* Pending Users */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Pendentes
              {pendingUsers.length > 0 && (
                <Badge variant="destructive">{pendingUsers.length}</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Usuários aguardando aprovação de acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingUsers.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhum usuário pendente neste período
              </p>
            ) : (
              <div className="space-y-3">
                {pendingUsers.map((profile) => (
                  <PendingUserCard
                    key={profile.id}
                    profile={profile}
                    processingId={processingId}
                    onApprove={(userId) => handleApproval(userId, true)}
                    onReject={handleReject}
                    onClick={() => handleUserClick(profile)}
                  />
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
                Nenhum usuário aprovado neste período
              </p>
            ) : (
              <div className="space-y-3">
                {approvedUsers.map((profile) => (
                  <ApprovedUserCard
                    key={profile.id}
                    profile={profile}
                    processingId={processingId}
                    onRevoke={(userId) => handleApproval(userId, false)}
                    onClick={() => handleUserClick(profile)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
};
export default AdminUsers;
