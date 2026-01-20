import { Home, BookOpen, Settings, HelpCircle, PanelLeft, Sparkles, FolderPlus, LayoutGrid } from "lucide-react";
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

interface AppSidebarProps {
  onAddCategory: () => void;
  onManageElements: () => void;
}

const AppSidebar = ({ onAddCategory, onManageElements }: AppSidebarProps) => {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const mainNavItems = [
    { title: "Início", icon: Home, href: "/", isRoute: true },
    { title: "Como Utilizar", icon: BookOpen, href: "#guide", isRoute: false },
    { title: "Novidades", icon: Sparkles, href: "#news", isRoute: false },
  ];

  const secondaryNavItems = [
    { title: "Configurações", icon: Settings, href: "#settings" },
    { title: "Ajuda", icon: HelpCircle, href: "#help" },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-3">
        {/* Collapse Button - Top */}
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <span className="font-semibold text-foreground text-lg">Element Hub</span>
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
        {/* Action Buttons */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onAddCategory}
                  tooltip="Adicionar Categoria"
                  className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
                >
                  <FolderPlus className="h-4 w-4" />
                  {!isCollapsed && <span>Adicionar Categoria</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onManageElements}
                  tooltip="Gerenciar Elementos"
                  className="bg-secondary hover:bg-secondary/80 text-foreground border border-border"
                >
                  <LayoutGrid className="h-4 w-4" />
                  {!isCollapsed && <span>Gerenciar Elementos</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

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
                    <a href={item.href}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </a>
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
