import { useState, useMemo } from "react";
import { UIElement } from "@/hooks/useElements";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CodePreview from "./CodePreview";

interface ManageElementsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  elements: UIElement[];
  onEditElement: (element: UIElement) => void;
  onDeleteElement: (id: string) => void;
}

const ManageElementsSheet = ({
  isOpen,
  onClose,
  elements,
  onEditElement,
  onDeleteElement,
}: ManageElementsSheetProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get unique categories from all elements (flattening arrays)
  const categories = useMemo(() => {
    const allCats: string[] = [];
    elements.forEach((el) => {
      const cats = Array.isArray(el.category) ? el.category : [el.category];
      cats.forEach((cat) => {
        if (!allCats.includes(cat)) {
          allCats.push(cat);
        }
      });
    });
    return allCats.sort();
  }, [elements]);

  // Filter elements by category
  const filteredElements = useMemo(() => {
    if (selectedCategory === "all") return elements;
    return elements.filter((el) => {
      const cats = Array.isArray(el.category) ? el.category : [el.category];
      return cats.includes(selectedCategory);
    });
  }, [elements, selectedCategory]);

  // Helper to display categories
  const displayCategories = (category: string | string[]) => {
    const cats = Array.isArray(category) ? category : [category];
    return cats.join(", ");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Gerenciar Elementos</SheetTitle>
          <SheetDescription>
            Edite ou exclua os elementos do seu repositório
          </SheetDescription>
        </SheetHeader>

        {/* Category Filter */}
        <div className="mt-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[calc(100vh-180px)] mt-4 pr-4">
          <div className="space-y-2">
            {filteredElements.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum elemento encontrado
              </p>
            ) : (
              filteredElements.map((element) => (
                <div
                  key={element.id}
                  className="flex items-center p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  {/* Element Preview - Show image if available, otherwise code preview */}
                  <div className="w-12 h-10 rounded-md overflow-hidden border border-border bg-muted/30 flex-shrink-0 flex items-center justify-center mr-3">
                    {element.preview_image && element.preview_image.trim() !== "" ? (
                      <img 
                        src={element.preview_image} 
                        alt={element.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-[120px] h-[100px] transform scale-[0.1] origin-center">
                        <CodePreview code={element.code} className="w-full h-full !border-0" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">
                      {element.name}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {displayCategories(element.category)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 ml-3">
                    <button
                      onClick={() => {
                        onClose();
                        // Small delay to let the sheet close before opening the edit modal
                        setTimeout(() => {
                          onEditElement(element);
                        }, 150);
                      }}
                      className="p-2 hover:bg-primary/20 rounded-lg text-primary transition-colors"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="p-2 hover:bg-destructive/20 rounded-lg text-destructive transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
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
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ManageElementsSheet;
