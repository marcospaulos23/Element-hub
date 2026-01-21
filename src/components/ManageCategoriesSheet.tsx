import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Trash2, FolderOpen, ChevronUp, ChevronDown } from "lucide-react";
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
  onReorderCategory: (id: string, direction: 'up' | 'down') => void;
}

const ManageCategoriesSheet = ({
  isOpen,
  onClose,
  categories,
  onEditCategory,
  onDeleteCategory,
  onReorderCategory,
}: ManageCategoriesSheetProps) => {
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleDelete = () => {
    if (categoryToDelete) {
      onDeleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
    }
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
              Edite ou exclua suas categorias
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
            {categories.length === 0 ? (
              <div className="text-center py-10">
                <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Nenhuma categoria encontrada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className="flex items-start justify-between p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary/80 transition-colors"
                  >
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-1 mr-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onReorderCategory(category.id, 'up')}
                        disabled={index === 0}
                        className="h-6 w-6 text-muted-foreground hover:text-primary disabled:opacity-30"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onReorderCategory(category.id, 'down')}
                        disabled={index === categories.length - 1}
                        className="h-6 w-6 text-muted-foreground hover:text-primary disabled:opacity-30"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
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
                        onClick={() => onEditCategory(category)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCategoryToDelete(category)}
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