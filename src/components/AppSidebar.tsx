import {
  Settings,
  PanelLeft,
  Code2,
  MousePointer2,
  CreditCard,
  AlignLeft,
  Loader2,
  Palette,
  LayoutGrid,
  Type,
  ImageIcon,
  Box,
  MonitorPlay,
  ScrollText,
  MousePointerClick,
  Search,
  Navigation,
  Layers,
  Component,
  Sparkles,
  Home,
  BookOpen,
  Crown,
  Shield
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Category } from "@/hooks/useCategories";
import { cn } from "@/lib/utils";

// Category icons mapping
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();

  if (name.includes('botão') || name.includes('button')) return MousePointer2;
  if (name.includes('card')) return CreditCard;
  if (name.includes('form') || name.includes('input')) return AlignLeft;
  if (name.includes('load') || name.includes('spinner')) return Loader2;
  if (name.includes('ui') || name.includes('interface')) return Palette;
  if (name.includes('fundo') || name.includes('background')) return ImageIcon;
  if (name.includes('texto') || name.includes('font')) return Type;
  if (name.includes('cubo') || name.includes('3d')) return Box;
  if (name.includes('efeito')) return Sparkles;
  if (name.includes('scroll')) return ScrollText;
  if (name.includes('seção') || name.includes('section')) return Layers;
  if (name.includes('ponteiro') || name.includes('cursor')) return MousePointerClick;
  if (name.includes('pesquisa') || name.includes('search')) return Search;
  if (name.includes('navegação') || name.includes('nav') || name.includes('dock')) return Navigation;
  if (name.includes('página') || name.includes('page')) return MonitorPlay;

  // Default icon
  return Component;
};

interface AppSidebarProps {
  userEmail?: string | null;
  categories?: Category[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  isAdmin?: boolean;
}

const AppSidebar = ({
  userEmail,
  categories = [],
  activeCategory = "Todos",
  onCategoryChange,
  isAdmin = false
}: AppSidebarProps) => {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const secondaryNavItems = [
    { title: "Configurações", icon: Settings, href: "/settings", isRoute: true },
    ...(isAdmin ? [{ title: "Gerenciar Usuários", icon: Shield, href: "/admin/users", isRoute: true }] : []),
  ];

  // Filter to only visible categories
  const visibleCategories = categories.filter(c => c.is_visible);

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-black/95 backdrop-blur-xl">
      <SidebarHeader className="p-4 pt-5">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2 px-2">
              <span className="font-bold text-white text-xl tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                Element Hub
              </span>
              <Crown className="w-5 h-5 text-yellow-500" />
            </div>
          )}
          <SidebarMenuButton
            onClick={toggleSidebar}
            tooltip={isCollapsed ? "Expandir" : "Recolher"}
            className="h-9 w-9 p-0 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
          >
            <PanelLeft className="h-5 w-5 text-gray-400" />
          </SidebarMenuButton>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-zinc-800 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-zinc-800 [&::-webkit-scrollbar-button]:h-4 [&::-webkit-scrollbar-button]:bg-zinc-700 [&::-webkit-scrollbar-button:vertical:start:decrement]:rounded-t-full [&::-webkit-scrollbar-button:vertical:end:increment]:rounded-b-full">
        {visibleCategories.length > 0 && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-500 font-medium uppercase text-[11px] tracking-widest px-2 mb-2">
                Menu de Acesso Rápido
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1.5">
                  {/* "Todos" option */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => onCategoryChange?.("Todos")}
                      tooltip="Todos os Códigos"
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-5 transition-all duration-300 rounded-xl group relative overflow-hidden mb-1",
                        activeCategory === "Todos"
                          ? "text-white border border-white/20"
                          : "text-gray-400 border border-transparent hover:text-white hover:bg-white/5"
                      )}
                    >
                      {activeCategory === "Todos" && (
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-100" />
                      )}

                      <LayoutGrid className={cn(
                        "h-5 w-5 z-10 transition-transform duration-300",
                        activeCategory === "Todos" ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : ""
                      )} />

                      {!isCollapsed && (
                        <span className={cn(
                          "text-[16px] font-medium z-10 tracking-wide transition-all duration-300",
                          activeCategory === "Todos" ? "font-semibold" : ""
                        )}>
                          Todos os Códigos
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Category items */}
                  {visibleCategories.map((category) => {
                    const IconComponent = getCategoryIcon(category.name);
                    const isActive = activeCategory === category.name;

                    return (
                      <SidebarMenuItem key={category.id}>
                        <SidebarMenuButton
                          onClick={() => onCategoryChange?.(category.name)}
                          tooltip={category.name}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-5 transition-all duration-300 rounded-xl group relative overflow-hidden mb-1",
                            isActive
                              ? "text-white border border-white/20"
                              : "text-gray-400 border border-transparent hover:text-white hover:bg-white/5"
                          )}
                        >
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-100" />
                          )}

                          <IconComponent className={cn(
                            "h-5 w-5 z-10 transition-transform duration-300",
                            isActive ? "drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]" : ""
                          )} />

                          {!isCollapsed && (
                            <span className={cn(
                              "text-[16px] font-medium z-10 tracking-wide transition-all duration-300 truncate",
                              isActive ? "font-semibold" : ""
                            )}>
                              {category.name}
                            </span>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator className="my-4 bg-white/10" />
          </>
        )}

        {/* Removed Main Navigation Group */}

        {/* Secondary Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 font-medium uppercase text-[11px] tracking-widest px-2 mb-2">
            Outros
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
                  >
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span className="text-[14px] font-medium">{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-black/40">
        {!isCollapsed && (
          <div className="text-xs text-gray-600 text-center font-medium">
            <p>Element Hub v1.0</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
