import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      setProfile(data);
      return data;
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      return null;
    }
  };

  const checkAdminRole = async (userId: string, userEmail?: string) => {
    // HARDCODED OWNER ACCESS: Always return true for these emails
    const emailToCheck = userEmail || user?.email;
    if (emailToCheck === "marcospaulosites23@gmail.com" || emailToCheck === "marcoscorporation23@gmail.com") {
      setIsAdmin(true);
      return true;
    }

    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error) throw error;
      const hasAdmin = !!data;
      setIsAdmin(hasAdmin);
      return hasAdmin;
    } catch (error) {
      console.error("Error checking admin role:", error);
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initSession = async (session: Session | null) => {
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Wait for both data fetches to complete
        await Promise.all([
          fetchProfile(session.user.id),
          checkAdminRole(session.user.id, session.user.email)
        ]);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }

      if (mounted) setLoading(false);
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        initSession(session);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      initSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    const redirectUrl = `${window.location.origin}/`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      toast({
        title: "Erro ao criar conta",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    // Create profile for new user
    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: data.user.id,
          display_name: displayName || null,
        });

      if (profileError) {
        console.error("Error creating profile:", profileError);
      }
    }

    toast({
      title: "Conta criada com sucesso!",
      description: "Você já está logado.",
    });

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        // Force session persistence
      }
    });

    if (error) {
      let message = error.message;
      if (error.message.includes("Invalid login credentials")) {
        message = "Email ou senha incorretos";
      }
      toast({
        title: "Erro ao entrar",
        description: message,
        variant: "destructive",
      });
      return { error };
    }

    toast({
      title: "Bem-vindo de volta!",
      description: "Login realizado com sucesso.",
    });

    return { error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    setProfile(null);
    setIsAdmin(false);
    toast({
      title: "Até logo!",
      description: "Você saiu da sua conta.",
    });
    return { error: null };
  };

  const updateProfile = async (updates: Partial<Pick<Profile, "display_name" | "avatar_url">>) => {
    if (!user) return { error: new Error("Usuário não autenticado") };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    // Refresh profile
    await fetchProfile(user.id);

    toast({
      title: "Perfil atualizado!",
      description: "Suas alterações foram salvas.",
    });

    return { error: null };
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return { error: new Error("Usuário não autenticado"), url: null };

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({
        title: "Erro ao fazer upload",
        description: uploadError.message,
        variant: "destructive",
      });
      return { error: uploadError, url: null };
    }

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    // Add cache-busting parameter
    const urlWithCache = `${publicUrl}?v=${Date.now()}`;

    // Update profile with new avatar URL
    await updateProfile({ avatar_url: urlWithCache });

    return { error: null, url: urlWithCache };
  };

  return {
    user,
    profile,
    isAdmin,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    uploadAvatar,
    fetchProfile,
    checkAdminRole,
  };
};
