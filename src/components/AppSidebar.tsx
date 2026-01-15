import { useState } from "react";
import { Plus, LayoutGrid, MousePointer2, CreditCard, FormInput, Loader2, Sparkles, Home, ChevronLeft, ChevronRight } from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";

const categoryIcons: Record<string, React.ElementType> = {
  "Todos": LayoutGrid,
  "Botões": MousePointer2,
  "Cards": CreditCard,
  "Forms": FormInput,
  "Loaders": Loader2,
  "UI": Sparkles,
};

interface AppSidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onAddElement: () => void;
}

const AppSidebar = ({ activeCategory, onCategoryChange, onAddElement }: AppSidebarProps) => {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const categories = ["Todos", "Botões", "Cards", "Forms", "Loaders", "UI"];

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-sm">UI</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-foreground text-sm">UI Elements</span>
              <span className="text-xs text-muted-foreground">Repository</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Add Element Button */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onAddElement}
                  tooltip="Adicionar Elemento"
                  className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
                >
                  <Plus className="h-4 w-4" />
                  {!isCollapsed && <span>Adicionar Elemento</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Categories */}
        <SidebarGroup>
          <SidebarGroupLabel>Categorias</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => {
                const Icon = categoryIcons[category] || LayoutGrid;
                const isActive = activeCategory === category;
                
                return (
                  <SidebarMenuItem key={category}>
                    <SidebarMenuButton
                      onClick={() => onCategoryChange(category)}
                      isActive={isActive}
                      tooltip={category}
                      className={isActive ? "bg-primary/20 text-primary" : ""}
                    >
                      <Icon className="h-4 w-4" />
                      {!isCollapsed && <span>{category}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenuButton
          onClick={toggleSidebar}
          tooltip={isCollapsed ? "Expandir" : "Recolher"}
          className="w-full justify-center"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Recolher</span>
            </>
          )}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
