import { Home, BookOpen, Settings, HelpCircle, PanelLeft, Sparkles, FolderPlus, Trash2, Pencil } from "lucide-react";
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
import { UIElement } from "@/hooks/useElements";
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface AppSidebarProps {
  onAddCategory: () => void;
  elements: UIElement[];
  onDeleteElement: (id: string) => void;
  onEditElement: (element: UIElement) => void;
}

const AppSidebar = ({ onAddCategory, elements, onDeleteElement, onEditElement }: AppSidebarProps) => {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const mainNavItems = [
    { title: "Início", icon: Home, href: "#" },
    { title: "Como Utilizar", icon: BookOpen, href: "#guide" },
    { title: "Novidades", icon: Sparkles, href: "#news" },
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
        {/* Add Category Button */}
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

        <SidebarSeparator />

        {/* Elements Management */}
        {!isCollapsed && elements.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Gerenciar Elementos</SidebarGroupLabel>
            <SidebarGroupContent>
              <ScrollArea className="h-[200px]">
                <SidebarMenu>
                  {elements.map((element) => (
                    <SidebarMenuItem key={element.id}>
                      <div className="flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted group">
                        <span className="truncate flex-1 text-foreground/80">
                          {element.name}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditElement(element)}
                            className="p-1 hover:bg-primary/20 rounded text-primary"
                            title="Editar"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                className="p-1 hover:bg-destructive/20 rounded text-destructive"
                                title="Excluir"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir elemento?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir "{element.name}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDeleteElement(element.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </ScrollArea>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

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
