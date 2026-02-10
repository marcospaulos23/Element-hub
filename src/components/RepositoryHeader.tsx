import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, ChevronDown, LogOut, User, FolderPlus, FolderEdit, LayoutGrid, Home, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RepositoryHeaderProps {
  isAdmin: boolean;
  onAddElement: () => void;
  onAddCategory: () => void;
  onManageCategories: () => void;
  onManageElements: () => void;
}

const RepositoryHeader = ({
  isAdmin,
  onAddElement,
  onAddCategory,
  onManageCategories,
  onManageElements,
}: RepositoryHeaderProps) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const mainNavItems = [
    { title: "Início", icon: Home, href: "/" },
    { title: "Como Utilizar", icon: BookOpen, href: "/how-to-use" },
    { title: "Novidades", icon: Sparkles, href: "/whats-new" },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Desconectado com sucesso!");
      navigate("/auth");
    } catch (error) {
      toast.error("Erro ao sair");
    }
  };

  const handleProfile = () => {
    navigate("/settings");
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Admin management dropdown + Add Element button + Main Nav */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <>
              {/* Management Dropdown */}
              <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 border border-border hover:bg-secondary"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-popover border-border">
                  <DropdownMenuItem
                    onClick={() => {
                      onAddCategory();
                      setIsDropdownOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <FolderPlus className="h-4 w-4 mr-2 text-primary" />
                    Adicionar Categoria
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      onManageCategories();
                      setIsDropdownOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <FolderEdit className="h-4 w-4 mr-2" />
                    Editar Categorias
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      onManageElements();
                      setIsDropdownOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Gerenciar Elementos
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Add Element Button */}
              <Button
                onClick={onAddElement}
                className="bg-primary text-primary-foreground hover:bg-primary/90 mr-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Elemento
              </Button>
            </>
          )}

          {/* Main Navigation Items */}
          <div className="flex items-center justify-center gap-1">
            {mainNavItems.map((item) => (
              <Button
                key={item.title}
                variant="ghost"
                asChild
                className="text-white hover:text-white hover:bg-white/10"
              >
                <Link to={item.href} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Right side - Profile and Logout buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-9 w-9 border border-white/20 bg-gradient-to-b from-white/10 to-transparent hover:from-white/20 hover:text-destructive text-gray-300 shadow-sm transition-all duration-300"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleProfile}
            className="h-10 w-10 border border-white/20 rounded-full bg-gradient-to-b from-white/10 to-transparent hover:from-white/20 text-white shadow-md transition-all duration-300"
            title="Perfil"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default RepositoryHeader;
