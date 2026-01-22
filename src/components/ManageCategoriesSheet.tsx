import { useState, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Trash2, FolderOpen, GripVertical, Eye, EyeOff } from "lucide-react";
import { Category } from "@/hooks/useCategories";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ManageCategoriesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onReorderCategories: (fromIndex: number, toIndex: number) => void;
  onToggleVisibility: (id: string) => void;
}

const ManageCategoriesSheet = ({
  isOpen,
  onClose,
  categories,
  onEditCategory,
  onDeleteCategory,
  onReorderCategories,
  onToggleVisibility,
}: ManageCategoriesSheetProps) => {
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  const handleDelete = () => {
    if (categoryToDelete) {
      onDeleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    dragNodeRef.current = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    
    // Add a slight delay to apply dragging styles
    setTimeout(() => {
      if (dragNodeRef.current) {
        dragNodeRef.current.style.opacity = '0.5';
      }
    }, 0);
  };

  const handleDragEnd = () => {
    if (dragNodeRef.current) {
      dragNodeRef.current.style.opacity = '1';
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragNodeRef.current = null;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex !== null && draggedIndex !== toIndex) {
      onReorderCategories(draggedIndex, toIndex);
    }
    
    handleDragEnd();
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg bg-popover border-border">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              Gerenciar Categorias
            </SheetTitle>
            <SheetDescription className="text-muted-foreground">
              Arraste para reordenar, edite ou exclua suas categorias
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
            {categories.length === 0 ? (
              <div className="text-center py-10">
                <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Nenhuma categoria encontrada</p>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`flex items-center p-4 rounded-lg bg-secondary/50 border transition-all cursor-move
                      ${dragOverIndex === index && draggedIndex !== null && draggedIndex < index 
                        ? 'border-primary border-b-2 mb-1' 
                        : dragOverIndex === index && draggedIndex !== null && draggedIndex > index
                        ? 'border-primary border-t-2 mt-1'
                        : 'border-border hover:bg-secondary/80'}
                      ${draggedIndex === index ? 'opacity-50' : 'opacity-100'}
                    `}
                  >
                    {/* Drag Handle */}
                    <div className="flex items-center justify-center mr-3 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                      <GripVertical className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0 mr-3">
                      <h3 className="font-medium text-foreground truncate">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleVisibility(category.id);
                        }}
                        className={`h-8 w-8 ${category.is_visible ? 'text-primary hover:text-primary/80' : 'text-muted-foreground hover:text-foreground'}`}
                        title={category.is_visible ? 'Visível no repositório' : 'Oculto no repositório'}
                      >
                        {category.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditCategory(category);
                        }}
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCategoryToDelete(category);
                        }}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent className="bg-popover border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria "{categoryToDelete?.name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ManageCategoriesSheet;
