import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Loader2, LogOut, Save, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut, updateProfile, uploadAvatar } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Load profile data
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await updateProfile({ display_name: displayName || null });
    setIsSaving(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    setIsUploading(true);
    await uploadAvatar(file);
    setIsUploading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name.slice(0, 2).toUpperCase();
    }
    return user.email?.slice(0, 2).toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
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
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 
            className="text-3xl font-bold tracking-wider"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Configurações
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie seu perfil e preferências
          </p>
        </div>

        {/* Profile Card */}
        <Card className="border-border mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Perfil
            </CardTitle>
            <CardDescription>
              Personalize como você aparece no Element Hub
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-20 h-20 cursor-pointer" onClick={handleAvatarClick}>
                  <AvatarImage src={profile?.avatar_url || undefined} alt="Avatar" />
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleAvatarClick}
                  disabled={isUploading}
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isUploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Camera className="w-3.5 h-3.5" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <div>
                <p className="font-medium">{profile?.display_name || "Sem nome"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <Separator />

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="display-name">Nome de exibição</Label>
              <Input
                id="display-name"
                placeholder="Como você quer ser chamado"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                Este nome será exibido no seu perfil
              </p>
            </div>

            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Account Card */}
        <Card className="border-border border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <LogOut className="w-5 h-5" />
              Sair da Conta
            </CardTitle>
            <CardDescription>
              Encerre sua sessão atual no Element Hub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza que deseja sair?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Você será desconectado da sua conta e precisará fazer login novamente para acessar suas configurações.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSignOut}>
                    Sim, sair
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Settings;
