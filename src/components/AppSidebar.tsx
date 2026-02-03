import { Home, BookOpen, Settings, PanelLeft, Sparkles, Code2 } from "lucide-react";
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
  // Default icon for categories
  return Code2;
};

interface AppSidebarProps {
  userEmail?: string | null;
  categories?: Category[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const AppSidebar = ({ 
  userEmail, 
  categories = [], 
  activeCategory = "Todos",
  onCategoryChange 
}: AppSidebarProps) => {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const mainNavItems = [
    { title: "Início", icon: Home, href: "/", isRoute: true },
    { title: "Como Utilizar", icon: BookOpen, href: "/how-to-use", isRoute: true },
    { title: "Novidades", icon: Sparkles, href: "/whats-new", isRoute: true },
  ];

  const secondaryNavItems = [
    { title: "Configurações", icon: Settings, href: "/settings", isRoute: true },
  ];

  // Filter to only visible categories
  const visibleCategories = categories.filter(c => c.is_visible);

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-3">
        {/* Collapse Button - Top */}
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <span className="font-semibold text-foreground text-lg tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Element Hub
            </span>
          )}
          <SidebarMenuButton
            onClick={toggleSidebar}
            tooltip={isCollapsed ? "Expandir" : "Recolher"}
            className="h-8 w-8 p-0 flex items-center justify-center hover:bg-muted"
          >
            <PanelLeft className="h-5 w-5" />
          </SidebarMenuButton>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Categories Section */}
        {visibleCategories.length > 0 && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="text-muted-foreground uppercase text-[10px] tracking-wider">
                Menu de Acesso Rápido
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* "Todos" option */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => onCategoryChange?.("Todos")}
                      tooltip="Todos os Códigos"
                      className={cn(
                        "relative transition-all duration-200",
                        activeCategory === "Todos" 
                          ? "bg-primary/15 text-primary border-l-2 border-primary" 
                          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Code2 className="h-4 w-4" />
                      {!isCollapsed && <span>Todos os Códigos</span>}
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
                            "relative transition-all duration-200",
                            isActive 
                              ? "bg-primary/15 text-primary border-l-2 border-primary" 
                              : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <IconComponent className="h-4 w-4" />
                          {!isCollapsed && <span className="truncate">{category.name}</span>}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />
          </>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                  >
                    {item.isRoute ? (
                      <Link to={item.href}>
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    ) : (
                      <a href={item.href}>
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </a>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Secondary Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Outros</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                  >
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!isCollapsed && (
          <div className="text-xs text-muted-foreground text-center">
            <p>Element Hub v1.0</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
